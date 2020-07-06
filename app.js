// 伺服器套件設定
const express = require('express')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const app = express()
const port = process.env.PORT || 3000

// 資料庫套件設定
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')

const Url = require('./models/url')

// 設定body-parser
app.use(express.urlencoded({ extended: true }))

// 設定樣板引擎
app.engine('hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'main'
}))
app.set('view engine', 'hbs')

// 連線到MongoDB相關設定
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/url',
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
)
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

// 從陣列隨機抽樣
function sample (array) {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}
// 產生短網址代碼
function getShortPath (originalUrl) {
  // 代碼格式來源
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'
  const upperCaseLetters = lowerCaseLetters.toUpperCase()
  const numbers = '1234567890'
  // 合併成抽樣來源
  let alphanumeric = []
  alphanumeric = alphanumeric.concat(lowerCaseLetters.split('')).concat(upperCaseLetters.split('')).concat(numbers.split(''))
  // 開始抽樣形成短網址的路徑
  let shortPath = ''
  for (let i = 0; i < 5; i++) {
    shortPath += sample(alphanumeric)
  }
  console.log(`The short url of "${originalUrl}" is ${process.env.WEBSITE_URL}/${shortPath}.`)
  return shortPath
}

// 初始首頁
app.get('/', (req, res) => {
  res.render('index')
})

// 送出要縮短的網址
app.post('/', (req, res) => {
  // 短網址的網域名稱
  const websiteUrl = process.env.WEBSITE_URL
  // 要縮短的原始網址
  const originalUrl = req.body.url
  if (originalUrl === '') {
    // 前端input有設定，這邊用來防止其他管道發送請求的結果，另model也有限制格式
    const error = 'Need original url!'
    res.render('index', {
      error
    })
  } else {
    Url.findOne({ // 先搜尋是否已縮短過此網址
      originalUrl: originalUrl
    }).lean()
      .then(url => {
        if (url) { // 有的話，回傳與之前產生時相同的短網址
          console.log(`"${url.originalUrl}" had been shortened!`)
          res.render('index', {
            url, websiteUrl
          })
        } else { // 沒有的話，再檢查是否生成過一樣的短網址
          let shortPath = getShortPath(originalUrl)
          Url.findOne({
            shortPath: shortPath
          }).lean()
            .then(url => {
              url = url || '' // 避免出現"TypeError: Cannot read property 'originalUrl' of null"
              // 用迴圈檢查短網址代碼是否重複，是的話重新生成短網址代碼
              while (url.shortPath === shortPath) {
                console.log('Duplicate shortPath！')
                shortPath = getShortPath(originalUrl)
                break
              }
            })
          // 儲存新的短網址紀錄
          const url = new Url({
            originalUrl: req.body.url,
            shortPath: shortPath
          })
          url.save(err => {
            if (err) return console.error(err)
          })
          res.render('index', JSON.parse(JSON.stringify({ url, websiteUrl })))
        }
      })
  }
})

app.get('/:shortPath', (req, res) => {
  // 從短網址代碼找對應的原始網址
  const shortPath = req.params.shortPath
  Url.findOne({
    shortPath: shortPath
  }).lean()
    .then((url) => {
      url = url || '' // 避免出現"TypeError: Cannot read property 'originalUrl' of null"
      // 直接轉連向原始網站
      res.redirect(`${url.originalUrl}`)
    })
})

app.listen(port, () => {
  console.log(`App is listening: http://localhost:${port}`)
})
