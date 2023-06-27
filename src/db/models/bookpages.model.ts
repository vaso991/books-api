import { Model, ModelObject, QueryBuilder, RelationMappings } from 'objection';
import { BookModel } from '@/db/models/book.model';

class BookPagesModel extends Model {
  static tableName = 'BookPages';

  static timestamp = true;

  id: string;
  content: string;
  pageNumber: number;
  bookId: string;

  static relationMappings: RelationMappings = {
    book: {
      relation: Model.BelongsToOneRelation,
      modelClass: BookModel,
      join: {
        from: 'BookPages.bookId',
        to: 'Books.id',
      },
    },
  };

  static get modifiers() {
    return {
      orderByPageNumber(builder: QueryBuilder<BookPagesModel>) {
        return builder.orderBy('pageNumber');
      },
    };
  }
}

type BookPagesModelType = ModelObject<BookPagesModel>;
export default BookPagesModel;
export { BookPagesModel };
export type { BookPagesModelType };
