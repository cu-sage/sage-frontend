var mongoose = require('mongoose');

var curriculaItemModel = mongoose.model('CurriculaItem', new mongoose.Schema({
    name : String,
    children : [],

}));

module.exports = curriculaItemModel;
