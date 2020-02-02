var mongoose = require('mongoose');

var classModel = mongoose.model('Class', new mongoose.Schema({
    name: String,
    description: String,
    roster: [],
    missions: [],
    instructorId: String,
    isDeleted: Boolean,
    moveFeedback: []
}));

module.exports = classModel;