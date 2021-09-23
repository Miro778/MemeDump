/* eslint-disable no-unused-vars */
var formidable = require('formidable')
const mediaRouter = require('express').Router()
const util = require('util')

mediaRouter.post('/', function(request, response, next) {

  var form = new formidable.IncomingForm()

  form.parse(request, function(err, fields, files) {
    if (err) {

      // Check for and handle any errors here.

      console.error(err.message)
      return
    }
    response.writeHead(200, { 'content-type': 'text/plain' })
    response.write('received upload:\n\n')

    response.end(util.inspect({ fields: fields, files: files }))

  })

})

module.exports = mediaRouter