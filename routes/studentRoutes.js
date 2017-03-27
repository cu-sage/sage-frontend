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


router.get ('/course/:cid/student/:sid', function (req, res) {

    let cid = req.params.cid;
    let sid = req.params.sid;

    //TODO put the progress of the sid in the object 
    let course = {};
    let assignmentsHash = {};

    courseModel.findOne({'_id' : cid}).lean().exec()
    .then((response, error) => {
        //res.send(response);
        course = response;
        course.courseID = course._id;
        if (course) {
            let allAssigmentIDs = [];


            allAssigmentIDs = course.assignments.map((singleAssigment) => {
                assignmentsHash[singleAssigment.assigmentID] = singleAssigment;
                return singleAssigment.assigmentID;
            });

            
            return assignmentModel.find({'_id': {'$in' : allAssigmentIDs}}).lean().exec();

        } else{ 

            //TODO - handle error
        }
        

    }).then((response, error) => {

        response.map((singleAssigment) =>{

            assignmentsHash[singleAssigment._id] = Object.assign({}, singleAssigment, {assignmentID : singleAssigment._id});

        });
        
        course.assignments = []

        for (key in assignmentsHash) {
            course.assignments.push(assignmentsHash[key])
        }

        res.send(course);

    })

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