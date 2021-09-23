const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')

const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')
const memesRouter = require('./controllers/memes')
const usersRouter = require('./controllers/users')
const mediaRouter = require('./controllers/media')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

const mongoUrl = config.MONGODB_URI
logger.info('connecting to ' , mongoUrl)
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/users', usersRouter)
app.use('/api/memes', memesRouter)
app.use('/api/login', loginRouter)
app.use('/api/upload', mediaRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)



module.exports = app