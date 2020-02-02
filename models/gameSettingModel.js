var mongoose = require('mongoose');

var gameSettingModel = mongoose.model('gamestats', new mongoose.Schema({
    assignmentID: String,
    question: String,
    hint: String,
    time: String,
    basic: String,
    developing: String,
    proficient: String,
    submitMsg: String
}));

module.exports = gameSettingModel;
