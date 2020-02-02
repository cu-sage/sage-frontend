var mongoose = require('mongoose');

var assignmentPointConfigModel = mongoose.model('assignmentpointconfig', new mongoose.Schema({
    id: String,
    configName: String,
    pointConfig: String
}));

module.exports = assignmentPointConfigModel;
