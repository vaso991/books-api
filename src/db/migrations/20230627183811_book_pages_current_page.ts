import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('BookPagesCurrenPage', (table) => {
    table
      .uuid('id')
      .primary()
      .unique()
      .defaultTo(knex.raw('gen_random_uuid()'));
    table.integer('page');
    table.uuid('bookId').references('id').inTable('Books').onDelete('CASCADE');
    table.uuid('userId').references('id').inTable('Users').onDelete('CASCADE');
    table.unique(['bookId', 'userId']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('BookPagesCurrenPage');
}
