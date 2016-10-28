var express = require('express');
var app = express();
var path = require('path');

app.use("/node_modules",
    express.static(__dirname + "/node_modules")
);

app.get("/students/:id", function(req, res) {
    var postId = req.params.id;
    var data = require('./staticData/'+req.params.id+'-student.json');
    res.send(JSON.stringify(data));
});

app.get("/instructors/:id", function(req, res) {
    var postId = req.params.id;
    var data = require('./staticData/'+req.params.id+'-instructor.json');
    res.send(JSON.stringify(data));
});

app.listen(3001, function() {
    console.log('Data Generator listening on port 3001!');
});

