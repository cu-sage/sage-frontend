var mongoose = require('mongoose');

var studentMetricsModel = mongoose.model('Studentmetric', new mongoose.Schema({
    studentID: mongoose.Schema.Types.ObjectId,
    missionID: mongoose.Schema.Types.ObjectId,
    studentName: String,
    missionName: String,
    enrolled:[mongoose.Schema.Types.Mixed]
}));

module.exports = studentMetricsModel;