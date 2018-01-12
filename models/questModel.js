var mongoose = require('mongoose');

var questModel = mongoose.model('Course', new mongoose.Schema({
	questName : String,
    desc : String,
    instructorID : mongoose.Schema.Types.ObjectId,
    games : [],
    features : [String],
    ctConcepts: []

}));

module.exports = questModel;
