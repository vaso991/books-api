/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import request from 'supertest';
import { App } from '../../app';
import { loginTestUser } from '../../../test/jest.helpers';
import { LoginResponseType } from '../auth/auth.schema';

describe('Book', () => {
  let app: App;
  let user: LoginResponseType;
  let bookId: string;

  beforeAll(async () => {
    app = await App.init();
    const response = await loginTestUser(app);
    user = response.body;
  });

  afterAll(() => {
    app.exit();
  });

  it('POST /books', async () => {
    const response = await request(app.getKoaApp().callback())
      .post('/books')
      .set('Authorization', `Bearer ${user.accessToken}`)
      .send({
        bookName: 'testBook',
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(String),
      bookName: expect.any(String),
    });
    bookId = response.body.id;
  });

  it('PUT /books/:id', async () => {
    const bookNewName = 'testBook2';
    const response = await request(app.getKoaApp().callback())
      .put(`/books/${bookId}`)
      .set('Authorization', `Bearer ${user.accessToken}`)
      .send({
        bookName: bookNewName,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(String),
      bookName: bookNewName,
    });
  });

  it('DELETE /books/:id', async () => {
    const response = await request(app.getKoaApp().callback())
      .delete(`/books/${bookId}`)
      .set('Authorization', `Bearer ${user.accessToken}`);
    expect(response.statusCode).toBe(200);
  });
});
