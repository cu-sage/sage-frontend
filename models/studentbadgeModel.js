var mongoose = require('mongoose');

var studentbadgeModel = mongoose.model('Studentbadge', new mongoose.Schema({
    studentID: mongoose.Schema.Types.ObjectId,
    badgeIDs: [mongoose.Schema.Types.ObjectId]
}));

module.exports = studentbadgeModel;