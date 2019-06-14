const hbs = require('hbs');
const fs = require('fs');
listCourses = [];
listStudents = [];

hbs.registerHelper('createCourse', (id, name, description, value, modality, intensity) => {
  listCourses = require('../../listCourses.json');
  let duplicated = listCourses.find(course => course.id == id);
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
  fs.writeFile('listCourses.json', data, (err)=>{
    if (err) throw (err);
    console.log('Course created!');
  });
}

hbs.registerHelper('showAvailableCourses', () => {
  listCourses = require('../../listCourses.json');
  let coursesAvailable = [];
  listCourses.forEach(course => {
    if (course.state == 'available') {
      coursesAvailable.push(course);
    }
  });
  let htmlText = "<table class='table table-striped table-hover'> \
              <thead class='thead-dark'> \
              <th>Id</th> \
              <th>Name</th> \
              <th>Description</th> \
              <th>Cost</th> \
              <th>Intensity</th> \
              <th>Action</th> \
              </thead> \
              <tbody>";
  coursesAvailable.forEach(course => {
      htmlText = htmlText +
      '<tr>' +
      '<td>' + course.id + '</td>' +
      '<td>' + course.name + '</td>' +
      '<td>' + course.description + '</td>' +
      '<td>' + course.value + '</td>' +
      '<td>' + course.intensity + '</td>' +
      '<td><a href="/formRegister?idCourse=' + course.id + '" </a>Register</td>';
  });
  htmlText = htmlText + '</tbody></table>';
  return htmlText;
});

hbs.registerHelper('getCourseName', (id) => {
  return getCourseName(id);
});

const getCourseName = (id) => {
  listCourses = require('../../listCourses.json');
  let course = listCourses.find(course => course.id == id);
  return course.name;
}

hbs.registerHelper('registerStudent', (idCourse, documentId, name, email, telephone) => {
  listStudents = require('../../listStudents.json');
  let student = listStudents.find(student => student.documentId == documentId);
  console.log(student);
  let text = "";
  if (student && student.idCourse == idCourse) {
    text = "You can't register the student in the same course twice";
  } else {
    let newStudent = {
      idCourse: idCourse,
      documentId: documentId,
      name: name,
      email: email,
      telephone: telephone
    }
    listStudents.push(newStudent);
    saveStudent();
    text = "The student " + name + ' has been registered successful in course ' + getCourseName(idCourse) + '!!';
  }
  return text;
});

const saveStudent = () => {
  let data = JSON.stringify(listStudents);
  fs.writeFile('listStudents.json', data, (err)=>{
    if (err) throw (err);
    console.log('Student registered!');
  });
}
