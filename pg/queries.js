const knex = require("./connections");

module.exports = {
  getAll(table) {
    return knex.select("*").from(table);
  },
  getOne(table, id) {
    return knex.select("*").from(table).where("id", id).first();
  },
  getOneByEmail(table, email) {
    return knex.select("*").from(table).where("email", email).first();
  },
  create(table, item) {
    return knex.insert(item, "*").into(table);
  },
  update(table, id, item) {
    return knex(table).where("id", id).update(item, "*")
  },
  deleteOne(table, id) {
    return knex(table).where("id", id).del();
  }
}