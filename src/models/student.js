const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  idCourse: {
    type: String,
    require: true
  },
  documentId: {
    type: String,
    require: true
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

const Student = mongoose.model('Student', studentSchema);

module.exports = Student
