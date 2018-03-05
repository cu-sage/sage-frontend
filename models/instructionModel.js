var mongoose = require('mongoose');

var instructionModel = mongoose.model('Instruction', new mongoose.Schema({
    name: String,
    content: [{
    			heading: String,
    			other: [{description: String,
    					image: String}]
    			}],
    img: String,
    role: String,
    gameId: String // this is 0 for instructor instruction
}));

module.exports = instructionModel;
