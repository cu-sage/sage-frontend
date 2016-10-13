var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(__dirname + "/public"));

app.use("/node_modules",
    express.static(__dirname + "/node_modules")
);

app.get('/', function(req, res) {
    res.sendFile("index.html", {
        root: path.join(__dirname, '/public/views/')
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
