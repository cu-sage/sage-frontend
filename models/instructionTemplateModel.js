var mongoose = require('mongoose');

var TemplateOfInstructionModel = mongoose.model('TemplateOfInstruction', new mongoose.Schema({
    gameId: String,
    TemplateName: String,
    instructorId: String,
    comment: String,
    moveResult: String
}));

module.exports = TemplateOfInstructionModel;
