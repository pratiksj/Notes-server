const mongoose = require('mongoose')
require("dotenv").config() //dotenv install garepaci 

const url = process.env.MONGODB_URI //local host ko lagi matra ho

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  date: Date,
  important: Boolean,
})

noteSchema.set('toJSON', {                  //this is just format
  transform: (document, returnedObject) => { //returnedObject ma database bata return vako object hunxa
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)