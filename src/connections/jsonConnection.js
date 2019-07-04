const fs = require('fs');

const getCourseById = (idCourse) => {
    listCourses = require('../../listCourses.json');
    return listCourses.find(course => course.id == idCourse);
}

const listCourses = () => {
  return require('../../listCourses.json');
}

module.exports = {
  getCourseById,
  listCourses
}
