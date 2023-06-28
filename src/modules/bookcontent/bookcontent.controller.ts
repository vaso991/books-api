import { AppContext } from '@App/utils/app.context';
import { BookContentService } from './bookcontent.service';
import { AddBookContentType } from '@App/modules/bookcontent/bookcontent.schema';
import { castArray } from 'lodash';
import { StatusCodes } from 'http-status-codes';

export class BookContentController {
  /**
   * Add new pages to book by `bookId`.
   * Receives array of pages.
   */
  public static async addPagesToBook(ctx: AppContext) {
    const requestBody = ctx.request.body as AddBookContentType;
    const { bookId } = ctx.params;
    const result = await BookContentService.addPagesToBook(
      bookId,
      ctx.state.user.id,
      requestBody.pages,
    );
    ctx.status = StatusCodes.CREATED;
    ctx.body = result;
  }

  /**
   * Get single books pages by `bookId`.
   */
  public static async getBookPages(ctx: AppContext) {
    const { bookId } = ctx.params;
    ctx.body = await BookContentService.getBookPagesById(
      bookId,
      ctx.state.user.id,
    );
  }

  /**
   * Update book pages by `bookId`.
   * If `page.pageNumber` presents, other pages `pageNumber`'s are recalculated.
   */
  public static async updateBookPageContentById(ctx: AppContext) {
    const { bookId } = ctx.params;
    const { pages } = ctx.request.body as AddBookContentType;
    await BookContentService.updatePages(bookId, ctx.state.user.id, pages);
    ctx.body = await BookContentService.getBookPagesById(
      bookId,
      ctx.state.user.id,
    );
  }

  /**
   * Delete pages by `bookId` and `pageNumber` array
   */
  public static async deletePages(ctx: AppContext) {
    const { bookId } = ctx.params;
    const pageNumbers: string[] = ctx.query.pageNumbers
      ? castArray(ctx.query.pageNumbers)
      : [];
    await BookContentService.deletePages(
      bookId,
      ctx.state.user.id,
      pageNumbers,
    );
    ctx.body = {
      success: true,
    };
  }
}
