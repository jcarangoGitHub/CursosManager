const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
require('./helpers/helpers');


const directoriopublico = path.join(__dirname, '../public');
const directoriopartials = path.join(__dirname, '../template/partials');
const directorioviews = '../template/views/';

app.use(express.static(directoriopublico));
hbs.registerPartials(directoriopartials);
app.use(bodyParser.urlencoded({extended: false}));

//console.log(__dirname)

app.set ('view engine', 'hbs');

app.get('/', (req, res) => {
  res.render(directorioviews + 'index', {

  });
});

app.post('/createCourse', (req, res) => {
  //console.log(req.query);
  console.log('creating');
  let body = req.body;
  res.render(directorioviews + 'createCourse', {
    id: body.id,
    name: body.name,
    description: body.description,
    amount: body.amount,
    modality: body.modality,
    intensity: body.intensity
  });
});

app.get('/listado', (req, res) => {
  res.render(directorioviews + 'listado', {
    titulo: 'Listado'
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


app.listen(3000, () => {
  console.log('Escuchando en el puerto 3000')
});
