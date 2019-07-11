const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  id: {
    type: String,
    require: true
  },
  name: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  value: {
    type: Number,
    require: true
  },
  modality:{
    type: Number
  },
  intensity: {
    type: Number
  }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course
