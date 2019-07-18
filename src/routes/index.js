const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const Course = require('./../models/course');
const RegisteredStudent = require('./../models/registeredStudents');
const User = require('./../models/user');
const dirPartials = path.join(__dirname, '../../template/partials');
const dirViews = path.join(__dirname, '../../template/views/');
const bcrypt = require('bcrypt');

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
  if (req.session.user.rol != 'coordinator') {
    res.render(dirViews + 'index', {
      myTitle: 'User not allowed to see this page'
    })
  } else {
    res.render(dirViews + 'formNewCourse', {

    });
  }
});

app.get('/formCourses', (req, res) => {
  if (!req.session.user.rol) {
    res.render(dirViews + 'index', {
      myTitle: 'You must login to see this page'
    })
  } else {
    switch (req.session.user.rol) {
      case 'coordinator':
        Course.find({status: 'available'}).exec((err, result) => {
          if (err) {
            return console.log(err)
          }
          res.render(dirViews + 'formCourses', {
            resListCourses: result,
            userRol: req.session.user.rol
          })
        });
        break;
      case 'candidate':
        Course.find().exec((err, result) => {
          if (err) {
            return console.log(err)
          }
          res.render(dirViews + 'formCourses', {
            resListCourses: result,
            userRol: req.session.user.rol
          })
        });
        break;
      default:

    }

  }
});

app.get('/formRegister', (req, res) => {
  User.findById(req.session.userId, (err, result) => {
    if (err) {
      return console.log(err)
    }
    res.render(dirViews + 'formRegisterStudent', {
      idCourse: req.query.idCourse,
      user: result
      /*documentId: result.documentId,
      studentName: result.firstName + ' ' + result.lastName,
      email: result.email,
      telephone: result.telephone*/
    });
  });
});

app.get('/formStudentsByCourse', (req, res) => {
  RegisteredStudent.find({idCourse: req.query.idCourse}).exec((err, result) => {
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
  if (req.session.user.rol != 'coordinator') {
    res.render(dirViews + 'index', {
      myTitle: 'User not allowed to see this page'
    })
  } else {
    res.render(dirViews + 'formNewUser', {

    });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return console.log(err)
  });
  res.redirect('/');
});

app.get('*', (req, res) => {
  res.render(dirViews + 'error', {
    estudiante: 'error'
  });
});


//POST METHODS
app.post('/login', (req, res) => {
  User.findOne({$or: [{email: req.body.email}, {userName: req.body.email}] }).exec((err, result) => {
    if (err) {
      return console.log(err)
    }

    if (result) {
      if (bcrypt.compareSync(req.body.userPassword, result.password)) {
        req.session.userId = result._id
        req.session.user = result
        res.render(dirViews + 'index', {
          myTitle: 'Welcome ' + result.firstName,
          session: true,
          user: req.session.user
        })
      } else {
        res.render(dirViews + 'index', {
          myTitle: 'Password incorrect'
        })
      }

    } else {
      res.render(dirViews + 'index', {
        myTitle: 'User name or email not found'
      })
    }
  })
})

app.post('/createNewUser', (req, res) => {
  let user = new User({
    documentId: req.body.documentId,
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    rol: req.body.rol,
    email: req.body.email,
    userName: req.body.userName,
    password: bcrypt.hashSync(req.body.password, 10)
  });

  user.save((err, result) => {
    if (err) {
      res.render(dirViews + 'index', {
        myTitle: err
      })
    }

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
  let student = new RegisteredStudent({
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
      myTitle: 'Student registered successful!'
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
  RegisteredStudent.findOneAndDelete({idCourse: req.body.idCourse, documentId: req.body.documentId}, req.body, (err, result) => {
    if (err) {
      return console.log(err)
    }
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
