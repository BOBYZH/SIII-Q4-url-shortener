const mongoose = require('mongoose')
const Url = require('../url')
const urls = require('./url.json').urls

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/url', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection

db.on('error', () => {
  console.error('db error')
})

db.once('open', () => {
  console.log('db connected!')
  for (let i = 0; i < urls.length; i++) {
    const newUrl = new Url({
      originalUrl: urls[i].originalUrl,
      shortPath: urls[i].shortPath
    })
    newUrl.save()
      .catch(err => {
        console.log(err)
      })
  }
  console.log('done')
})
