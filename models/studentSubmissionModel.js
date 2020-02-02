var mongoose = require('mongoose');

var studentSubmissionModel = mongoose.model('studentsubmissions', new mongoose.Schema({
    startTime: String,
    score: String,
    hintUsage: String,
    remainingSeconds: String,
    submitMsg: String,
    endTime: String,
    meaningfulMoves: String,
    maxScoreForGame: String,
    blocks:[],
    studentID: String,
    assignmentID: String,
    objectiveID: String,
    selfExplanation: String,
    sb2File: String,
    hairball_score: String
}));

module.exports = studentSubmissionModel;