import { BookCreateType } from '@/modules/books/books.schema';
import { BookModel } from '@/db/models/book.model';
import { BookContentService } from '@/modules/bookcontent/bookcontent.service';

export class BooksService {
  /**
   * Create new book.
   * Optinally add pages.
   * @param book Book object with pages.
   * @param authorId Book author id.
   * @returns
   */
  public static async addNewBook(book: BookCreateType, authorId: string) {
    return await BookModel.transaction(async (trx) => {
      const newBook = await BookModel.query(trx).insert(book);
      await newBook.$relatedQuery('author', trx).relate(authorId);
      if (book.pages?.length) {
        await BookContentService.addPagesToBook(
          newBook,
          authorId,
          book.pages,
          trx,
        );
      }
      return newBook;
    });
  }

  /**
   * Update book name.
   * Optionally update book pages.
   * @param bookId Book id
   * @param userId Author id
   * @param book Book object
   * @returns
   */
  public static async updateBook(
    bookId: string,
    userId: string,
    book: BookCreateType,
  ) {
    return await BookModel.transaction(async (trx) => {
      const updatedBook = await BookModel.query(trx)
        .where('authorId', userId)
        .patchAndFetchById(bookId, {
          bookName: book.bookName,
        })
        .throwIfNotFound();
      if (book.pages?.length) {
        await BookContentService.updatePages(
          updatedBook,
          userId,
          book.pages,
          trx,
        );
      }
      return updatedBook;
    });
  }

  /**
   * Get books list.
   * Only needed parameters are returned.
   * To receive `pages`, request book details using id.
   * @param userId author id
   * @param page Current page. Default to 1
   * @param perPage How many items per page.
   * @returns
   */
  public static async getBooksList(
    userId: string,
    page: number = 1,
    perPage: number = 10,
  ) {
    return BookModel.query()
      .where('authorId', userId)
      .orderBy('created_at', 'desc')
      .page(page - 1, perPage)
      .modify('selectCurrentPage');
  }

  /**
   * Get book details and it's pages.
   * @param bookId Book id
   * @param userId Author id
   */
  public static async getBookById(bookId: string, userId: string) {
    return BookModel.query()
      .where('authorId', userId)
      .where('id', bookId)
      .withGraphFetched('pages(orderByPageNumber)')
      .modify('selectCurrentPage')
      .first()
      .throwIfNotFound();
  }

  /**
   * Delete book and it's pages.
   * @param bookId Book id
   * @param userId Author id
   * @returns
   */
  public static async deleteBookById(bookId: string, userId: string) {
    return BookModel.query()
      .where('authorId', userId)
      .where('id', bookId)
      .delete()
      .throwIfNotFound();
  }

  /**
   * Mark page as last read.
   * @param bookId Book id
   * @param userId User id
   * @param page last read page
   * @returns
   */
  public static async setCurrentPageForUser(
    bookId: string,
    userId: string,
    page: number,
  ) {
    const book = await BookModel.query().findById(bookId).throwIfNotFound();
    return book
      .$relatedQuery('currentPage')
      .relate({
        id: userId,
        page: page,
      })
      .onConflict(['bookId', 'userId'])
      .merge(['page']);
  }
}
