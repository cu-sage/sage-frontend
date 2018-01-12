//var service = angular.module('serviceFactory', []);
var userModel = require('../models/userModel');
var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('./config');
var bcrypt = require('bcryptjs');
var questModel = require('../models/questModel');
var LPModel = require('../models/learningPathModel');
var mongoose = require('mongoose');


// service.factory('dataFactory', function($scope, $http) {
//     $http.get("welcome.htm").then(function(response) {
//         $scope.myWelcome = response.data;
//     });
// });

var newquest = function(questname, desc, instructorid, features,ctConcepts, callback) {
    questModel.findOne({questName: questname}, function(err, existingQuest) {
        if (existingQuest) {
            callback(
                {status: 409, message: {questName: 'Quest Name is already taken.'}});
            return;
        }

        var newquest1 = new questModel({
            questName: questname,
            desc: desc,
            instructorID: instructorid,
            games: [],
            features:features,
            ctConcepts:ctConcepts
        });

        newquest1.save(function(err,quest_inserted) {
        	if(!err){
        		console.log(quest_inserted);
        		callback({status: 200, message: quest_inserted});
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

//newassignment
var newassignment = function(values, instructorid, questid, callback) {
    questModel.findOne({_id: { $in: [ questid ] }}, function(err, existingQuest) {
        if (existingQuest) {

            var aid = mongoose.Types.ObjectId();
            var newtest = {
                "gameName": values.name,
                "gameOrder":values.order,
                "gameID":aid

            };

        questModel.update({_id: { $in: [ questid ] }},{ $push: { games: newtest } },function(err,test_inserted) {
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
                {status: 404, message: {error: 'Quest doesnt exist.'}});
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

var removeAssignment = function(quest_id, newAssignments, callback) {
    //console.log("in remove assignment" + assignment_id);
    questModel.findOne({_id: { $in: [ quest_id ] }}, function(err, existingLP) {
        if (existingLP) {
            //console.log(quest_id+" going for update "+assignment_id);
        //courseModel.update({_id: { $in: [ quest_id ] }}, { $pull: {'assignments': {'assignments.assigmentID': assignment_id}}}, function(err, msg) {
            questModel.update({_id: { $in: [ quest_id ] }},{ $set: { games: newAssignments } }, function(err, msg) {
            if(!err){
                console.log(msg);
                callback({status: 200, message: {"message" : "Game successfully removed."}});
            }
            else
                callback({status:404 , message : {error : "Not saved into db"}});
        });
        return;

        }
        callback(
                {status: 404, message: {error: 'Quest does not exist.'}});

    });
};

var updateQuest = function(questname, desc , Questid, callback) {
    questModel.findOne({_id: { $in: [ Questid ] }}, function(err, existingLP) {
        if (existingLP) {
        questModel.update({_id: { $in: [ Questid ] }},{ $set: { questName: questname, desc: desc } },function(err, msg) {
            if(!err){
                console.log(msg);
                callback({status: 200, message: {"message" : "Quest order successfully updated."}});
            }
            else
                callback({status:404 , message : {error : "Not saved into db"}});
        });
        return;

        }
        callback(
                {status: 404, message: {error: 'Quest doesnt exist.'}});
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

var updateAssignmentOrderInQuest = function(games , questid, callback) {
    questModel.findOne({_id: { $in: [ questid ] }}, function(err, existingLP) {
        if (existingLP) {
          console.log("found course to update");
        questModel.update({_id: { $in: [ questid ] }},{ $set: { gamess: games } },function(err, msg) {
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
    newcourse: newquest,
    newassignment:newassignment,
    addCoursetoLP:addCoursetoLP,
    newLP:newLP,
    updateQuest: updateQuest,
    removeAssignment: removeAssignment,
    updateAssignmentOrderInQuest: updateAssignmentOrderInQuest,
    updateCourseOrderInLP:updateCourseOrderInLP

};
