var express = require('express');
var app = express();
var path = require('path');
//var bodyParser = require('body-parser');
//var jsonParser = bodyParser.json();
var stats = require("./services/stats");

app.use(express.static(__dirname + "/public"));

app.use("/node_modules",
    express.static(__dirname + "/node_modules")
);

app.use('/stats', stats);

app.get('/', function(req, res) {
    res.sendFile("index.html", {
        root: path.join(__dirname, '/public/views/')
    });
});

app.get('/public/views/:file',function(req, res) {
    res.sendFile(req.params.file, {
        root: path.join(__dirname, '/public/views/')
    });
});

app.get('/instructors', function(req, res) {
    res.sendFile("instructor.html", {
        root: path.join(__dirname, '/public/views')
    });
});

app.get('/students', function(req, res) {
    res.sendFile("student.html", {
        root: path.join(__dirname, '/public/views')
    });
});

app.get("*", function(req, res) {
    res.sendFile("error.html", {
        root: path.join(__dirname, "/public/views")
    });
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
