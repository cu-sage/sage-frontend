var mongoose = require('mongoose');

var commentTemplateModel = mongoose.model('commentTemplate', new mongoose.Schema({
    gameId: String,
    instructorId: String,
    type:{}
}));

module.exports = commentTemplateModel;