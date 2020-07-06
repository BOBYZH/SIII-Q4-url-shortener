const mongoose = require('mongoose')
const validator = require('validator')

const Schema = mongoose.Schema
const urlSchema = new Schema({
  originalUrl: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isURL,
      message: '{VALUE} is not a valid URL',
      isAsync: false
    }
  },
  shortPath: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[0-9A-Za-z]{5}$/.test(v)
      },
      message: '{VALUE} is not a valid short path only with letters and numbers, and its length should be 5',
      isAsync: false
    }
  }
})

module.exports = mongoose.model('Url', urlSchema)
