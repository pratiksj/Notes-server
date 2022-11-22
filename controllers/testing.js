const testingRouter = require("express").Router();
const Note = require("../model/note");
const User = require("../model/user");

testingRouter.post("/reset", async (request, response) => {
  await Note.deleteMany({});
  await User.deleteMany({});

  response.status(204).end();
});

module.exports = testingRouter;
