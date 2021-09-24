/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
var formidable = require('formidable')
const mediaRouter = require('express').Router()
const util = require('util')
const fs = require('fs')

mediaRouter.post('/', function(request, response, next) {

  var form = new formidable.IncomingForm()

  form.parse(request, function(err, fields, files) {
    if (err) {
      console.error(err.message)
      return
    }
    const file = files.avatar
    const isValid = isFileValid(file)

    if (!isValid) {
      return response.status(400).json({
        status: 'Fail',
        message: 'The file type is not a valid type',
      })
    }

    var oldpath = file.path
    var newpath = 'C:/Users/Miro/OneDrive/Documents/Github/Memedump/backend/Images/' + file.name

    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err
      response.write('File uploaded and moved!')
      response.end()
    })

  })

})

const isFileValid = (file) => {
  const type = file.type.split('/').pop()
  const validTypes = ['jpg', 'jpeg', 'png', 'pdf']
  if (validTypes.indexOf(type) === -1) {
    return false
  }
  return true
}

module.exports = mediaRouter