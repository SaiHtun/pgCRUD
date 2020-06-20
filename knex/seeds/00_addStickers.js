
const stickers = require("../../stickers");
const users = require("../../users");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const hashPass = crypto.randomBytes(15).toString('hex');

exports.seed = async (knex) => {
  await Promise.all(["stickers", "users"].map((table) => knex(table).del()))

  // 
  await knex("stickers").insert(stickers);
  await knex("users").insert(users);
  
};
