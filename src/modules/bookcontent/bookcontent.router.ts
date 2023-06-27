import Router from 'koa-router';
import { BookContentController } from './bookcontent.controller';
import { ZodValidator } from 'koa-router-zod-swagger';
import { z } from 'zod';
import { AuthMiddleware } from '@/modules/auth/auth.middleware';
import { AddBookContentSchema } from '@/modules/bookcontent/bookcontent.schema';

const router = new Router({
  prefix: '/bookcontent/:bookId',
});

router.get(
  '/',
  AuthMiddleware,
  ZodValidator({
    summary: 'Get pages of book by id',
    description: 'Get pages of book by id',
    params: z.object({
      bookId: z.string().uuid(),
    }),
  }),
  BookContentController.getBookPages,
);

router.post(
  '/',
  AuthMiddleware,
  ZodValidator({
    summary: 'Add new pages to book',
    description:
      'pageNumber is optional. If passed, pages after this, will be increased by one',
    params: z.object({
      bookId: z.string().uuid(),
    }),
    body: AddBookContentSchema,
  }),
  BookContentController.addPagesToBook,
);

router.put(
  '/',
  AuthMiddleware,
  ZodValidator({
    summary: 'Update pages content',
    description:
      'If pageNumber exists, update its content. Otherwise add new page',
    params: z.object({
      bookId: z.string().uuid(),
    }),
    body: AddBookContentSchema,
  }),
  BookContentController.updateBookPageContentById,
);

router.delete(
  '/',
  AuthMiddleware,
  ZodValidator({
    summary: 'Delete book pages',
    params: z.object({
      bookId: z.string().uuid(),
    }),
    query: z.object({
      pageNumbers: z.array(z.coerce.number()).or(z.string()),
    }),
  }),
  BookContentController.deletePages,
);

export { router as BookContentRouter };
