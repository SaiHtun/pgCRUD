const express = require("express");
const router = express.Router();
const { getAll, getOne } = require("../pg/queries");
const { orWhereNotExists } = require("../pg/connections");

router.get("/", async (req, res) => {
  const users = await getAll("users");
  if(users) {
    res.json(users);
  }else {
    const err = new Error(`can't get users`)
    err.statusCode = 404;
    orWhereNotExists(err);
  }
})



module.exports = router;