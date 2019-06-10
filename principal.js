const {cursosImportados} = require ('./cursos');
//console.log(cursosImportados);
const {crearArchivoMatricula} = require ('./archivo');
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));
app.listen(3000);



let cursos = [{
  id: 1,
  nombre: 'Curso de Node JS',
  duracion: '40 horas',
  valor: '$ 100.000'
},
{
  id: 2,
  nombre: 'Curso de Angular',
  duracion: '50 horas',
  valor: '$ 150.000'
},
{
  id: 3,
  nombre: 'Curso Oracle',
  duracion: '80 horas',
  valor: '$ 300.000'
}];

const opciones = {
  id: {
    demand: true,
    alias: 'i'
  },
  nombre: {
    demand: true,
    alias: 'n'
  },
  cedula: {
    demand: true,
    alias: 'c'
  }
}

const argv = require('yargs')
             .command('inscribir', 'Inscribir un estudiante', opciones)
             .argv

let buscarCursoPorId = (p_id) => {
return cursos.find(curso => curso.id == p_id)
};

let mostrarCursoConIntervaloDeTiempo = (id, callback) => {
 setTimeout(function() {
   let curso = buscarCursoPorId(id);
   callback(curso);
 }, 2000);
};


//Principal
var id = argv.id;
var nombre = argv.nombre;
var cedula = argv.cedula;
if (id != null && nombre != null && cedula != null) {
  var resCurso = buscarCursoPorId(argv.id);
  if (resCurso != null) {
    console.log('Curso encontrado!');
    console.log(resCurso);
    crearArchivoMatricula(nombre, cedula, resCurso);
  } else {
    console.log('El curso con ID ' + argv.id + ' no fue encontrado');
    console.log(cursos[0]);
    console.log(cursos[1]);
    console.log(cursos[2]);
  }

} else {
  mostrarCursoConIntervaloDeTiempo(1, function(resCurso) {
    console.log(resCurso);
    mostrarCursoConIntervaloDeTiempo(2, function(resCurso) {
      console.log(resCurso);
      mostrarCursoConIntervaloDeTiempo(3, function(resCurso) {
        console.log(resCurso);
      })
    })
  });
}

app.post('/', function(req, res){
  // compute 'result'
  res.send('oeee');
});
