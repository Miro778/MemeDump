const jwt = require('jsonwebtoken')
const memesRouter = require('express').Router()
const Meme = require('../models/meme')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

memesRouter.get('/', async (request, response) => {
  // const memes = await Meme.find({})
  const memes = await Meme
  .find({}).populate('user',{ username: 1, name: 1 })

  response.json(memes.map(meme => meme.toJSON()))    
  })

  memesRouter.get('/:id', (request, response, next) => {
    Meme.findById(request.params.id)
      .then(meme => {
        if (meme) {
          response.json(meme.toJSON())
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
  })

  memesRouter.get('/:id/comments', (request, response, next) => {
    Meme.findById(request.params.id)
      .then(meme => {
        if (meme) {
          response.json(meme.comments)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
  })
  
  memesRouter.post('/', async (request, response) => {
    const meme = new Meme(request.body)

    var today = new Date(),
    date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    const token = getTokenFrom(request)
    console.log('Token from request: ', token)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    console.log('Decoded token: ', decodedToken)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    const newMeme = new Meme({
      title: meme.title,
      media: meme.media,
      likes: meme.likes,
      date: date,
      user: user._id
    })

    if (!(newMeme.likes > -1)) newMeme.likes = 0;
    if (newMeme.title !== undefined) {
    const savedMeme = await newMeme.save()
    user.memes = user.memes.concat(savedMeme._id)
    await user.save()
    response.json(savedMeme.toJSON())
    } else response.status(400).end()
  })

  memesRouter.post('/:id/comments', async (request, response) => {

    var today = new Date(),
    date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    const token = getTokenFrom(request)
    console.log('Token from request: ', token)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    console.log('Decoded token: ', decodedToken)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    console.log('request.body of the comment: ' , request.body)
    const comment = {
      content: request.body.content,
      date: date,
      user: user.username,
      avatar: user.avatar
    }

    console.log('adding comment: ' , comment)
    const meme = await Meme.findById(request.params.id)
    console.log('adding the comment to a meme titled ' , meme.title)
    meme.comments.push(comment)
    console.log('the comments after push: ' , meme.comments)
    await meme.save()
    response.json(meme.toJSON())

  })

  memesRouter.delete('/:id', async (request, response, next) => {
    console.log('Finding the meme with this id: ' , request.params.id)
    const meme = await Meme.findById(request.params.id)
    console.log('Deleting this meme: ' , meme)

    const token = getTokenFrom(request)
    console.log('Token from request: ', token)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    console.log('Decoded token: ', decodedToken)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    if ( meme.user.toString() === user.id.toString() ) {
      await Meme.remove(meme)
      .then(() => {
        response.status(204).end()
      })
      .catch(error => next(error))
  } else response.status(401).json({ error: 'token missing or invalid' })
})

  memesRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    var today = new Date(),
    date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    const meme = {
      title: body.title,
      media: body.media,
      likes: body.likes,
      date: date
    }

    console.log('NewMeme: ' , meme)
  
    const newMeme = await Meme.findByIdAndUpdate(request.params.id, meme, { new: true })
    response.json(newMeme.toJSON())
  })
 
  module.exports = memesRouter