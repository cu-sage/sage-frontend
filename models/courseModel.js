var mongoose = require('mongoose');

var courseModel = mongoose.model('Course', new mongoose.Schema({
    desc : String,
    instructorID : mongoose.Schema.Types.ObjectId,
    assignments : [],
    features : [String],
    ctConcepts: []

}));

module.exports = courseModel;
