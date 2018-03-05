//var service = angular.module('serviceFactory', []);
var userModel = require('../models/userModel');
var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('./config');
var bcrypt = require('bcryptjs');
var courseModel = require('../models/courseModel');
var LPModel = require('../models/learningPathModel');
var mongoose = require('mongoose');


// service.factory('dataFactory', function($scope, $http) {
//     $http.get("welcome.htm").then(function(response) {
//         $scope.myWelcome = response.data;
//     });
// });

var newcourse = function(coursename, desc, instructorid, features,ctConcepts, callback) {
    courseModel.findOne({courseName: coursename}, function(err, existingCourse) {
        if (existingCourse) {
            callback(
                {status: 409, message: {courseName: 'CourseName is already taken.'}});
            return;
        }

        var newcourse1 = new courseModel({
            courseName: coursename,
            desc: desc,
            instructorID: instructorid,
            assignments: [],
            features:features,
            ctConcepts:ctConcepts
        });


        //console.log("In service");
        //console.log(coursename);
        newcourse1.save(function(err,course_inserted) {
        	if(!err){
        		console.log(course_inserted);
        		callback({status: 200, message: course_inserted});
        	}
        	else
        		callback({status:404 , message : {error : "Not saved into db"}});

        });


    });
};

var newLP = function(LPname, desc, instructorid, features,ctConcepts, callback) {
    LPModel.findOne({LPName: LPname}, function(err, existingLP) {
        if (existingLP) {
            callback(
                {status: 409, message: {courseName: 'LPName is already taken.'}});
            return;
        }

        var newLP1 = new LPModel({
            LPName: LPname,
            desc: desc,
            creatorID: instructorid,
            courses: [],
            features:features,
            ctConcepts:ctConcepts
        });


        //console.log("In service");
        //console.log(coursename);
        newLP1.save(function(err,LP_inserted) {
            if(!err){
                console.log(LP_inserted);
                callback({status: 200, message: LP_inserted});
            }
            else
                callback({status:404 , message : {error : "Not saved into db"}});

        });


    });
};

var newinstruction = function(instname, content, img, role, gameId, callback) {
    instructionModel.findOne({name: instname}, function(err, existingInstruction) {
        if (existingInstruction) {
            callback(
                {status: 409, message: {courseName: 'instName is already taken.'}});
            return;
        }

        var newInstruction = new instructionModel({
            name: String,
            content: [{
                heading: String,
                other: [{
                    description: String,
                    image: String}]
                        }],
            img: String,
            role: String,
            gameId: String 
        });


        //console.log("In service");
        //console.log(coursename);
        newInstruction.save(function(err,instruction_inserted) {
            if(!err){
                console.log(instruction_inserted);
                callback({status: 200, message: instruction_inserted});
            }
            else
                callback({status:404 , message : {error : "Not saved into db"}});

        });


    });
};

//newassignment
var newassignment = function(values, instructorid, courseid, callback) {
    courseModel.findOne({_id: { $in: [ courseid ] }}, function(err, existingCourse) {
        if (existingCourse) {

            var aid = mongoose.Types.ObjectId();
            var newtest = {
                "assignmentName": values.name,
                "assignmentOrder":values.order,
                "assignmentID":aid

            };



        courseModel.update({_id: { $in: [ courseid ] }},{ $push: { assignments: newtest } },function(err,test_inserted) {
            if(!err){
                console.log(test_inserted);
                callback({status: 200, message: {inserted:test_inserted,testid:aid}});
            }
            else
                callback({status:404 , message : {error : "Not saved into db"}});

        });
        return;

        }
        callback(
                {status: 404, message: {error: 'Course doesnt exist.'}});





    });
};

var addCoursetoLP = function(order , courseID, LPid, callback) {
    LPModel.findOne({_id: { $in: [ LPid ] }}, function(err, existingLP) {
        if (existingLP) {

            //var aid = mongoose.Types.ObjectId();
            var newCourse = {
                "CourseOrder":order,
                "CourseID":courseID

            };



        LPModel.update({_id: { $in: [ LPid ] }},{ $push: { courses: newCourse } },function(err,test_inserted) {
            if(!err){
                console.log(test_inserted);
                callback({status: 200, message: {inserted:test_inserted,testid:courseID}});
            }
            else
                callback({status:404 , message : {error : "Not saved into db"}});

        });
        return;

        }
        callback(
                {status: 404, message: {error: 'LP doesnt exist.'}});

    });
};

var removeAssignment = function(course_id, newAssignments, callback) {
    //console.log("in remove assignment" + assignment_id);
    courseModel.findOne({_id: { $in: [ course_id ] }}, function(err, existingLP) {
        if (existingLP) {
            //console.log(course_id+" going for update "+assignment_id);
        //courseModel.update({_id: { $in: [ course_id ] }}, { $pull: {'assignments': {'assignments.assignmentID': assignment_id}}}, function(err, msg) {
            courseModel.update({_id: { $in: [ course_id ] }},{ $set: { assignments: newAssignments } }, function(err, msg) {
            if(!err){
                console.log(msg);
                callback({status: 200, message: {"message" : "Assignment successfully removed."}});
            }
            else
                callback({status:404 , message : {error : "Not saved into db"}});

        });
        return;

        }
        callback(
                {status: 404, message: {error: 'Course doesnt exist.'}});

    });
};

var updateCourse = function(coursename, desc , Courseid, callback) {
    courseModel.findOne({_id: { $in: [ Courseid ] }}, function(err, existingLP) {
        if (existingLP) {
        courseModel.update({_id: { $in: [ Courseid ] }},{ $set: { courseName: coursename, desc: desc } },function(err, msg) {
            if(!err){
                console.log(msg);
                callback({status: 200, message: {"message" : "Course order successfully updated."}});
            }
            else
                callback({status:404 , message : {error : "Not saved into db"}});

        });
        return;

        }
        callback(
                {status: 404, message: {error: 'Course doesnt exist.'}});

    });
};

var updateCourseOrderInLP = function(courses , LPid, callback) {
    LPModel.findOne({_id: { $in: [ LPid ] }}, function(err, existingLP) {
        if (existingLP) {

        LPModel.update({_id: { $in: [ LPid ] }},{ $set: { courses: courses } },function(err, msg) {
            if(!err){
                console.log(msg);
                callback({status: 200, message: {"message" : "Course order successfully updated."}});
            }
            else
                callback({status:404 , message : {error : "Not saved into db"}});

        });
        return;

        }
        callback(
                {status: 404, message: {error: 'LP doesnt exist.'}});

    });
};

var updateAssignmentOrderInQuest = function(assignments , courseid, callback) {
    courseModel.findOne({_id: { $in: [ courseid ] }}, function(err, existingLP) {
        if (existingLP) {
          console.log("found course to update");
        courseModel.update({_id: { $in: [ courseid ] }},{ $set: { assignments: assignments } },function(err, msg) {
            if(!err){
                console.log(msg);
                callback({status: 200, message: {"message" : "assignment order successfully updated."}});
            }
            else
                callback({status:404 , message : {error : "Not saved into db"}});

        });
        return;

        }
        callback(
                {status: 404, message: {error: 'LP doesnt exist.'}});

    });
};



module.exports = {
    // isAuthenticated: isAuthenticated,
    newcourse: newcourse,
    newassignment:newassignment,
    addCoursetoLP:addCoursetoLP,
    newLP:newLP,
    updateCourse:updateCourse,
    removeAssignment: removeAssignment,
    updateAssignmentOrderInQuest: updateAssignmentOrderInQuest,
    updateCourseOrderInLP:updateCourseOrderInLP

};
