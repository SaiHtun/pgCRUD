const Knex = require("knex");
/**
 * 
 * @param {Knex} knex 
 */


exports.up = async (knex) => {
  await Promise.all([
    knex.schema.createTable('stickers', (table) => {
      table.increments();
      table.string('name').notNullable().unique();
      table.string('description');
    }),
    knex.schema.createTable('users', (table) => {
      table.increments();
      table.string('name').notNullable().unique();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.boolean('active').defaultTo(true);
      table.string('role').defaultTo('user');
    }),
  ])
};

/**
 * 
 * @param {Knex} knex 
 */

exports.down = async (knex) => {
  await Promise.all([
    knex.schema.dropTable('stickers'),
    knex.schema.dropTable('users')
  ])
};
