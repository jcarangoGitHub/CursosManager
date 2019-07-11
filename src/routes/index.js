const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const Course = require('./../models/course');
const Student = require('./../models/student');
const dirPartials = path.join(__dirname, '../../template/partials');
const dirViews = path.join(__dirname, '../../template/views/');

require('../helpers/helpers');

//Hbs
app.set ('view engine', 'hbs');
app.set ('views', dirViews);
hbs.registerPartials(dirPartials);

app.get('/', (req, res) => {
  res.render(dirViews + 'index', {
    myTitle: req.body.myTitle
  });
});

app.get('/formNewCourse', (req, res) => {
  res.render(dirViews + 'formNewCourse', {

  });
});

app.get('/formCourses', (req, res) => {
  res.render(dirViews + 'formCourses', {

  });
});

app.get('/formRegister', (req, res) => {
  res.render(dirViews + 'formRegisterStudent', {
    idCourse: req.query.idCourse
  });
});

app.get('/formStudentsByCourse', (req, res) => {
  res.render(dirViews + 'formStudentsByCourse', {
    idCourse: req.query.idCourse
  });
});

app.get('*', (req, res) => {
  res.render(dirViews + 'error', {
    estudiante: 'error'
  });
});

app.post('/createCourse', (req, res) => {

  let course = new Course({
    id: req.body.idCourse,
    name: req.body.courseName,
    description: req.body.courseDescription,
    value: parseInt(req.body.courseValue),
    modality: parseInt(req.body.courseModality),
    intensity: parseInt(req.body.courseModality)
  })

  course.save((err, result) => {
    if (err) {
      res.render(dirViews + 'index', {
        myTitle: err
      })
    }
    res.render(dirViews + 'index', {
      myTitle: 'Course ' + name + ' created successfully!'
    })
  })

/*
  res.render(dirViews + 'createCourse', {
    id: req.body.idCourse,
    name: req.body.courseName,
    description: req.body.courseDescription,
    value: parseInt(req.body.courseValue),
    modality: parseInt(req.body.courseModality),
    intensity: parseInt(req.body.courseModality)
    //console.log(id + "-" + name + "-" + description + "-" + value + "-" + modality + "-" + intensity )
  });
  */
});

app.post('/registerStudent', (req, res) => {
  let student = new Student({
    idCourse: req.body.idCourse,
    documentId: req.body.documentId,
    name: req.body.name,
    email: req.body.email,
    telephone: req.body.telephone
  });

  student.save((err, result) => {
    if (err) {
      res.render(dirViews + 'index', {
        myTitle: err
      })
    }
    res.render(dirViews + 'index', {
      myTitle: 'The student ' + name + ' has been registered in course ' + idCourse
    })
  });

  /*res.render(dirViews + 'registerStudent', {
    idCourse: req.body.idCourse,
    documentId: req.body.documentId,
    name: req.body.name,
    email: req.body.email,
    telephone: req.body.telephone
  });
  */
});



module.exports = app;
