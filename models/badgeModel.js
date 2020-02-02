var mongoose = require('mongoose');

var badgeModel = mongoose.model('Badge', new mongoose.Schema({
    studentID: mongoose.Schema.Types.ObjectId,
    badgesearned: [mongoose.Schema.Types.Mixed]
}));

module.exports = badgeModel;