const mongoose = require('mongoose')

const memeSchema = mongoose.Schema({
  title: String,
  media: {
    type: String,
    minlength: 5,
  },
  likes: Number,
  date: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [
    {
      content: {
        type: String,
        minlength: 1,
      },
      user: String,
      date: String,
      avatar: String
    }
  ],
})

memeSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Meme', memeSchema)