var mongoose = require('mongoose');

var EnrollmentLearningPathModel = mongoose.model('EnrollmentLearningPath', new mongoose.Schema({
    studentID: mongoose.Schema.Types.ObjectId,
    learningPathIDpwd: mongoose.Schema.Types.ObjectId

}));

module.exports = EnrollmentLearningPathModel;
