const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}
console.log(process.env.MONG); //node ma environment variable pass garna multiple  ways huncha for example command line pass garnne or .env file bata pani pas garna skincha

const password = process.argv[2];

const url = `mongodb+srv://pratiksha:${password}@cluster0.cnk2vze.mongodb.net/MyNotes?retryWrites=true&w=majority`;

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected");

    // const note = new Note({
    //   content: 'JS is HARD',
    //   date: new Date(),
    //   important: false,
    // })
    // return note.save()

    const notes = Note.find({ important: false }); //database call lai nai asynchronous call vanincha ani  tsma promise feri fakincha
    return notes; //asynchronous call garepachi generally javascript ma promise return garxa
  })
  .then((result) => {
    // ani farkeko promise resolve hunasath garnu parne action .then action ma hunxa
    result.forEach((note) => {
      console.log(note);
    });
    //console.log('note saved!')
    return mongoose.connection.close();
  })
  .catch((err) => console.log(err));
