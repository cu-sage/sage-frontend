var express = require('express');
var router = express.Router();
var path = require('path');
var userModel = require('../models/userModel');
var questModel = require('../models/questModel');
var gameModel = require('../models/gameModel.js');
var enrollmentCourseModel = require('../models/enrollmentCourseModel.js');

router.get("/", function(req, res) {
    res.sendFile("instructor_index.html", {
        root: path.join(__dirname, '../public/views')
    });
});

router.get('/quests_home/:id', function(req, res) {

    let id = req.params.sid;
    console.log("Check router")

    questModel.find({instructorID:id}).lean().limit(2).exec()
    .then(function(response, error) {
        //TODO - handle error.

        let returnResponse = response.map ((singleQuest) => {
            singleQuest.questID = singleQuest._id;
            return singleQuest;
        });


        res.status(200).send(returnResponse);
    });

});

module.exports = router;

// router.get ('/instructors/courses_home/:id', function (req, res) {

//     let id = req.params.sid;

//     let allCoursesCreatedIDs = [];
//     questModel.find({instructorID:id}).lean().limit(2).exec()
//     .then((response, error) => {

//         response.map((singleCourse) => {
//             allCoursesCreatedIDs.push(singleCourse.courseID);

//         });

//         return questModel.find({'_id': {'$in' : allCoursesCreatedIDs}}).lean().exec();

//     }).then((response, error) => {

//         let returnResponse = response.map ((singleCourse) => {
//             singleCourse.courseID = singleCourse._id;
//             return singleCourse;
//         });

//         res.status(200).send(returnResponse);

//     });



// });