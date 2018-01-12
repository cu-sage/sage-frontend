var mongoose = require('mongoose');

var gameModel = mongoose.model('Game', new mongoose.Schema({
    gameName: String,
    gameOrder: Number,
    assessments: []
}));

module.exports = gameModel;