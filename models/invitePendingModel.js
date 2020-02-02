var mongoose = require('mongoose');

var invitePendingModel = mongoose.model('invitePending', new mongoose.Schema({
    email: { type: String, unique: true, lowercase: true },
    token: String,
    classId: String
}));

module.exports = invitePendingModel;
