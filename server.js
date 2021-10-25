const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = 'Add DB string''; // DataBase url
const dbName = "palindrome";   //Data base name.


//Conecting to data base
app.listen(3000, () => {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
      throw error;
    }
    db = client.db(dbName);
    console.log("Connected to `" + dbName + "`!");
  });
});


//Middle wares 
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

//Serving Files
app.get('/', (req, res) => {
  db.collection('palindromes').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', { data: result })
  })
})


app.post('/check', (req, res) => {

  let isPalindrome = req.body.word === req.body.word.split('').reverse().join('') ? 'is a Palindrome' : 'is not a Palindrome'
  db.collection('palindromes').insertOne({ word: req.body.word, palindrome: isPalindrome }, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.delete('/palindromes', (req, res) => {
  db.collection('palindromes').findOneAndDelete({ word: req.body.msg }, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
