var express = require('express');
var authService = require('../services/authService');
var router = express.Router();
var userModel = require('../models/userModel');
var courseModel = require('../models/courseModel');
var assignmentModel = require('../models/assignmentModel.js');
var mongoose = require('mongoose');
var enrollmentCourseModel = require('../models/enrollmentCourseModel.js');
var learningPathModel = require('../models/learningPathModel.js');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var service = require('../services/service');
var curriculaItemModel = require('../models/curriculaItemModel.js');

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
                    res.status(403).send({'status': 'failed', 'message': 'Not authorized1.'});
                }
            });
        } else {
            res.status(403).send({'status': 'failed', 'message': 'Not authorized2.'});
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

router.get("/instructors/courses_home/:id", function(req, res) {
    var id = req.params.id;
    //console.log(id);

    courseModel.find({instructorID:id}).lean().limit(2).exec()
    .then(function(response, error) {
        //TODO - handle error.

        let returnResponse = response.map ((singleCourse) => {
            singleCourse.courseID = singleCourse._id;
            return singleCourse;
        });

        res.status(200).send(returnResponse);
    });


});

router.get("/instructors/LP/:id", function(req, res) {
    var id = req.params.id;
    //console.log(id);

    learningPathModel.find({creatorID:id}).lean().exec()
    .then(function(response, error) {
        //TODO - handle error.

        let returnResponse = response.map ((singleLP) => {
            singleLP.LPID = singleLP._id;
            return singleLP;
        });

        res.status(200).send(returnResponse);
    });

});



router.get("/instructors/coursesby/:id", function(req, res) {
    var id = req.params.id;
    //console.log(id);

    courseModel.find({instructorID:id}).lean().exec()
    .then(function(response, error) {
        //TODO - handle error.

        let returnResponse = response.map ((singleCourse) => {
            singleCourse.courseID = singleCourse._id;
            return singleCourse;
        });

        res.status(200).send(returnResponse);
    });

});

router.get("/instructors/:id/LP/:LPid", function(req, res) {
    let id = req.params.id;
    let LPid = req.params.LPid;


    let allCoursesIDs = [];
    var allcourses;
    learningPathModel.find({_id:LPid}).lean().exec()
    .then((response, error) => {
        
        allcourses=response[0].courses;
        //console.log(allcourses[0]);
        //console.log(allcourses.length);
        for (course1 in allcourses){
            //console.log(allcourses[course1]);
            allCoursesIDs.push(allcourses[course1].CourseID);
        }
        //console.log(allCoursesIDs);
        return courseModel.find({'_id': {'$in' : allCoursesIDs}}).lean().exec();

    }).then((response, error) => {

        let returnResponse = response.map ((singleCourse) => {
            singleCourse.courseID = singleCourse._id;
            return singleCourse;
        });

        //console.log(returnResponse);

        res.status(200).send(returnResponse);

    });

});

router.get("/instructors/:id/LPinfo/:LPid", function(req, res) {
    let id = req.params.id;
    let LPid = req.params.LPid;


    //let allCoursesIDs = [];
    learningPathModel.find({_id: { $in: [ LPid ] }}).lean().exec()
    .then(function(response, error) {

        let returnResponse = response.map ((singleLP) => {
            singleLP.LPID = singleLP._id;
            return singleLP;
        });

        res.status(200).send(returnResponse);

    });

});

router.get("/instructors/:id/courses/:cid", function(req, res) {
    let id = req.params.id;
    let cid = req.params.cid;


    //let allCoursesIDs = [];
    courseModel.find({_id: { $in: [ cid ] }}).lean().exec()
    .then(function(response, error) {

        let returnResponse = response.map ((singleCourse) => {
            singleCourse.courseID = singleCourse._id;
            return singleCourse;
        });

        res.status(200).send(returnResponse);
    });    
});

router.get("/researchers/:id", function(req, res) {
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

router.post("/instructors/createCourse/:id", function(req, res) {
    console.log("In stats routes");
    console.log(req.body);
    var InstrId = req.params.id;
    service.newcourse(req.body.coursename, req.body.desc, InstrId ,req.body.features , req.body.ctconcepts,
        function(json) {
            if (json.status === 409) {
                res.status(409).send({message: json.message});
            } 
            else if (json.status === 200) {
                res.status(200).send({message: json.message});
            }
            else {
                res.status(404).send({message: json.message});
            }
        });
});


router.post("/instructors/createLP/:id", function(req, res) {
    console.log("In stats routes");
    console.log(req.body);
    var InstrId = req.params.id;
    service.newLP(req.body.LPname, req.body.desc, InstrId ,req.body.features , req.body.ctconcepts,
        function(json) {
            if (json.status === 409) {
                res.status(409).send({message: json.message});
            } 
            else if (json.status === 200) {
                res.status(200).send({message: json.message});
            }
            else {
                res.status(404).send({message: json.message});
            }
        });
});

router.post("/instructors/:id/course/:cid/createAssignment", function(req, res) {
    //console.log("In stats routes");
    console.log(req.body);
    var InstrId = req.params.id;
    var courseid = req.params.cid;
    service.newassignment(req.body.order, InstrId ,courseid,
        function(json) {
            if (json.status === 409) {
                res.status(409).send({message: json.message});
            } 
            else if (json.status === 200) {
                res.status(200).send({message: json.message});
            }
            else {
                res.status(404).send({message: json.message});
            }
        });
});

router.post("/instructors/:id/LP/:LPid/addCourse/:cid", function(req, res) {
    //console.log("In stats routes");
    console.log(req.body);
    var InstrId = req.params.id;
    var LPid = req.params.LPid;
    service.addCoursetoLP(req.body.order, req.params.cid, LPid,
        function(json) {
            if (json.status === 409) {
                res.status(409).send({message: json.message});
            } 
            else if (json.status === 200) {
                res.status(200).send({message: json.message});
            }
            else {
                res.status(404).send({message: json.message});
            }
        });
});

router.post("/instructors/:id/LP/:LPid/updateCourseOrder", function(req, res) {
    //console.log("In stats routes");
    console.log(req.body);
    var InstrId = req.params.id;
    var LPid = req.params.LPid;
    service.updateCourseOrderInLP(req.body.courses, LPid,
        function(json) {
            if (json.status === 409) {
                res.status(409).send({message: json.message});
            } 
            else if (json.status === 200) {
                res.status(200).send({message: json.message});
            }
            else {
                res.status(404).send({message: json.message});
            }
        });
});


router.get("/instructors/:id/curricula_items", function(req, res) {
    
    
    curriculaItemModel.find({}).lean().exec()
    .then(function(response, error) {
        console.log(response);
        res.status(200).send(response);

    });

});

module.exports = router;