const express = require("express");
const router = express.Router();
const { getOneByEmail, create } = require("../pg/queries");
const bcrypt = require("bcrypt");

router.post("/register",async (req, res, next) => {
  // check db if email exist
  const { name, email, password } = req.body;
  const existUser = await getOneByEmail("users", email);
  if(existUser) {
    const err = new Error("User Exist");
    err.statusCode = 422
    next(err);
    return
  }
  const user = {
    name,
    email,
    password: await bcrypt.hash(password, 12),
  }
  try {
    const instance = await create("users", user);
    res.cookie("user_id", instance.id, {
      httpOnly: true,
      expires: new Date(Date.now() + 2 * 3600000),
      signed: true
    })
    res.json(instance[0])
  } catch (error) {
    next({detail: error.detail, message: error.constraint});
  }

  // else insert and set-cookie header using res.cookies(key, value, opt)
})

router.post("/login", async (req, res, next) => {
  console.log(req.body);
  
  const { name, email, password } = req.body;
  const existUser = await getOneByEmail("users", email);
  if(existUser) {
    //  check password
    const isSame = await bcrypt.compare(password, existUser.password);
    if(isSame) {
      res.cookie("user_id", existUser.id, {
        httpOnly: true,
        expires: new Date(Date.now() + 2 * 3600000),
        signed: true
      })
      res.json({
        message: "logged in successfull ✅"
      })
    }else {
      const err = new Error("Invalid User");
      err.statusCode = 403;
      next(err);
    }

  } else {
    const err = new Error("Invalid User");
    err.statusCode = 403;
    next(err);
  }
})

module.exports = router;