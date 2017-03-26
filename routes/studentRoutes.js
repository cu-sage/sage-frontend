var express = require('express');
var router = express.Router();
var path = require('path');
var userModel = require('../models/userModel');
var courseModel = require('../models/courseModel');
var assignmentModel = require('../models/assignmentModel.js');
var enrollmentCourseModel = require('../models/enrollmentCourseModel.js');




router.get("/", function(req, res) {
    res.sendFile("student_index.html", {
        root: path.join(__dirname, '../public/views')
    });
});

router.get('/featuredCourses/student/:sid', function(req, res) {

    //getting random two courses.

    courseModel.find().lean().limit(2).exec()
    .then(function(response, error) {
        //TODO - handle error.

        let returnResponse = response.map ((singleCourse) => {
            singleCourse.courseID = singleCourse._id;
            return singleCourse;
        });

        res.status(200).send(returnResponse);
    });

});

router.get('/recentCourses/student/:sid', function(req, res) {

    //getting random two courses.

    courseModel.find().lean().limit(2).exec()
    .then(function(response, error) {
        //TODO - handle error.

        let returnResponse = response.map ((singleCourse) => {
            singleCourse.courseID = singleCourse._id;
            return singleCourse;
        });

        res.status(200).send(returnResponse);
    });

});


router.get ('/coursesEnrolled/student/:sid', function (req, res) {

    let sid = req.params.sid;

    let allCoursesEnrolledIDs = [];
    enrollmentCourseModel.find({studentID:sid}).lean().exec()
    .then((response, error) => {

        response.map((singleEnrollment) => {
            allCoursesEnrolledIDs.push(singleEnrollment.courseID);

        });

        return courseModel.find({'_id': {'$in' : allCoursesEnrolledIDs}}).lean().exec();

    }).then((response, error) => {

        let returnResponse = response.map ((singleCourse) => {
            singleCourse.courseID = singleCourse._id;
            return singleCourse;
        });

        res.status(200).send(returnResponse);

    });



});


// router.post ('/mock', function (req, res) {

    
//     let myData = [
//         {studentID:'585a583aa179408337482a58' , courseID: '58d8476ce9a1b743936bdc2e' },
//         {studentID:'585a583aa179408337482a58' , courseID: '58d8476ce9a1b743936bdc2f'}
//     ];
    
//     enrollmentCourseModel.create(myData,function(err){

//     });

// });



module.exports = router;