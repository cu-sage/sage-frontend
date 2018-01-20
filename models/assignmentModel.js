var mongoose = require('mongoose');

var assignmentModel = mongoose.model('Assignment', new mongoose.Schema({
    assignmentName: String,
    assignmentOrder: Number,
    assessments: []
}));

module.exports = assignmentModel;