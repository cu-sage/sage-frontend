var mongoose = require('mongoose');

var CommentOfInstructionModel = mongoose.model('CommentOfInstruction', new mongoose.Schema({
    gameId: String,
    instructorId: String,
    comment: String,
    moveResult: String
}));

module.exports = CommentOfInstructionModel;
