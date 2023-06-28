import {
  AddBookContentType,
  BookContentPagesType,
  BookPageType,
} from '@App/modules/bookcontent/bookcontent.schema';
import { BookPagesModel } from '@App/db/models/bookpages.model';
import { sortBy } from 'lodash';
import { BookModel } from '@App/db/models/book.model';
import { Transaction } from 'objection';
import { BooksService } from '../books/books.service';

export class BookContentService {
  /**
   * Add new pages to book.
   * If `page.pageNumber` presents, other pages `pageNumber`'s are recalculated.
   *
   * @param book `boolId` or `BookModel`
   * @param userId user identificator
   * @param pages pages list
   * @param trx knex transaction
   */
  public static async addPagesToBook(
    book: string | BookModel,
    userId: string,
    pages: AddBookContentType['pages'],
    trx?: Transaction,
  ) {
    // Get BookModel if received bookId as parameter.
    if (typeof book === 'string') {
      book = await BooksService.getBookById(book, userId);
    }
    const sortedPages = sortBy(pages, ['pageNumber']);
    // Increase page numbers of following pages
    for (const page of sortedPages) {
      if (page.pageNumber) {
        const exists = await BookPagesModel.query(trx)
          .where('bookId', book.id)
          .where('pageNumber', page.pageNumber)
          .first();
        if (exists) {
          await BookPagesModel.query(trx)
            .where('pageNumber', '>=', page.pageNumber)
            .increment('pageNumber', 1);
        }
      }
    }

    // Insert new pages
    return book.$relatedQuery<BookPagesModel>('pages', trx).insert(sortedPages);
  }

  /**
   * Upsert book pages.
   * If page exists, update it's content.
   * If page does not exists or `page.pageNumber` is missing, add new page.
   * @param bookId Book id
   * @param page Page object
   * @param trx knex transaction
   */
  private static async updateOrInsertBookPage(
    bookId: string,
    page: BookPageType,
    trx?: Transaction,
  ) {
    return await BookModel.relatedQuery<BookPagesModel>('pages', trx)
      .for(bookId)
      .insert({
        content: page.content,
        pageNumber: page.pageNumber,
      })
      .onConflict(['pageNumber', 'bookId'])
      .merge();
  }

  /**
   * Make book pages bulk update.
   * If page exists, update it's content.
   * If page does not exists or `page.pageNumber` is missing, add new page.
   *
   * @param book Book identification or `BookModel`
   * @param userId User id
   * @param pages pages list
   * @param trx knex transaction
   */
  public static async updatePages(
    book: string | BookModel,
    userId: string,
    pages: BookContentPagesType,
    trx?: Transaction,
  ) {
    if (typeof book === 'string') {
      book = await BooksService.getBookById(book, userId);
    }
    if (trx) {
      const updates = pages.map(async (page) =>
        this.updateOrInsertBookPage((book as BookModel).id, page, trx),
      );
      return Promise.all(updates);
    } else {
      return BookPagesModel.transaction((trx) => {
        const updates = pages.map(async (page) =>
          this.updateOrInsertBookPage((book as BookModel).id, page, trx),
        );
        return Promise.all(updates);
      });
    }
  }

  /**
   * Get book pages list.
   * @param bookId Book id
   * @param userId User id
   */
  public static async getBookPagesById(bookId: string, userId: string) {
    const book = await BooksService.getBookById(bookId, userId);
    return book.$relatedQuery<BookPagesModel>('pages').orderBy('pageNumber');
  }

  /**
   * Delete book pages.
   * If no `pages` list presented, all pages will be deleted.
   * @param bookId Book id
   * @param userId User id
   * @param pageNumbers `pageNumber` list
   * @returns
   */
  public static async deletePages(
    bookId: string,
    userId: string,
    pageNumbers?: number[] | string[],
  ) {
    const book = await BooksService.getBookById(bookId, userId);
    const query = book.$relatedQuery<BookPagesModel>('pages').delete();
    if (pageNumbers && pageNumbers.length) {
      query.whereIn('pageNumber', pageNumbers);
    }
    return query.execute();
  }
}
