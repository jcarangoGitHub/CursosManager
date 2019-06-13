const hbs = require('hbs');
const fs = require('fs');
listCourses = [];

hbs.registerHelper('createCourse', (id, name, description, value, modality, intensity) => {
  listCourses = require('../../listaCursos.json');
  let duplicated = listCourses.find(course => course.id == id);
  console.log(duplicated);
  let text = "";
  if (!duplicated) {
    let newCourse = {
      id: id,
      name: name,
      description: description,
      value: value,
      modality: modality,
      intensity: intensity,
      state: 'available'
    }
    listCourses.push(newCourse);
    console.log(listCourses);
    saveCourse();
    text = "Course created successful!";
  } else {
    text = "The course with ID " + id + " is already created, please try with other ID";
  }
  return text;
  //return "creando" + name//id + name + description + value + modality + intensity
});

const saveCourse = () => {
  let data = JSON.stringify(listCourses);
  console.log('saving ' + data);
  fs.writeFile('listaCursos.json', data, (err)=>{
    if (err) throw (err);
    console.log('Course created!');
  });
}

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
