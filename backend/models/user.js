const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    minlength: 3,
  },
  name: String,
  avatar: String,
  joined: String,
  passwordHash: {
    type: String,
    minlength: 3,
  },
  memes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meme'
    }
  ],
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      delete returnedObject.passwordHash
    }
  })

userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)

module.exports = User