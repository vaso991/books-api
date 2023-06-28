import { BooksService } from './books.service';
import { AppContext } from '@App/utils/AppContext';
import { BookCreateType } from '@App/modules/books/books.schema';
import { StatusCodes } from 'http-status-codes';

export class BooksController {
  /**
   * Create new book
   */
  public static async addNewBook(ctx: AppContext) {
    const book = ctx.request.body as BookCreateType;
    const userId = ctx.state.user.id;
    ctx.status = StatusCodes.CREATED;
    ctx.body = await BooksService.addNewBook(book, userId);
  }

  /**
   * Update existing book by id
   */
  public static async updateBook(ctx: AppContext) {
    const book = ctx.request.body as BookCreateType;
    const { id } = ctx.params;
    await BooksService.updateBook(id, ctx.state.user.id, book);
    ctx.body = await BooksService.getBookById(id, ctx.state.user.id);
  }

  /**
   * Get books list.
   * Only required parameters are returned.
   * To receive `pages`, request book details using id.
   */
  public static async getBooksList(ctx: AppContext) {
    const currentPage = +(ctx.request.query.page || 1);
    ctx.body = await BooksService.getBooksList(ctx.state.user.id, currentPage);
  }

  /**
   * Get book details by id.
   */
  public static async getBookById(ctx: AppContext) {
    const { id } = ctx.params;
    ctx.body = await BooksService.getBookById(id, ctx.state.user.id);
  }

  /**
   * Delete book by id and it's pages.
   */
  public static async deleteBookById(ctx: AppContext) {
    const { id } = ctx.params;
    await BooksService.deleteBookById(id, ctx.state.user.id);
    ctx.body = {
      success: true,
    };
  }

  /**
   * Mark page as last read.
   */
  public static async setCurrentPageForUser(ctx: AppContext) {
    const { id } = ctx.params;
    const { page } = ctx.request.body as { page: number };
    await BooksService.setCurrentPageForUser(id, ctx.state.user.id, page);
    ctx.body = {
      success: true,
    };
  }
}
