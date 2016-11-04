var express = require('express');
var router = express.Router();
/*var http = require('http');

var options = {
    host: 'localhost',
    port: 3001,
    path: '/students/123'
};

http.get(options, function(resp){
    resp.on('data', function(chunk){
        //do something with chunk
    });
}).on("error", function(e){
    console.log("Got error: " + e.message);
});

router.get('/students/123', function(req, res, next) {
    http.get(options, function(resp){
        resp.on('data', function(result){
            res.json(result);
        });
    }).on("error", function(e){
        console.log("Got error: " + e.message);
    });
});
*/

router.get("/students/:id", function(req, res) {
    var postId = req.params.id;
    var data = require('../staticData/'+req.params.id+'-student.json');
    res.send(JSON.stringify(data));
});

router.get("/instructors/:id", function(req, res) {
    var postId = req.params.id;
    var data = require('../staticData/'+req.params.id+'-instructor.json');
    res.send(JSON.stringify(data));
});

module.exports = router;