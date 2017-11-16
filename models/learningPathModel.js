var mongoose = require('mongoose');

var learningPathModel = mongoose.model('LearningPath', new mongoose.Schema({
    LPName : String,
    desc : String,
    creatorID : mongoose.Schema.Types.ObjectId,
    courses : [],
    features : String,
    ctConcepts: []

}));

module.exports = learningPathModel;
