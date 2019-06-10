const hbs = require('hbs');

hbs.registerHelper('mostrarLogin', () => {

});


hbs.registerHelper('obtenerPromedio', (nota1, nota2, nota3) => {
  return (nota1 + nota2 + nota3) / 3
});

hbs.registerHelper('listar',  () => {
  console.log('listando...')
  listaEstudiantes = require('../listado.json');
  let texto = "<table class='table table-striped table-hover'> \
              <thead class='thead-dark'> \
              <th>Nombre</th> \
              <th>Matematicas</th> \
              <th>Ingles</th> \
              <th>Programación</th> \
              </thead> \
              <tbody>";

  listaEstudiantes.forEach(estudiante => {
    texto = texto +
    '<tr>' +
    '<td>' + estudiante.nombre + '</td>' +
    '<td>' + estudiante.matematicas + '</td>' +
    '<td>'+ estudiante.ingles + '\n' + '</td>' +
    '<td>' + estudiante.programacion + '</td></tr>';
  });
  text = texto + '</tbody></table>';
  return texto;
});

hbs.registerHelper('listar2',  () => {
  console.log('listando...')
  listaEstudiantes = require('../listado.json');
  let texto = "<div class='accordion' id='accordionExample'> \
              <thead class='thead-dark'> \
              <th>Nombre</th> \
              <th>Matematicas</th> \
              <th>Ingles</th> \
              <th>Programación</th> \
              </thead> \
              <tbody>";

  listaEstudiantes.forEach(estudiante => {
    texto = texto +
    '<tr>' +
    '<td>' + estudiante.nombre + '</td>' +
    '<td>' + estudiante.matematicas + '</td>' +
    '<td>'+ estudiante.ingles + '\n' + '</td>' +
    '<td>' + estudiante.programacion + '</td></tr>';
  });
  text = texto + '</tbody></table>';
  return texto;
});
