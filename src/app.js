require('./config/config');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var session = require('express-session');
const server = require('http').createServer(app);
const io = require('socket.io')(server);


//Paths
const dirPublic = path.join(__dirname, '../public');
const dirNodeModules = path.join(__dirname, '../node_modules');
//PORT
const port = process.env.PORT || 3000;


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

//Mongo connection
mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, (err, resutl) => {
  if (err) {
    return console.log('Error connecting db coursesManager: ' + err)
  }
  return console.log('Connected to coursesManager successfully!')
});

let counter = 0;
io.on('connection', client => {
  console.log('user has connected')
  client.emit('message', 'Welcome to page')

  client.on("message", (information) => {
    console.log(information)
  })

  client.on("counter", () => {
    counter ++
    console.log(counter)
    //client.emit('counter', counter)
    io.emit('counter', counter)
  })

  client.on("messageToAll", (messageToAll, callback) => {
    console.log(messageToAll)
    io.emit("messageToAll", messageToAll)
    callback()
  })
})

server.listen(port, () => {
  console.log('Listening on port ' + process.env.PORT);
});
