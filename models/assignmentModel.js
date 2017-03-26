var mongoose = require('mongoose');

var assignmentModel = mongoose.model('Assignment', new mongoose.Schema({
    assignmentName: String,
    courseID: mongoose.Schema.Types.ObjectId

}));

module.exports = assignmentModel;