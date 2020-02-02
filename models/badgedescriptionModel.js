var mongoose = require('mongoose');

var badgedescriptionModel = mongoose.model('Badgedescription', new mongoose.Schema({
    badgename: String,
    description: String,
    src: String,
    issuedBy: String
}));

module.exports = badgedescriptionModel;