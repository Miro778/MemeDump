const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

 usersRouter.get('/', async (request, response) => {
  const users = await User
  .find({}).populate('memes',{ url: 1, title: 1,author:1 })
    response.json(users.map(u => u.toJSON()))
  })
  
 usersRouter.get('/:id', (request, response, next) => {
    User.findById(request.params.id)
      .then(user => {
        if (user) {
          response.json(user.toJSON())
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
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

  if (!(body.avatar)) {
      console.log('avatar missing')
      return response.status(400).json({
        error: 'Avatar missing' }
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
    avatar: body.avatar,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

usersRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const user = {
    username: body.username,
    avatar: body.avatar,
  }

  console.log('NewUser: ' , user)

  const newUser = await User.findByIdAndUpdate(request.params.id, user, { new: true })
  response.json(newUser.toJSON())
})

module.exports = usersRouter