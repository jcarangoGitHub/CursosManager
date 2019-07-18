require('./config/config');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var session = require('express-session');

//Paths
const dirPublic = path.join(__dirname, '../public');
const dirNodeModules = path.join(__dirname, '../node_modules');

//static
app.use(express.static(dirPublic));
app.use('/js', express.static(dirNodeModules + '/jquery/'))
app.use('/js', express.static(dirNodeModules + '/popper.js/'))

//SESSION
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

//MIDWARE
app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.session = true
    res.locals.name = req.session.user.firstName
  }
  next()
});

//Body parser
app.use(bodyParser.urlencoded({extended: false}));

//Routes
app.use(require('./routes/index'))

mongoose.connect('mongodb://localhost:27017/coursesManager',
  {useNewUrlParser: true},
  (err, resutl) => {
    if (err) {
      return console.log('Error connecting db coursesManager')
    }
    return console.log('Connected to coursesManager successfully!')
  });


app.listen(process.env.PORT, () => {
  console.log('Escuchando en el puerto ' + process.env.PORT);
});
