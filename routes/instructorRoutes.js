var express = require('express');
var router = express.Router();
var path = require('path');
var userModel = require('../models/userModel');
var courseModel = require('../models/courseModel');
var assignmentModel = require('../models/assignmentModel.js');
var enrollmentCourseModel = require('../models/enrollmentCourseModel.js');
var studentMetricsModel = require('../models/studentMetricsModel.js');
var classModel = require('../models/classModel.js');

router.get("/", function(req, res) {
    //console.log("index")
    res.sendFile("instructor_index.html", {
        root: path.join(__dirname, '../public/views')
    });
});

router.get('/courses_home/:id', function(req, res) {

    let id = req.params.sid;
    console.log("Check router")

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

router.get('/studentmetrics/:sid', function(req, res) {

    let sid = req.params.sid;
    // let listresponse = [[], []];
    let student = [];
    let mission = [];
    console.log("id", sid);

    classModel.find({instructorId: sid}).lean().exec()
        .then(function (response, error) {
            //TODO - handle error.
            console.log("response in metrics", response[0]);
            return studentMetricsModel.find({'studentID': {'$in': response[0].roster}});

        }).then(function (response, error) {

        var tmp = new Array();
        // var tmp_m = new Array();

        for (var i = 0; i < response.length; i++) {

            var s_tmp = [response[i].studentID, response[i].studentName];
            var mID = [response[i].missionID, response[i].missionName];

            if (tmp[s_tmp]) {
                tmp[s_tmp].push({"missionName": response[i].missionName, "missionCT": response[i].enrolled});
            } else {
                tmp[s_tmp] = [{"missionName": response[i].missionName, "missionCT": response[i].enrolled}];
            }

            // if (tmp_m[mID]) {
            //     tmp_m[mID].push({
            //         "studentID": response[i].studentID,
            //         "studentName": response[i].studentName,
            //         "missionCT": response[i].enrolled
            //     });
            // } else {
            //     tmp_m[mID] = [{
            //         "studentID": response[i].studentID,
            //         "studentName": response[i].studentName,
            //         "missionCT": response[i].enrolled
            //     }];
            // }

        }

        for (var s in tmp) {
            var studentID = s.split(",")[0];
            var studentName = s.split(",")[1];
            var enrolled = tmp[s];
            student.push({
                "studentID": studentID,
                "studentName": studentName,
                "enrolled": enrolled
            });
        }

        // for (var m in tmp_m) {
        //     var missionName = m.split(",")[1];
        //     var enrolled = tmp_m[m];
        //     mission.push({
        //         "missionName": missionName,
        //         "enrolled": enrolled
        //     });
        // }

        // listresponse[0] = student;
        // listresponse[1] = mission;
        res.status(200).send(student);


        //     return classModel.find({instructorId:sid}).lean().exec()
        //
        //     }).then(function(response, error) {
        //         // console.log("response in 3 metrics", response[0]);
        //         return studentMetricsModel.find({'missionID': {'$in' : response[0].missions}});
        //         // res.status(200).send(student);
        //     }).then(function(response, error) {
        //         // console.log("response in 4 metrics", response);
        //         for(var i=0; i< response.length; i++){
        //             mission.push({"studentID": response[i].studentID,"studentName":response[i].studentName, "enrolled":response[i].enrolled});
        //         }
        //         res.status(200).send(listresponse);
        // });
    });

});

router.get('/missionmetrics/:sid', function(req, res) {

    let sid = req.params.sid;
    // let listresponse = [[], []];
    // let student = [];
    let mission = [];
    console.log("id", sid);

    classModel.find({instructorId: sid}).lean().exec()
        .then(function (response, error) {
            //TODO - handle error.
            console.log("response in metrics", response[0]);
            return studentMetricsModel.find({'studentID': {'$in': response[0].roster}});

        }).then(function (response, error) {

        // var tmp = new Array();
        var tmp_m = new Array();

        for (var i = 0; i < response.length; i++) {

            // var s_tmp = [response[i].studentID, response[i].studentName];
            var mID = [response[i].missionID, response[i].missionName];

            // if (tmp[s_tmp]) {
            //     tmp[s_tmp].push({"missionName": response[i].missionName, "missionCT": response[i].enrolled});
            // } else {
            //     tmp[s_tmp] = [{"missionName": response[i].missionName, "missionCT": response[i].enrolled}];
            // }

            if (tmp_m[mID]) {
                tmp_m[mID].push({
                    "studentID": response[i].studentID,
                    "studentName": response[i].studentName,
                    "missionCT": response[i].enrolled
                });
            } else {
                tmp_m[mID] = [{
                    "studentID": response[i].studentID,
                    "studentName": response[i].studentName,
                    "missionCT": response[i].enrolled
                }];
            }

        }

        // for (var s in tmp) {
        //     var studentID = s.split(",")[0];
        //     var studentName = s.split(",")[1];
        //     var enrolled = tmp[s];
        //     student.push({
        //         "studentID": studentID,
        //         "studentName": studentName,
        //         "enrolled": enrolled
        //     });
        // }

        for (var m in tmp_m) {
            var missionName = m.split(",")[1];
            var enrolled_m = tmp_m[m];
            mission.push({
                "missionName": missionName,
                "enrolled": enrolled_m
            });
        }
        //
        // listresponse[0] = student;
        // listresponse[1] = mission;
        res.status(200).send(mission);


        //     return classModel.find({instructorId:sid}).lean().exec()
        //
        //     }).then(function(response, error) {
        //         // console.log("response in 3 metrics", response[0]);
        //         return studentMetricsModel.find({'missionID': {'$in' : response[0].missions}});
        //         // res.status(200).send(student);
        //     }).then(function(response, error) {
        //         // console.log("response in 4 metrics", response);
        //         for(var i=0; i< response.length; i++){
        //             mission.push({"studentID": response[i].studentID,"studentName":response[i].studentName, "enrolled":response[i].enrolled});
        //         }
        //         res.status(200).send(listresponse);
        // });
    });

});



module.exports = router;

// router.get ('/instructors/courses_home/:id', function (req, res) {

//     let id = req.params.sid;

//     let allCoursesCreatedIDs = [];
//     courseModel.find({instructorID:id}).lean().limit(2).exec()
//     .then((response, error) => {

//         response.map((singleCourse) => {
//             allCoursesCreatedIDs.push(singleCourse.courseID);

//         });

//         return courseModel.find({'_id': {'$in' : allCoursesCreatedIDs}}).lean().exec();

//     }).then((response, error) => {

//         let returnResponse = response.map ((singleCourse) => {
//             singleCourse.courseID = singleCourse._id;
//             return singleCourse;
//         });

//         res.status(200).send(returnResponse);

//     });



// });