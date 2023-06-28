/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import request from 'supertest';
import { App } from '../../app';
import { loginTestUser } from '../../../test/jest.helpers';
import { LoginResponseType } from '../auth/auth.schema';

const testBookPages = [
  {
    content: 'page1',
    pageNumber: 1,
  },
  {
    content: 'page2',
    pageNumber: 2,
  },
];

describe('BookContent', () => {
  let app: App;
  let user: LoginResponseType;
  let bookId: string;

  beforeAll(async () => {
    app = await App.init();
    // get test user
    const response = await loginTestUser(app);
    user = response.body;

    // create test book
    const bookResponse = await request(app.getKoaApp().callback())
      .post('/books')
      .set('Authorization', `Bearer ${user.accessToken}`)
      .send({
        bookName: 'testBook',
      });
    expect(bookResponse.statusCode).toBe(201);
    bookId = bookResponse.body.id;
  });

  afterAll(async () => {
    await request(app.getKoaApp().callback())
      .delete(`/books/${bookId}`)
      .set('Authorization', `Bearer ${user.accessToken}`);
    app.exit();
  });

  it('POST /bookcontent/:bookId', async () => {
    const response = await request(app.getKoaApp().callback())
      .post(`/bookcontent/${bookId}`)
      .set('Authorization', `Bearer ${user.accessToken}`)
      .send({ pages: testBookPages });
    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject(testBookPages);
  });

  it('GET /bookcontent/:bookId', async () => {
    const response = await request(app.getKoaApp().callback())
      .get(`/bookcontent/${bookId}`)
      .set('Authorization', `Bearer ${user.accessToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(testBookPages);
  });

  it('DELETE /bookcontent/:bookId', async () => {
    const response = await request(app.getKoaApp().callback())
      .delete(`/bookcontent/${bookId}`)
      .set('Authorization', `Bearer ${user.accessToken}`);
    expect(response.statusCode).toBe(200);
  });
});
