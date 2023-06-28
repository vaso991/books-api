import Router from 'koa-router';
import { BooksController } from './books.controller';
import { ZodValidator } from 'koa-router-zod-swagger';
import { z } from 'zod';
import { AuthMiddleware } from '@App/modules/auth/auth.middleware';
import { BookCreateSchema } from '@App/modules/books/books.schema';

const router = new Router({
  prefix: '/books',
});

router.get(
  '/',
  AuthMiddleware,
  ZodValidator({
    summary: 'Get books list',
    description: 'Get books list',
    query: z.object({
      page: z.coerce.number().optional().default(1),
    }),
  }),
  BooksController.getBooksList,
);

router.get(
  '/:id',
  AuthMiddleware,
  ZodValidator({
    summary: 'Get book and its pages by id',
    description: 'Get book and its pages by id',
    params: z.object({
      id: z.string().uuid(),
    }),
  }),
  BooksController.getBookById,
);
router.post(
  '/',
  AuthMiddleware,
  ZodValidator({
    summary: 'Add new book',
    description: 'Add new book',
    body: BookCreateSchema,
  }),
  BooksController.addNewBook,
);

router.put(
  '/:id',
  AuthMiddleware,
  ZodValidator({
    summary: 'Update book',
    params: z.object({
      id: z.string().uuid(),
    }),
    body: BookCreateSchema,
  }),
  BooksController.updateBook,
);

router.delete(
  '/:id',
  AuthMiddleware,
  ZodValidator({
    summary: 'Delete book by id',
    params: z.object({
      id: z.string().uuid(),
    }),
  }),
  BooksController.deleteBookById,
);

router.put(
  '/:id/page',
  AuthMiddleware,
  ZodValidator({
    summary: 'Set current reading page for user',
    params: z.object({
      id: z.string().uuid(),
    }),
    body: z.object({
      page: z.coerce.number(),
    }),
  }),
  BooksController.setCurrentPageForUser,
);

export { router as BooksRouter };
