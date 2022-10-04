const notesRouter = require("express").Router();
const Note = require("../model/note");
const User = require("../model/user");

notesRouter.get("/", async (request, response) => {
  const myNotes = await Note.find({});
  response.json(myNotes);
});
// notesRouter.get("/", (request, response) => {
//   console.log("get data");
//   Note.find({}).then((notes) => {
//     response.json(notes);
//   });
// });

notesRouter.get("/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

notesRouter.post("/", async (request, response, next) => {
  const body = request.body;

  const user = await User.findById(body.userId);

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
    user: user._id,
  });
  try {
    const newNote = await note.save();
    user.notes.concat(newNote._id);
    user.save();
    response.status(201).json(newNote);
  } catch (error) {
    next(error);
  }

  // note
  //   .save()
  //   .then((savedNote) => {
  //     response.status(201).json(savedNote);
  //   })
  //   .catch((error) => next(error));
});

notesRouter.delete("/:id", (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

notesRouter.put("/:id", (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

module.exports = notesRouter;
