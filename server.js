var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

app.use(express.static(__dirname + "/public"));

app.use("/node_modules",
    express.static(__dirname + "/node_modules")
);

app.get('/', function(req, res) {
    res.sendFile("index.html", {
        root: path.join(__dirname, '/public/views/')
    });
});

app.get('/instructor', function(req, res) {
    res.sendFile("instructor.html", {
        root: path.join(__dirname, '/public/views')
    });
});

app.get('/student', function(req, res) {
    res.sendFile("student.html", {
        root: path.join(__dirname, '/public/views')
    });
});

// routes for static data
app.get("/students/:id", function(req, res) {
    var postId = req.params.id;
    var data = require('./staticData/'+req.params.id+'-data.json');
    res.send(JSON.stringify(data));
});

app.get("/instructors/:id", function(req, res) {
    var postId = req.params.id;
    var data = require('./staticData/'+req.params.id+'-data.json');
    res.send(JSON.stringify(data));
});

app.get("*", function(req, res) {
    res.sendFile("error.html", {
        root: path.join(__dirname, "/public/views")
    });
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
