const fs = require('fs');

let crearArchivoMatricula = (nombre, cedula, curso) => {
  texto = 'El estudiante ' + nombre + ' con cedula ' + cedula +
  ' ha quedado matriculado al curso ' + curso.nombre + ' correctamente!' + '\n'
  fs.writeFile('matricula.txt', texto, (error) => {
    if (error) throw (error);
    console.log('Archivo creado');
  });
};

module.exports = {
  crearArchivoMatricula
};
