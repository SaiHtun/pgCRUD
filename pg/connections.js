const config = require("../knexfile");

const environment = process.env.NODE_ENV || "development";
const knex = require("knex");
const envConfig = config[environment];
const connection = knex(envConfig);

module.exports = connection;