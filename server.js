/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

require('dotenv').config();
const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const User = require('./server/users/userModel.js');

const port = process.env.PORT || 3000;
const user = process.env.USERNAME;
const pword = process.env.PASSWORD;

const app = express();
const conn = mongoose.connection;

mongoose.connect(process.env.MONGODB,(err,success) => {
  if (err) {console.log(err)}
  else {
    app.listen(port,()=>{
      console.log('server on '+ port)
    })
  }

})

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.use(express.static('Client'));

app.get('/', (req, res) => {
  res.redirect('/signup');
});

app.get('#/signup', (req, res) => {
  res.render(`${__dirname}/Client/views/signup.ejs`);
});

app.get('#/login', (req, res) => {
  res.render(`${__dirname}/Client/views/login.ejs`);
});

app.get('#/build_a_book', (req, res) => {
  res.render(`${__dirname}/Client/views/build_a_book.ejs`);
});

app.get('#/my_books', (req, res) => {
  res.render(`${__dirname}/Client/views/my_books.ejs`);
});

app.post('/signup', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const person = User({ username, password });
  person.save((err) => {
    if (err) {
      console.error(err, 'Error');
      res.redirect('/#/signup');
    } else {
      res.redirect('/#/build_a_book');
    }
  });
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username !== undefined && password !== undefined) {
    User.find({ username })
      .then((data) => {
        if (data.length) {
          User.find({ username }, 'username password', (err, person) => {
            if (err) {
              console.error(err, 'Error');
              res.redirect('/#/signup');
            } else if (username === person[0].username && password === person[0].password) {
              res.redirect('/#/build_a_book');
            } else {
              res.redirect('/#/login');
            }
          });
        } else {
          res.redirect('/#/signup');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
});

app.post('/add_a_page', (req, res) => {
  const username = req.body.username;
  const book = req.body.book;

  User.update({ username }, { $push: { books: book } }, (err) => {
    if (err) {
      console.error(err, 'Error');
    } else {
      res.redirect('/#/build_a_book');
    }
  });
});

app.get('/get_books', (req, res) => {
  const username = req.query.username;

  User.find({ username }, 'username password books', (err, person) => {
    if (err) {
      console.error(err, 'ERROR');
    } else {
      res.send(JSON.stringify(person[0].books));
    }
  });
});

app.delete('/delete_a_book', (req, res) => {
  const username = req.query.username;
  const newBooks = [];

  User.find({ username }, 'username password books', (err, person) => {
    if (err) {
      console.error(err, 'ERROR');
    } else {
      person[0].books.forEach((book) => {
        if (book[0] !== req.query.book) {
          newBooks.push(book);
        }
      }, this);
      User.update({ username }, { books: newBooks }, (error) => {
        if (error) {
          console.error(err, 'Error');
        } else {
          res.redirect('/#/my_books');
        }
      });
    }
  });
});
