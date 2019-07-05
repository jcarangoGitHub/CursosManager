const express = require('express');
const app = express();
const path = require('path');
//const hbs = require('hbs');
const bodyParser = require('body-parser');

//require('./helpers/helpers');
require('./config/config');

const directoriopublico = path.join(__dirname, '../public');
const dirNodeModules = path.join(__dirname, '../node_modules');
//const directoriopartials = path.join(__dirname, '../template/partials');
//const directorioviews = '../template/views/';

//app.use(express.static(directoriopublico));
//hbs.registerPartials(directoriopartials);
//app.use(bodyParser.urlencoded({extended: false}));

//console.log(__dirname)

//app.set ('view engine', 'hbs');

//static
app.use(express.static(directoriopublico));
app.use('/js', express.static(dirNodeModules + '/jquery/'))
app.use('/js', express.static(dirNodeModules + '/popper.js/'))

//Body parser
app.use(bodyParser.urlencoded({extended: false}));

//Routes
app.use(require('./routes/index'))


/*app.get('/', (req, res) => {
  res.render(directorioviews + 'index', {

  });
});

app.get('/formNewCourse', (req, res) => {
  res.render(directorioviews + 'formNewCourse', {

  });
});

app.post('/createCourse', (req, res) => {
  res.render(directorioviews + 'createCourse', {
    id: req.body.idCourse,
    name: req.body.courseName,
    description: req.body.courseDescription,
    value: parseInt(req.body.courseValue),
    modality: parseInt(req.body.courseModality),
    intensity: parseInt(req.body.courseModality)
    //console.log(id + "-" + name + "-" + description + "-" + value + "-" + modality + "-" + intensity )
  });
});

app.get('/formCourses', (req, res) => {
  res.render(directorioviews + 'formCourses', {

  });
});

app.get('/formRegister', (req, res) => {
  res.render(directorioviews + 'formRegisterStudent', {
    idCourse: req.query.idCourse
  });
});

app.post('/registerStudent', (req, res) => {
  res.render(directorioviews + 'registerStudent', {
    idCourse: req.body.idCourse,
    documentId: req.body.documentId,
    name: req.body.name,
    email: req.body.email,
    telephone: req.body.telephone
  });
});

app.get('/formStudentsByCourse', (req, res) => {
  res.render(directorioviews + 'formStudentsByCourse', {
    idCourse: req.query.idCourse
  });
});

app.get('*', (req, res) => {
  res.render(directorioviews + 'error', {
    estudiante: 'error'
  });
});

/*app.get('/', function (req, res) {
  res.send('Hello World')
})*/

app.listen(process.env.PORT, () => {
  console.log('Escuchando en el puerto ' + process.env.PORT);
});
