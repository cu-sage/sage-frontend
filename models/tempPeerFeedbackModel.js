var mongoose = require('mongoose');

var tempPeerFeedbackModel = mongoose.model('tempPeerFeedback', new mongoose.Schema({
    assignmentID: String,
    studentID: String,
    feedback : [{type: String}],
    instructorFeedback: String
}));

module.exports = tempPeerFeedbackModel;