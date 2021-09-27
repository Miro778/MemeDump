const mongoose = require('mongoose')

const ticketSchema = mongoose.Schema({
  content: String,
  type: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
})

ticketSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Ticket', ticketSchema)