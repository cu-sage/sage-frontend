var mongoose = require('mongoose');

var enrollmentCourseModel = mongoose.model('EnrollmentCourse', new mongoose.Schema({
    studentID: mongoose.Schema.Types.ObjectId,
    courseID: mongoose.Schema.Types.ObjectId

}));

module.exports = enrollmentCourseModel;