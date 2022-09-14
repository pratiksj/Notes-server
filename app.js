const express = require("express");
const cors = require("cors");
//const Note = require("./model/note");
const middleware = require("./utills/middleware");

//const { response } = require("express");
const notesRouter = require("./controllers/notes");
const App = express(); // app vannema server app banyooo
App.use(express.static("build")); //this is also middleware
App.use(cors());
App.use(express.json());
App.use(middleware.requestLogger);
App.use("/notes", notesRouter);

App.use(middleware.unknownEndpoint);
App.use(middleware.errorHandler);
module.exports = App;

//App.use(errorHandler);

// const PORT = process.env.PORT || "3001"; //kunai server ma chai default port hunca tei vayera ternaery

// App.listen(PORT, () => {
//   console.log(`server listening on ${PORT}`);
// });
