const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const Course = require('./../models/course');
const Student = require('./../models/student');
const User = require('./../models/user');
const dirPartials = path.join(__dirname, '../../template/partials');
const dirViews = path.join(__dirname, '../../template/views/');

require('../helpers/helpers');

//Hbs
app.set ('view engine', 'hbs');
app.set ('views', dirViews);
hbs.registerPartials(dirPartials);

//GET METHODS
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
    Course.find({status: 'available'}).exec((err, result) => {
      if (err) {
        return console.log(err)
      }
      res.render(dirViews + 'formCourses', {
        resListCourses: result
      })
    });
});

app.get('/formRegister', (req, res) => {
  res.render(dirViews + 'formRegisterStudent', {
    idCourse: req.query.idCourse
  });
});

app.get('/formStudentsByCourse', (req, res) => {
  Student.find({idCourse: req.query.idCourse}).exec((err, result) => {
      if (err) {
        return console.log(err)
      }
      res.render(dirViews + 'formStudentsByCourse', {
        idCourse: req.query.idCourse,
        nameCourse: req.query.nameCourse,
        resListStudents: result
      });
  });
});

app.get('/newUser', (req, res) => {
  res.render(dirViews + 'formNewUser', {

  });
});

app.get('*', (req, res) => {
  res.render(dirViews + 'error', {
    estudiante: 'error'
  });
});


//POST METHODS
app.post('/createNewUser', (req, res) => {
  console.log(req.body.email);
  let user = new User({
    documentId: req.body.documentId,
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    rol: req.body.rol,
    email: req.body.email,
    userName: req.body.userName,
    password: req.body.password
  });

  user.save((err, result) => {
    if (err) {
      res.render(dirViews + 'index', {
        myTitle: err
      })
    }
    console.log(result);
    res.render(dirViews + 'index', {
      myTitle: 'User  created successfully!'
    })
  })
})

app.post('/createCourse', (req, res) => {
  Course.findOne({id: req.body.idCourse}).exec((err, result) => {
    if (err) {
      return console.log(err);
    }
    if (result) {
      res.render(dirViews + 'index', {
        myTitle: 'The course with ID ' + req.body.idCourse + ' is already created, please try with other ID'
      })
    } else {
      let course = new Course({
        id: req.body.idCourse,
        name: req.body.courseName,
        description: req.body.courseDescription,
        value: parseInt(req.body.courseValue),
        modality: parseInt(req.body.courseModality),
        intensity: parseInt(req.body.courseIntensity)
        //status: 'available'
      })

      course.save((err, result) => {
        if (err) {
          res.render(dirViews + 'index', {
            myTitle: err
          })
        }
        res.render(dirViews + 'index', {
          myTitle: 'Course ' + result.name + ' created successfully!'
        })
      })
    }
  });



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
      myTitle: 'The student ' + result.name + ' has been registered in course ' + result.idCourse
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

app.post('/deleteStudentFromCourse', (req, res) => {
  console.log('deteling...' + req.body.idCourse + '-' + req.body.documentId);
  Student.findOneAndDelete({idCourse: req.body.idCourse, documentId: req.body.documentId}, req.body, (err, result) => {
    if (err) {
      return console.log(err)
    }
    console.log(result)
    if (!result) {
      res.render(dirViews + 'index', {
        myTitle: 'The student has been not found'
      })
    }
    res.render(dirViews + 'index', {
      myTitle: 'The student ' + result.name + ' has been removed from the course ' + result.idCourse
    })
  })
});

module.exports = app;
