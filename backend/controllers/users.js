const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

 usersRouter.get('/', async (request, response) => {
  const users = await User
  .find({}).populate('memes',{ url: 1, title: 1,author:1 })
    response.json(users.map(u => u.toJSON()))
  }) 
  
usersRouter.post('/', async (request, response) => {
  const body = request.body
  const users = await User.find({})

  if (!(body.username)) {
    console.log('name missing')
    return response.status(400).json({
      error: 'Name missing' }
    )}

  if (!(body.password)) {
    console.log('password missing')
    return response.status(400).json({
      error: 'Password missing' }
    )}

  var today = new Date(),
  date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

  if (body.username.length < 3)
  return response.status(401).json({
    error: 'the username must be longer than 2 characters' })

    if (body.password.length < 3)
    return response.status(401).json({
      error: 'the password must be longer than 2 characters' })

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    joined: date,
    avatar: 'https://media.istockphoto.com/vectors/user-icon-flat-isolated-on-white-background-user-symbol-vector-vector-id1300845620?b=1&k=20&m=1300845620&s=612x612&w=0&h=AGv0X8A5n8D_2iETctrUbpJqonP-Mvb3RrWkWJqKZfE=',
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

module.exports = usersRouter