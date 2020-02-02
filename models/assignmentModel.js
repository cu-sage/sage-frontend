var mongoose = require('mongoose');

var assignmentModel = mongoose.model('Assignment', new mongoose.Schema({
    assignmentName: String,
    assignmentOrder: Number,
    courseId: String, // add quest Id so that we can build a hierarchy of mission-quest-game
    ctConcepts: [], 
    moveFeedbacks: [],
    assignmentFeedbacks: [],
    creatorId: String,
    type: String
}));

module.exports = assignmentModel;