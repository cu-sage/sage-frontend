var mongoose = require('mongoose');

var feedbackTemplateGameLevelModel = mongoose.model('feedbackTemplateGameLevel', new mongoose.Schema({
    gameId: String,
    instructorId: String,
    type: String,
    feedbackComment:[]
}));

module.exports = feedbackTemplateGameLevelModel;
