import { z } from 'zod';
import { BookContentPagesSchema } from '@App/modules/bookcontent/bookcontent.schema';

const BookCreateSchema = z.object({
  bookName: z.string(),
  pages: BookContentPagesSchema.optional(),
});

type BookCreateType = z.infer<typeof BookCreateSchema>;

export { BookCreateSchema };
export type { BookCreateType };
