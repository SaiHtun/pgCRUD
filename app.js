const express = require("express");
const app = express();
const { getAll, getOne, create, update, deleteOne } = require("./pg/queries");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser("keyboard cat"));

// custom middleware
function isValidID(req, res, next) {
  if(!isNaN(req.params.id)) return next();
  next(new Error("invalid id"));
}
function validSticker(sticker) {
  const hasName = typeof sticker.name === "string" && sticker.name.trim() !== "";
  const hasDescription = typeof sticker.description === "string" && sticker.description.trim() !== "";
  return hasName && hasDescription;
}

app.get("/", (req, res) => {
  res.json({
    message: "hello from stickers"
  })  
})

// get stickers
app.get("/stickers", async (req, res) => {
  const stickers = await getAll("stickers");
  res.json(stickers);
})
// individual sticker
app.get("/stickers/:id", isValidID, async (req, res) => {
  const sticker = await getOne("stickers", req.params.id);
  res.json(sticker);
  // res.json({Greet: "Ohiyo"})
})

// add stickers
app.post("/stickers", async (req, res, next) => {
  // add 
  if(validSticker(req.body)) {
    const instance = {
      name: req.body.name,
      description: req.body.description
    };
    const sticker = await create("stickers", instance);
    res.json({
      added: true,
      item: sticker
    })
  }
  const error = new Error("Invalid Sticker");
  error.status = 422;
  next(error);

})
// update
app.put("/stickers/:id", async (req, res) => {
  if(validSticker(req.body)) {
    const instance = await update("stickers", req.params.id, req.body);
    res.json({
      updated: true,
      item: instance
    })
  }else {
    const error = new Error("Invalid Sticker, can't update");
    error.status = 422;
    next(error);
  }
})

// delete
app.delete("/stickers/:id", async (req, res) => {
  const instance = await deleteOne("stickers", req.params.id).returning("*");
  res.json({
    deleted: true,
    item: instance
  })
})

//  User routes
app.use("/users", usersRouter);
app.use("/auth", authRouter);


app.listen(3000, () => {
  console.log("listening on PORT: 3000");
})



app.get("*", (req, res, next) => {
  let err = new Error("Page Not Found");
  err.statusCode = 404;
  err.commit = `${req.ip} tried to reach ${req.originalUrl}`
  next(err);
})

app.use(function(err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500; 

  if (err.shouldRedirect) {
    res.render('myErrorPage') 
  } else {
    res.status(err.statusCode).send({message: err.message, stack: err.stack, commit: err.commit }); // If shouldRedirect is not defined in our error, sends our original err data
  }
});


module.exports = app;