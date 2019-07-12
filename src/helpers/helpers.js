const hbs = require('hbs');
const fs = require('fs');
const jsonConnection = require('../connections/jsonConnection');
const Course = require('./../models/course');

listCourses = [];
listStudents = [];

hbs.registerHelper('createCourse', (id, name, description, value, modality, intensity) => {
  //listCourses = require('../../listCourses.json');
  listCourses = jsonConnection.listCourses();
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

hbs.registerHelper('showStudentsByCourse', (idCourse, resListStudents) => {
  //listStudents = require('../../listStudents.json');
  /*studentsByCourse = [];
  listStudents.forEach(student => {
    if (student.idCourse == idCourse) {
      studentsByCourse.push(student);
    }
  });
  */
  let htmlText = "<table class='table table-striped table-hover'> \
              <thead class='thead-dark'> \
              <th>Document Id</th> \
              <th>Name</th> \
              <th>Email</th> \
              <th>Telephone</th> \
              </thead> \
              <tbody>";
  //studentsByCourse.forEach(student => {
  resListStudents.forEach(student => {
    htmlText = htmlText +
    '<tr>' +
    '<td>' + student.documentId + '</td>' +
    '<td>' + student.name + '</td>' +
    '<td>' + student.email + '</td>' +
    '<td>' + student.telephone + '</td></tr>';
  });
  htmlText = htmlText + '</tbody></table>';
  return htmlText;
});

hbs.registerHelper('showAvailableCourses', (resListCourses) => {
  //listCourses = require('../../listCourses.json');
  let coursesAvailable = [];
  resListCourses.forEach(course => {
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
              <th>Actions</th> \
              </thead> \
              <tbody>";
  //coursesAvailable.forEach(course => {
  resListCourses.forEach(course => {
      htmlText = htmlText +
      '<tr>' +
      '<td>' + course.id + '</td>' +
      '<td>' + course.name + '</td>' +
      '<td>' + course.description + '</td>' +
      '<td>' + course.value + '</td>' +
      '<td>' + course.intensity + '</td>' +
      '<td><a href="/formRegister?idCourse=' + course.id + '" </a>Register  ' +
      '- <a href="/formStudentsByCourse?idCourse=' + course.id + '" </a>Students registered </td></tr>';
  });
  htmlText = htmlText + '</tbody></table>';
  return htmlText;
});

hbs.registerHelper('getCourseName', (idCourse) => {
  //return getCourseName(id);
  return getCourseNameMongo(idCourse, function(name) { return name});
});

let getCourseNameMongo = (idCourse, callback) => {
  Course.findOne({id: idCourse}).exec((err, result) => {
    if (err) {
      return console.log(err);
    }
    callback (result.name);
  });
}

/*
const getCourseName = (idCourse) => {
  listCourses = require('../../listCourses.json');
  let course = listCourses.find(course => course.id == idCourse);
  return course.name;
}*/

hbs.registerHelper('registerStudent', (idCourse, documentId, name, email, telephone) => {
  listStudents = require('../../listStudents.json');
  let student = listStudents.find(student => student.documentId == documentId);
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
