var mongoose = require('mongoose');

var assignmentModel = mongoose.model('Assignment', new mongoose.Schema({
    assignmentName: String

}));

module.exports = assignmentModel;