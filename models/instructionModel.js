var mongoose = require('mongoose');

var instructionModel = mongoose.model('Instruction', new mongoose.Schema({
    name: String,
    content: [],
    img: String,
    role: String,
    gameId: String, // this is 0 for instructor instruction
    gameName: String
}));

module.exports = instructionModel;
