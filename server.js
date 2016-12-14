var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var stats = require("./routes/stats");
var multer = require('multer');
var AWS = require('aws-sdk');
var multerS3 = require('multer-s3');
AWS.config.loadFromPath("config/aws-config.json");
var s3 = new AWS.S3();


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

var uploadVideo = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'sage-videos-2016',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, req.body.assignmentId+".flv")
        }
    })
}).single("file");

app.post('/uploadVideo', jsonParser, function(req, res) {
    uploadVideo(req, res, function(err)  {
        if(err){
            res.json({error_code:1, err_desc:err});
            return;
        }
        res.json({error_code:0, err_desc:null});
    });
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
