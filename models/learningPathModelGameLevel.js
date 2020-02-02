var mongoose = require('mongoose');

var learningPathModelGameLevel = mongoose.model('LearningPathGameLevel', new mongoose.Schema({
    gameID : String,
    instructorID : String,
    ctConcepts: []
}));

module.exports = learningPathModelGameLevel;
