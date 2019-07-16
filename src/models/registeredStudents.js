const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registeredStudentSchema = new Schema({
  idCourse: {
    type: String,
    require: true,
    index: true
  },
  documentId: {
    type: String,
    require: true,
    index: true
  },
  name: {
    type: String,
    require: true
  },
  email: {
    type: String
  },
  telephone: {
    type: String
  }
});

registeredStudentSchema.index({idCourse: 1, documentId: 1}, {unique: true});
const RegisteredStudent = mongoose.model('RegisteredStudent', registeredStudentSchema);

module.exports = RegisteredStudent
