import { Model, ModelObject, RelationMappings } from 'objection';
import { timestampPlugin } from 'objection-timestamps';
import { BookModel } from './book.model';

class UserModel extends timestampPlugin()(Model) {
  static tableName = 'Users';

  static timestamp = true;

  id: string;
  email: string;
  password: string;
  updated_at: string;
  created_at: string;

  static relationMappings: RelationMappings = {
    books: {
      relation: Model.HasManyRelation,
      modelClass: BookModel,
      join: {
        from: 'Users.id',
        to: 'Books.authorId',
      },
    },
    currentPage: {
      relation: Model.HasOneThroughRelation,
      modelClass: BookModel,
      join: {
        from: 'Users.id',
        through: {
          from: 'BookPagesCurrenPage.userId',
          to: 'BookPagesCurrenPage.bookId',
        },
        to: 'Books.id',
      },
    },
  };
}

type UserModelType = ModelObject<UserModel>;
export default UserModel;
export { UserModel };
export type { UserModelType };
