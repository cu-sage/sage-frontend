var express = require('express');
var router = express.Router();
var path = require('path');
var userModel = require('../models/userModel');
var courseModel = require('../models/courseModel');
var assignmentModel = require('../models/assignmentModel.js');
var enrollmentCourseModel = require('../models/enrollmentCourseModel.js');
var externalURLs = require ('../config/externalURLs.js');
var fetch =  require ('node-fetch');




router.get("/", function(req, res) {
    res.sendFile("student_index.html", {
        root: path.join(__dirname, '../public/views')
    });
});

router.get('/featuredCourses/student/:sid', function(req, res) {

    //getting random two courses.

    courseModel.find().lean().limit(3).exec()
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


router.post ('/enroll/:cid/student/:sid', function (req, res) {

    let {cid,sid} = req.params;
    //TODO fill the assignments array with data before saving.
    
    enrollmentCourseModel.create({studentID : sid, courseID : cid, assignments : []})
    .then((response) => {
        if (response) {
            res.send(response);
        }
    }).catch((error) => {
        res.status(500).send({error: error});
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

    }).catch((error) => {

        res.status(500).send({error:error});
    });



});


router.get ('/course/:cid/student/:sid', function (req, res) {

    let cid = req.params.cid;
    let sid = req.params.sid;

    //TODO put the progress of the sid in the object - Enrollement done. Do assignmen progress now.
    let course = {};
    let assignmentsHash = {};
    let allAssigmentIDs = [];

    courseModel.findOne({'_id' : cid}).lean().exec()
    .then((response, error) => {
        //res.send(response);
        course = response;
        course.courseID = course._id;
        if (course) {
            


            allAssigmentIDs = course.assignments.map((singleAssignment) => {
                assignmentsHash[singleAssignment.assignmentID] = singleAssignment;
                return singleAssignment.assignmentID;
            });
            
            return assignmentModel.find({'_id': {'$in' : allAssigmentIDs}}).lean().exec();

        } else { 

            //TODO - handle error
        }
        

    }).then((response, error) => {

        response.map((singleAssignment) =>{

            assignmentsHash[singleAssignment._id] = Object.assign({}, singleAssignment, {assignmentID : singleAssignment._id});

        });
        
        course.assignments = []

        for (key in assignmentsHash) {
            course.assignments.push(assignmentsHash[key])
        }

        return enrollmentCourseModel.findOne({"studentID" : sid , "courseID" : cid}).lean().exec()

    }).then((response, error) => {
        course.isEnrolled = (response) ? true : false;

        let callingURL = externalURLs.NODE_SERVER + 'progress/student/' + sid + '?assignmentIDs=' + allAssigmentIDs.join(',');
        return fetch(callingURL , {
            headers : {
                'Content-type' : 'application/json'
            }
        });
        
        
    }).then((responseNode) => {
        return responseNode.json();
        
    }).then ((nodeJSON) => {
        nodeJSONHash = {}

        nodeJSON.map ((singleAssignment) => {
            nodeJSONHash[singleAssignment.assignmentID] = singleAssignment;
        });

        course.assignments.map ((singleAssignment) => {
            singleAssignment.results = {};
            singleAssignment.results = nodeJSONHash[singleAssignment.assignmentID] &&  nodeJSONHash[singleAssignment.assignmentID].results;
        });
        res.send(course);
    })
    .catch ((error) => {
        console.log(error);
        res.status(500).send({error:error});
    })

});



module.exports = router;