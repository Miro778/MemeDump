/* eslint-disable no-undef */
const jwt = require('jsonwebtoken')
const ticketRouter = require('express').Router()
const Ticket = require('../models/ticket')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

ticketRouter.get('/', async (request, response) => {
  const tickets = await Ticket
    .find({}).populate('user',{ username: 1, name: 1 })

  response.json(tickets.map(ticket => ticket.toJSON()))
})

ticketRouter.post('/', async (request, response) => {
  const ticket = new Ticket(request.body)
  console.log('ticket: ' , ticket)
  const token = getTokenFrom(request)
  console.log('Token from request: ', token)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const newTicket = new Ticket({
    content: ticket.content,
    type: ticket.type,
    user: user._id
  })

  if (newTicket.content !== undefined) {
    const savedTicket = await newTicket.save()
    response.json(savedTicket.toJSON())
  } else response.status(400).end()
})

module.exports = ticketRouter