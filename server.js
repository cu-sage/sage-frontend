var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var stats = require("./routes/stats");
var authRouter = require('./routes/auth');
var multer = require('multer');
var AWS = require('aws-sdk');
var multerS3 = require('multer-s3');
AWS.config.loadFromPath("config/aws-config.json");
var s3 = new AWS.S3();
var mongoose = require('mongoose');
// var useragent = require('express-useragent');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://user:user@ds133328.mlab.com:33328/sage-login');

app.use('/public', express.static(__dirname + "/public"));

app.use("/node_modules",
    express.static(__dirname + "/node_modules")
);

app.use('/stats', stats);

app.get('/instructor', function(req, res) {
    res.sendFile("instructor_index.html", {
        root: path.join(__dirname, '/public/views')
    });
});

app.get('/student', function(req, res) {
    res.sendFile("student_index.html", {
        root: path.join(__dirname, '/public/views')
    });
});

app.get('/', function(req, res) {
    res.sendFile("index.html", {
        root: path.join(__dirname, '/public/views')
    });
});

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'sage-student-avatar',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, req.body.sid+"-student.jpg")
        }
    })
}).single("file");

app.post('/upload', jsonParser, function(req, res) {
    upload(req, res, function(err)  {
        if(err){
            res.json({error_code:1, err_desc:err});
            return;
        }
        res.json({error_code:0, err_desc:null});
    });
});

app.use('/auth', authRouter);

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
