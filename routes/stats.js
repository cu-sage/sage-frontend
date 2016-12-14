var express = require('express');
var authService = require('../services/authService');
var router = express.Router();
var userModel = require('../models/userModel');

router.get("/students/:id", function(req, res) {
    authService.getUser(req, function(user) {
        var userId = user._id;
        var fullname = user.fullname;
        // console.log(userId);
        if (userId != -1) {
            userModel.findById(userId, function (err, user) {
                if (err) {
                    console.log(err);
                    return;
                }
                // console.log('user: ' + user);
                if (user.fullname == req.params.id) {
                    var postId = req.params.id;
                    var data = require('../staticData/' + req.params.id + '-student.json');
                    res.send(JSON.stringify(data));
                } else {
                    res.status(403).send({'status': 'failed', 'message': 'Not authorized.'});
                }
            });
        } else {
            res.status(403).send({'status': 'failed', 'message': 'Not authorized.'});
        }

    });
});

router.get("/instructors/:id", function(req, res) {
    authService.getUser(req, function(user) {
        var userId = user._id;
        var fullname = user.fullname;
        if (userId != -1) {
            userModel.findById(userId, function (err, user) {
                if (err) {
                    console.log(err);
                    return;
                }
                if (user.fullname == req.params.id) {
                    var postId = req.params.id;
                    var data = require('../staticData/' + req.params.id + '-instructor.json');
                    res.send(JSON.stringify(data));
                } else {
                    res.status(403).send({'status': 'failed', 'message': 'Not authorized.'});
                }
            });
        } else {
            res.status(403).send({'status': 'failed', 'message': 'Not authorized.'});
        }
    });

});

router.get("/instructors/:id/courses/:cid/hw/:hid", function(req, res) {
    authService.getUser(req, function(user) {
        var userId = user._id;
        var fullname = user.fullname;
        // console.log(userId);
        if (userId != -1) {
            userModel.findById(userId, function (err, user) {
                if (err) {
                    // console.log(err);
                    callback(err);
                    return;
                }
                if (user.fullname == req.params.id) {
                    var postId = req.params.id;
                    var instructor_data = require('../staticData/' + req.params.id + '-instructor.json');
                    var response = [];
                    var courses = instructor_data.courses;
                    for (var course = 0; course < courses.length; course++) {
                        //console.log(courses[course]);
                        if (courses[course].id == req.params.cid) {
                            // console.log(courses[course].id);
                            var students = courses[course].students;

                            for (var i = 0; i < students.length; i++) {
                                var student_id = students[i];
                                var student_data = require('../staticData/' + student_id + '-student.json');
                                var build = {};
                                build["name"] = student_data.name;
                                build["id"] = student_data.id;
                                for (var j = 0; j < student_data.number_of_courses; j++) {
                                    if (student_data.courses[j].id == req.params.cid) {
                                        build["score"] = student_data.courses[j].individual[req.params.hid - 1];
                                    }
                                }
                                response.push(build);

                            }
                        }
                    }
                    var average = instructor_data.courses[req.params.cid - 1].hw_averages[req.params.hid - 1];
                    res.send(JSON.stringify({data: response, average: average}));
                } else {
                    res.status(403).send({'status': 'failed', 'message': 'Not authorized.'});
                }
            });
        } else {
            res.status(403).send({'status': 'failed', 'message': 'Not authorized.'});
        }
    });

});

module.exports = router;