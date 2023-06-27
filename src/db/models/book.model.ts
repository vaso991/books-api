import { Model, ModelObject, QueryBuilder, RelationMappings } from 'objection';
import { timestampPlugin } from 'objection-timestamps';
import { UserModel } from '@/db/models/user.model';
import { BookPagesModel } from '@/db/models/bookpages.model';

class BookModel extends timestampPlugin()(Model) {
  static tableName = 'Books';

  static timestamp = true;

  id: string;
  bookName: string;
  authorId: string;
  updated_at: string;
  created_at: string;

  static relationMappings: RelationMappings = {
    author: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'Books.authorId',
        to: 'Users.id',
      },
    },
    pages: {
      relation: Model.HasManyRelation,
      modelClass: BookPagesModel,
      join: {
        from: 'Books.id',
        to: 'BookPages.bookId',
      },
    },
    currentPage: {
      relation: Model.HasOneThroughRelation,
      modelClass: `${__dirname}/user.model`,
      join: {
        from: 'Books.id',
        through: {
          from: 'BookPagesCurrenPage.bookId',
          to: 'BookPagesCurrenPage.userId',
          extra: ['page'],
        },
        to: 'Users.id',
      },
    },
  };

  static modifiers = {
    selectCurrentPage(query: QueryBuilder<BookModel>) {
      return query.select(
        'Books.*',
        BookModel.relatedQuery('currentPage').select('page').as('currentPage'),
      );
    },
  };
}

type BookModelType = ModelObject<BookModel>;
export default BookModel;
export { BookModel };
export type { BookModelType };
