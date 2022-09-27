const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Note = require("../model/note");
const helper = require("./test_helper");

const api = supertest(app); // supertest le app lai wrap garyo

// const initialNotes = [  ===> yo chahiyena hamlaii
//   {
//     content: "HTML is easy",
//     date: new Date(),
//     important: false,
//   },
//   {
//     content: "Browser can execute only Javascript",
//     date: new Date(),
//     important: true,
//   },
// ];
// beforeEach(async () => {
//   await Note.deleteMany({});
//   await Note.insertMany(helper.initialNotes); //mongoose library deko ho javascript ma jahapani chaluna mildaina
// });

beforeEach(async () => {
  await Note.deleteMany({});

  const noteObjects = helper.initialNotes.map((note) => new Note(note)); //mogoose schema ko new note banako
  const promiseArray = noteObjects.map((note) => note.save()); //each .save return promise which promiseArray ma promise xa
  await Promise.all(promiseArray);
}); // yo line ma aayera await prominse.all le sbai promise lai parkhinxa
//prmise.all chai javascript ma jaha pani chalauna pauxa
//   //previous code
//   // await Note.deleteMany({});
//   // let noteObject = new Note(helper.initialNotes[0]);
//   // await noteObject.save();
//   // noteObject = new Note(helper.initialNotes[1]);
//   // await noteObject.save();
// });

describe("when there is initially some notes save", () => {
  test("notes are returned as json", async () => {
    await api
      .get("/api/notes")
      .expect(200)
      //.expect("Content-Type", "application/json; charset=utf-8");
      .expect("Content-Type", /application\/json/); // this is regular expression
    // this is regular expression
  });

  test("all notes are returned", async () => {
    const response = await api.get("/api/notes");

    expect(response.body).toHaveLength(helper.initialNotes.length);
  });

  test("a specific note is within the returned notes", async () => {
    const response = await api.get("/api/notes");

    const contents = response.body.map((r) => r.content);
    expect(contents).toContain("Browser can execute only Javascript");
  });
});

describe("addition of a new note", () => {
  test("a valid note can be added", async () => {
    const newNote = {
      content: "async/await simplifies making async calls",
      important: true,
    };

    await api
      .post("/api/notes")
      .send(newNote)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);
    const contents = notesAtEnd.map((n) => n.content);

    // const contents = notesAtEnd.map(n => n.content)

    // const response = await api.get("/api/notes");

    // const contents = response.body.map((r) => r.content);

    expect(contents).toContain("async/await simplifies making async calls");
  });

  test("note without content is not added", async () => {
    const newNote = {
      important: true,
    };

    await api.post("/api/notes").send(newNote).expect(400);

    const response = await api.get("/api/notes");

    expect(response.body).toHaveLength(helper.initialNotes.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
