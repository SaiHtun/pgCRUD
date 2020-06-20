// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: "postgresql://admin:123@localhost:5444/stickers_db",
    migrations: {
      directory: "./knex/migrations"
    },
    seeds: {
      directory: "./knex/seeds"
    }
  },

};
