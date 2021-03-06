const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const bcrypt = require('bcrypt');
const multer  = require('multer');

const Course = require('./../models/course');
const RegisteredStudent = require('./../models/registeredStudents');
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
  userImage = null
  if (req.session.userImage) {
    userImage = req.session.userImage
  }
  console.log(userImage)
  res.render(dirViews + 'index', {
    myTitle: req.body.myTitle,
    userImage: userImage
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

app.get('/formNewUser', (req, res) => {
  if (req.session.user.rol != 'coordinator') {
    res.render(dirViews + 'index', {
      myTitle: 'User not allowed to see this page'
    })
  } else {
    res.render(dirViews + 'formNewUser', {
      isUpdate: false
    });
  }
});

app.get('/formUpdateUser', (req, res) => {
  res.render(dirViews + 'formNewUser', {
    isUpdate: true,
    user: req.session.user
  });
})

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return console.log(err)
  });
  res.redirect('/');
});

app.get('/formChat', (req, res) => {
  res.render(dirViews + 'formChat', {
    nickname: req.session.user.firstName
  });
})

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
        userImage = null
        if (result.image != null) {
          userImage = result.image.toString('base64')
          req.session.userImage = userImage
        }
        res.render(dirViews + 'index', {
          myTitle   : 'Welcome ' + result.firstName,
          session   : true,
          user      : req.session.user,
          userImage : userImage
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

var upload = multer({
  limits: {
    fileSize : 10000000 //MB
  },
  fileFilter (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return cb(new Error('Invalid file. Use jpg, png or jpeg files'))
    }
  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted

  // To reject this file pass `false`, like so:
  //cb(null, false)

  // To accept the file pass `true`, like so:
  cb(null, true)

  // You can always pass an error if something goes wrong:
  //cb(new Error('I don\'t have a clue!'))

}
});
app.post('/createNewUser', upload.single('userImage'), (req, res) => {
  console.log(req.body.isUpdate);
  if (req.body.isUpdate) {
    var userImage;
    if (req.file) {
      userImage = req.file.buffer
    } else {
      userImage = req.session.user.image
    }
    User.updateOne({documentId: req.body.documentId},
                   {rol: req.body.rol,
                    email: req.body.email,
                    telephone: req.body.telephone,
                    image: userImage},
                    (err, result) => {
                        if (err) {
                          return console.log('Error updating')
                        }
                        res.render(dirViews + 'index', {
                          myTitle: 'User updated successfully!'
                        })
                    });
  } else {
    let user = new User({
      documentId: req.body.documentId,
      lastName: req.body.lastName,
      firstName: req.body.firstName,
      rol: req.body.rol,
      email: req.body.email,
      userName: req.body.userName,
      password: bcrypt.hashSync(req.body.password, 10),
      telephone: req.body.telephone,
      image: req.file.buffer
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
  }
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

    const msg = {
     to: req.body.email,
     from: 'juancamiloarango@gmail.com',
     subject: 'Welcome to course',
     text: 'Welcome, you has been registered successfully'
    };
    sgMail.send(msg);
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
