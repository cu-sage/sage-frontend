var mongoose = require('mongoose');

var userModel = mongoose.model('User', new mongoose.Schema({
    email: { type: String, unique: true, lowercase: true },
    password: { type: String, select: false },
    fullname: String,
    role: String,
    accessToken: String
}));

module.exports = userModel;
