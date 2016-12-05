var express = require('express');
var router = express.Router();

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

router.get("/instructors/:id/courses/:cid/hw/:hid", function(req, res) {
    var postId = req.params.id;
    var instructor_data = require('../staticData/'+req.params.id+'-instructor.json');
    var response = [];
    var courses = instructor_data.courses;
    for (var course = 0; course < courses.length; course++) {
        //console.log(courses[course]);
        if (courses[course].id == req.params.cid) {
            // console.log(courses[course].id);
            var students = courses[course].students;

            for (var i = 0; i < students.length; i++) {
                var student_id = students[i];
                var student_data = require('../staticData/'+student_id+'-student.json');
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
});

module.exports = router;