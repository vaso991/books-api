import { z } from 'zod';

const BookPageSchema = z.object({
  content: z.string(),
  pageNumber: z.number().min(1).optional(),
});
type BookPageType = z.infer<typeof BookPageSchema>;
export { BookPageSchema };
export type { BookPageType };

const BookContentPagesSchema = z.array(BookPageSchema);
type BookContentPagesType = z.infer<typeof BookContentPagesSchema>;

export { BookContentPagesSchema };
export type { BookContentPagesType };

const AddBookContentSchema = z.object({
  pages: BookContentPagesSchema,
});
type AddBookContentType = z.infer<typeof AddBookContentSchema>;

export { AddBookContentSchema };
export type { AddBookContentType };
