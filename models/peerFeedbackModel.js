var mongoose = require('mongoose');

var peerFeedbackModel = mongoose.model('peerFeedback', new mongoose.Schema({
    assignmentID: String,
    studentID: String,
    firstBlock: String,
    wrongBlock: String,
    correctBlock: String,
    feedback : String
}));

module.exports = peerFeedbackModel;
