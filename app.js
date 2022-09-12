const express = require("express");
const cors = require("cors");
const Note = require("./model/note");
const middleware = require("./utills/middleware");

const { response } = require("express");
const App = express(); // app vannema server app banyooo
App.use(express.static("build")); //this is also middleware
App.use(cors());
App.use(express.json());
App.use(middleware.requestLogger);

// App.use((request, response, next) => {
//   //console.log("This is middleware")
//   console.log("Method:", request.method);
//   console.log("Path:  ", request.path);
//   console.log("Body:  ", request.body);
//   console.log("---");
//   response.someThis = "hellow there";
//   next(); //next must be call to run every code below otherwise it gets blocked
// });

//App.use(express.json())

// let notes = [
//     {
//       "id": 1,
//       "content": "hello there",
//       "date": "2022-1-17T17:30:31.098Z",
//       "important": false
//     },
//     {
//       "id": 2,
//       "content": "Browser can execute only JavaScript",
//       "date": "2022-1-17T18:39:34.091Z",
//       "important": true
//     },
//     {
//       "id": 3,
//       "content": "GET and POST are the most important methods of HTTP protocol",
//       "date": "2022-1-17T19:20:14.298Z",
//       "important": false
//     }
// ]

App.get("/", (request, response) => {
  response.send("<h1>hello world</h1>");
});
const notes = [];

App.get("/notes", (request, response) => {
  Note.find().then((result) => response.json(result));
  //response.json(notes)
});

App.get("/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      //database call gareko fail vayo vane error falxa
      console.log(error);
      next(error);
      //response.status(500).end()
    });
  // const currentId = Number(request.params.id);
  // //console.log(currentId)
  // const thisNote = notes.find((note)=>note.id === currentId)
  // if (thisNote) response.json(thisNote)
  // else response.status(404).json({error:404, message:`There is no note with id ${currentId}`})
});

App.delete("/notes/:id", (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});
App.post("/notes", (request, response, next) => {
  const body = request.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((error) => next(error));
});
App.put("/notes/:id", (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

App.use((request, response, next) => {
  response.status(404).send("<h1>No routes found for this request</h1>");
});
App.use(middleware.unknownEndpoint);
App.use(middleware.errorHandler);
//App.use(errorHandler);

// const PORT = process.env.PORT || "3001"; //kunai server ma chai default port hunca tei vayera ternaery

// App.listen(PORT, () => {
//   console.log(`server listening on ${PORT}`);
// });
