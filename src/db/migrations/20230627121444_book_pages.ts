import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('BookPages', (table) => {
    table
      .uuid('id')
      .primary()
      .unique()
      .defaultTo(knex.raw('gen_random_uuid()'));
    table.text('content');
    table.increments('pageNumber', { primaryKey: false });
    table.uuid('bookId').references('id').inTable('Books').onDelete('CASCADE');
    table.unique(['bookId', 'pageNumber']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('BookPages');
}
