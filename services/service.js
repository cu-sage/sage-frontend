//var service = angular.module('serviceFactory', []);
var userModel = require("../models/userModel");
var jwt = require("jwt-simple");
var moment = require("moment");
var config = require("./config");
var bcrypt = require("bcryptjs");
var courseModel = require("../models/courseModel");
var instructionModel = require("../models/instructionModel");
var LPModel = require("../models/learningPathModel");
var LPModelGameLevel = require("../models/learningPathModelGameLevel");
var feedbackTemplateGameLevel = require("../models/feedbackTemplateGameLevelModel");
var classModel = require("../models/classModel");
var badgedscModel = require("../models/badgedescriptionModel");
var invitePendingModel = require("../models/invitePendingModel");
var gameSettingModel = require("../models/gameSettingModel");
var assignmentModel = require("../models/assignmentModel");
var mongoose = require("mongoose");

// service.factory('dataFactory', function($scope, $http) {
//     $http.get("welcome.htm").then(function(response) {
//         $scope.myWelcome = response.data;
//     });
// });

var newtime = function() {
  gameSettingModel.find(function(err, time_found) {
    if (!err) {
      callback({ status: 200, time: time_found.time });
      return;
    } else {
      callback({ status: 404, message: { error: "Time not found." } });
    }
  });
};

var newclass = function(
  className,
  descrip,
  rost,
  miss,
  instructorid,
  callback
) {
  classModel.findOne({ name: className }, function(err, existingClass) {
    /*if (existingClass) {
            callback(
                {status: 409, message: {courseName: 'CourseName is already taken.'}});
            return;
        }*/

    var newClass = new classModel({
      name: className,
      description: descrip,
      roster: rost,
      missions: miss,
      instructorId: instructorid,
      isDeleted: false
    });

    newClass.save(function(err, class_inserted) {
      if (!err) {
        console.log(class_inserted);
        callback({ status: 200, message: class_inserted });
      } else callback({ status: 404, message: { error: "Not saved into db" } });
    });
  });
};

// pz2244 update all feedback in assignments
// logic here is not right, different assignments can be assigned by different classes
// function updateMoveFeedbackInMission(values, callback) {
//   // current feedback
//   var curFeedback = values.moveFeedback;
//   var missions = values.missions;

//   for (var i = 0; i < missions.length; i++) {
//     LPModel.findById(missions[i], function(err, response) {
//       if (err) {
//         callback({ status: 500, message: err });
//       } else {
//         console.log(response);
//       }
//     });
//   }
// }

/** pz2244
 * Update class level move feedbacks
 * @param {classId, moveFeedback} values
 * @param {*} callback
 */
var updateMoveFeedbackClass = function(values, callback) {
  console.log("UPDATEING FEEDBACKS");

  classModel.findOneAndUpdate(
    { _id: values.classId },
    { $push: { moveFeedback: { $each: values.moveFeedback } } },
    { new: true },
    function(err, response) {
      if (err) {
        callback({ status: 500, message: err });
      } else {
        console.log("return message \n" + response);
        callback({ status: 200, message: response.moveFeedback });
      }
    }
  );

  // TODO: after updating instructor's feedback, we also need to update feedback in those assignments
  // updateMoveFeedbackInMission(values, callback);
  return;
};

var fetchMoveFeedbackClass = function(c_id, callback) {
  console.log("FETCHING FEEDBACKS");
  console.log(c_id);
  classModel.findById(c_id, function(err, response) {
    if (err) {
      callback({ status: 500, message: err });
    } else {
      console.log("return message \n" + response);
      callback({ status: 200, message: response });
    }
  });
  return;
};

// pz2244 assignment level move feedback
var getAssignmentMoveFeedbackClass = function(a_id, callback) {
  console.log("FETCHING ASSIGNMENT FEEDBACKS");
  console.log(a_id);
  assignmentModel.findById(a_id, function(err, response) {
    if (err) {
      callback({ status: 500, message: err });
    } else {
      console.log("return message \n" + response);
      callback({ status: 200, message: response });
    }
  });
  return;
};

var addAssignmentMoveFeedbackClass = function(values, callback) {
  console.log("UPDATEING FEEDBACKS");
  console.log(values);
  assignmentModel.findOneAndUpdate(
    { _id: values.id },
    { $push: { moveFeedbacks: { $each: values.moveFeedbacks } } },
    { new: true },
    function(err, response) {
      if (err) {
        callback({ status: 500, message: err });
      } else {
        console.log("return message \n" + response);
        callback({ status: 200, message: response.moveFeedbacks });
      }
    }
  );
  return;
};

var newbadge = function(b_name, b_desc, b_img, instructorid, callback) {
  badgedscModel.findOne({ badgename: b_name }, function(err, existingBadge) {
    if (existingBadge) {
      callback({
        status: 409,
        message: { badgename: "badgename is already taken." }
      });
      return;
    }

    var newBadge = new badgedscModel({
      badgename: b_name,
      description: b_desc,
      src: b_img,
      issuedBy: instructorid
    });

    newBadge.save(function(err, badge_inserted) {
      if (!err) {
        console.log(badge_inserted);
        callback({ status: 200, message: badge_inserted });
      } else callback({ status: 404, message: { error: "Not saved into db" } });
    });
  });
};

var updateClassMissions = function(class_id, missions, callback) {
  //console.log("in update instruction " + name);

  classModel.findOneAndUpdate(
    { _id: class_id },
    { $set: { missions: missions } },
    function(err, test_inserted) {
      if (!err) {
        console.log(test_inserted);
        callback({ status: 200, message: { inserted: test_inserted } });
      } else
        callback({
          status: 404,
          message: { error: "Not saved into db " + err }
        });
    }
  );
  return;
};

var copyClass = function(
  name,
  description,
  class_id,
  rosterbool,
  missionsbool,
  instructor_id,
  callback
) {
  //console.log("in copy class " + name);

  classModel.findOne({ _id: class_id }, function(err, existingClass) {
    var roster = [];
    var missions = [];

    if (rosterbool) {
      roster = existingClass.roster;
    }
    if (missionsbool) {
      missions = existingClass.missions;
    }

    var newClass = new classModel({
      name: name,
      description: description,
      roster: roster,
      missions: missions,
      instructorId: instructor_id,
      isDeleted: false
    });

    newClass.save(function(err, class_inserted) {
      if (!err) {
        console.log(class_inserted);
        callback({ status: 200, message: class_inserted });
      } else callback({ status: 404, message: { error: "Not saved into db" } });
    });
  });
};

var updateClassRoster = function(class_id, roster, callback) {
  console.log("in update class roster");
  userModel.find({ email: { $in: roster } }, function(err, users) {
    console.log(users);

    var updatedUsers = [];
    var emailsFound = [];
    for (i in users) {
      updatedUsers.push(String(users[i]._id));
      emailsFound.push(String(users[i].email));
    }
    console.log("users found: ", updatedUsers);
    console.log("adding that user to " + class_id);

    // this means not all users were found
    if (users.length < roster.length) {
      dict2 = {};

      emailsFound.forEach(function(item) {
        emailsFound[item] = true;
      });

      var result = roster.reduce(function(prev, current) {
        if (emailsFound.hasOwnProperty(current) === false) {
          prev.push(current);
        }
        return prev;
      }, []);

      console.log("emails not found: ", result);
      // send an invite to emails that are not connected to users to join the class
      if (result.length != 0) {
        sendInviteToClass(class_id, result);
      }
    }

    //console.log(updatedUsers);

    // changed from $push to $set becuase we don't want duplicate students in a class!
    classModel.update(
      { _id: class_id },
      { $set: { roster: updatedUsers } },
      function(err, test_inserted) {
        if (!err) {
          console.log(test_inserted);
          callback({ status: 200, message: { inserted: test_inserted } });
        } else
          callback({ status: 404, message: { error: "Not saved into db" } });
      }
    );
    return;
  });
};

// Start mail info here ###########################################################3
const nodemailer = require("nodemailer");

// used for generating tokens
var rand = function() {
  return Math.random()
    .toString(36)
    .substr(2); // remove `0.`
};
var token = function() {
  return rand() + rand(); // to make it longer
};

var sendInviteToClass = function(class_id, emails, callback) {
  console.log("in send invite to join class");
  console.log("emails: ", emails);

  for (i in emails) {
    createdToken = token();
    currentEmail = emails[i];
    //console.log("sending mail to "+ currentEmail+ " with token "+createdToken)
    sendMail(currentEmail, createdToken);

    var invite = new invitePendingModel({
      email: currentEmail,
      token: createdToken,
      classId: class_id
    });

    invite.save(function() {
      //callback({status: 200, token: token});
    });
  }
};

var sendMail = function(email, token, callback) {
  var transporter = nodemailer.createTransport(
    {
      host: "dev.cu-sage.org",
      port: 25,
      secure: false,
      auth: {
        user: "sage-sender",
        pass: "jEV68GCyfa@a"
      },
      logger: false,
      debug: true
    },
    {
      // default message fields

      // sender info
      from: "SAGE <no-reply@cu-sage.org>"
    }
  );

  let message = {
    // Comma separated list of recipients; please set this to include your own email address.
    to: email,

    // Subject of the message
    subject: "Invite to SAGE!",

    // plaintext body
    text: "Invite for class with token: " + token,

    // HTML body
    html:
      `<p>Hello! You have been invited to join SAGE. Please click on the following link to create your account:</p>` +
      `<p><a href="http://localhost:3000/#/reg?eviteToken=${token}">http://localhost:3000/#/reg?eviteToken=${token}</a></p>` + // http://dev.cu-sage.org/#/
      '<p><img src="http://dev.cu-sage.org/public/images/logo.png"/></p>'
  };

  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.log("Error occurred");
      console.log(error.message);
      return process.exit(1);
    }
    callback();
  });
};

// sending invite test
/*sendInviteToClass("ClassId12345678",["yuval.schaal@gmail.com","yuval@example.com"],function(){
    console.log('Message sent successfully, and callback executed!');
});*/

// end mail info here ###########################################################3

var updateClassInformation = function(class_id, name, description, callback) {
  //console.log("in update instruction " + name);

  classModel.findOneAndUpdate(
    { _id: class_id },
    { $set: { name: name, description: description } },
    function(err, test_inserted) {
      if (!err) {
        console.log(test_inserted);
        callback({ status: 200, message: { inserted: test_inserted } });
      } else
        callback({
          status: 404,
          message: { error: "Not saved into db " + err }
        });
    }
  );
  return;
};

var newcourse = function(values, callback) {
  console.log(values);
  console.log("this is just for test hhhhhhhhhhhhhhh");
  console.log(values.courseName);
  var newCourse = new courseModel({
    courseName: values.courseName,
    desc: values.desc,
    instructorID: values.instructorID,
    assignments: values.assignements,
    features: values.features,
    ctConcepts: values.ctConcepts,
    assignmentFeedbacks: values.assignmentFeedbacks,
    moveFeedbacks: values.moveFeedbacks
  });
  newCourse.save(function(err, course_inserted) {
    if (!err) {
      console.log(course_inserted);
      return callback({ status: 200, message: course_inserted });
    } else {
      return callback({ status: 404, message: { error: "Not saved into db" } });
    }
  });
  // courseModel.findOne({courseName: values.coursename}, function(err, existingCourse) {

  //     if (existingCourse) {
  //         console.log("taken!!!!!")
  //         // return callback(
  //         //     {status: 409, message: {courseName: 'CourseName is already taken.'}});

  //     }

  //     //console.log("In service");
  //     //console.log(coursename);
  //     newCourse.save(function(err, course_inserted) {
  //     	if(!err){
  //     		console.log(course_inserted);
  //     		return callback({status: 200, message: course_inserted});
  //     	}
  //     	else
  //     		return callback({status:404 , message : {error : "Not saved into db"}});

  //     });

  // });
};

var newLP = function(
  LPname,
  desc,
  instructorid,
  features,
  ctConcepts,
  callback
) {
  LPModel.findOne({ LPName: LPname }, function(err, existingLP) {
    if (existingLP) {
      callback({
        status: 409,
        message: { courseName: "LPName is already taken." }
      });
      return;
    }

    var newLP1 = new LPModel({
      LPName: LPname,
      desc: desc,
      creatorID: instructorid,
      courses: [],
      features: features,
      ctConcepts: ctConcepts
    });

    //console.log("In service");
    //console.log(coursename);
    newLP1.save(function(err, LP_inserted) {
      if (!err) {
        console.log(LP_inserted);
        callback({ status: 200, message: LP_inserted });
      } else callback({ status: 404, message: { error: "Not saved into db" } });
    });
  });
};

/**
 * Update course (quest) general information: course name, course description, focus areas
 * @param {*} values
 * @param {*} callback
 */
var updateCourseInfo = function(values, callback) {
  courseModel.findOneAndUpdate(
    { _id: values.courseId },
    {
      $set: {
        courseName: values.courseName,
        desc: values.desc,
        ctConcepts: values.ctConcepts
      }
    },
    { new: true },
    (err, newLP) => {
      if (err) {
        return callback({ status: 500, message: err });
      }
      return callback({ status: 200, message: newLP });
    }
  );
};

/**
 * Update CT concepts for course
 * @param {String} courseId
 * @param {String} newCtConcepts
 * @param {json} callback
 */
var updateCourseLevelCTConcepts = function(courseId, newCtConcepts, callback) {
  courseModel.findOneAndUpdate(
    { _id: courseId },
    { $set: { ctConcepts: newCtConcepts } },
    { new: true },
    (err, course) => {
      if (err) {
        return callback({ status: 500, message: err });
      }
      return callback({ status: 200, message: course });
    }
  );
};

var updateAssignmentCTConcepts = function(
  assignmentId,
  newCtConcepts,
  callback
) {
  assignmentModel.findByIdAndUpdate(
    { _id: assignmentId },
    { $set: { ctConcepts: newCtConcepts } },
    { new: true },
    (err, assignment) => {
      if (err) {
        console.log("=======DEBUG========");
        console.log(err);
        return callback({ status: 500, message: err });
      }
      return callback({ status: 200, message: assignment });
    }
  );
};

// Deprecated: DO NOT Use This, use createAssignemnt() instead()
/////////// this is to save the focus to the game level//////////////////

var newLPGameLevel = function(gameId, instructorId, ctConcepts, callback) {
  LPModelGameLevel.findOne({ gameId: gameId }, function(err, existingGameId) {
    if (existingGameId) {
      callback({
        status: 409,
        message: { courseName: "game has already existed." }
      });
      return;
    }

    var newLPGameLevel1 = new LPModelGameLevel({
      gameID: gameId,
      instructorID: instructorId,
      ctConcepts: ctConcepts
    });

    newLPGameLevel1.save(function(err, LPG_inserted) {
      if (!err) {
        console.log(LPG_inserted);
        callback({ status: 200, message: LPG_inserted });
      } else callback({ status: 404, message: { error: "Not saved into db" } });
    });
  });
};

var newinstruction = function(
  instname,
  content,
  img,
  role,
  gameId,
  gameName,
  callback
) {
  instructionModel.findOne({ name: instname }, function(
    err,
    existingInstruction
  ) {
    if (existingInstruction) {
      callback({
        status: 409,
        message: { courseName: "instName is already taken." }
      });
      return;
    }
    //console.log("content here: ", content)
    //console.log(JSON.parse(content))

    var newInstruction = new instructionModel({
      name: instname,
      content: JSON.parse(content),
      img: img,
      role: role,
      gameId: gameId,
      gameName: gameName
    });
    //callback({status:404 , message : {error : "Not saved into db"}});

    //console.log("this is what the inst looks like", newInstruction)

    //console.log("In service");
    //console.log(coursename);
    newInstruction.save(function(err, instruction_inserted) {
      if (!err) {
        console.log(instruction_inserted);
        callback({ status: 200, message: instruction_inserted });
      } else callback({ status: 404, message: { error: "Not saved into db" } });
    });
  });
};

var removeInstruction = function(game_id, callback) {
  //console.log("in remove instruction " + game_id);
  instructionModel.remove({ gameId: { $in: [game_id] } }, function(err, msg) {
    if (!err) {
      console.log(msg);
      callback({
        status: 200,
        message: { message: "Instructions successfully removed." }
      });
    } else callback({ status: 404, message: { error: "Instruction could not be removed " + err } });
  });
  return;
};

var updateInstruction = function(instruction_id, name, content, img, callback) {
  instructionModel.findOneAndUpdate(
    { _id: instruction_id },
    { $set: { name: name, content: JSON.parse(content), img: img } },
    function(err, test_inserted) {
      if (!err) {
        console.log(test_inserted);
        callback({ status: 200, message: { inserted: test_inserted } });
      } else
        callback({
          status: 404,
          message: { error: "Not saved into db " + err }
        });
    }
  );
  return;
};

/**
 * Create a new assignment
 * @param {*} values: values contains necessary info for create new assignemt
 * @param {*} callback
 */
var createAssignment = function(values, callback) {
  console.log("test!!!!!!");
  console.log(values);

  var newAssignment = new assignmentModel({
    assignmentName: values.name,
    assignmentOrder: values.order,
    courseId: values.courseId,
    ctConcepts: values.ctConcepts,
    moveFeedbacks: values.moveFeedbacks,
    assignmentFeedbacks: values.assignmentFeedbacks,
    creatorId: values.creatorId,
    type: values.type
  });

  newAssignment.save().then(response => {
    var newAssignmentSummary = {
      assignmentID: response._id.toString(),
      assignmentName: values.name,
      assignmentOrder: values.order
    };
    courseModel
      .findOneAndUpdate(
        { _id: values.courseId },
        { $push: { assignments: newAssignmentSummary } }
      )
      .exec()
      .then(response => {
        console.log("successful add new game");
        return callback({ status: 200, message: newAssignmentSummary });
      })
      .catch(err => {
        console.log(err);
        callback({ status: 200, message: err });
      });
  });
  // .then(response => {
  //   console.log("successful add new game");
  //   console.log(response);
  //   return callback({ status: 200, message: newAssignmentSummary });
  // })
  // .catch(err => {
  //   console.log(err);
  //   callback({ status: 200, message: err });
  // });
};

// TODO: update assignment
var updateAssignment = function(values, callback) {};

// TODO: Test needed
/**
 * Get CT concepts from its parent quest level
 * @param {gameId, courseId} values
 * @param {status, message} callback
 */
var getParentQuestCTConcepts = function(values, callback) {
  var gameId = values.gameId;
  var parentCourseId = values.courseId;

  courseModel
    .findOne({ _id: parentCourseId })
    .select("ctConcepts")
    .exec((err, res) => {
      if (err) {
        return callback({ status: 500, message: err });
      }
      console.log("this is the result from the db hhhhhhhh");
      console.log(res);
      console.log("this is the end of the response");
      return callback({ status: 200, message: res });
    });
};

// TODO: student get move feedback for assessment, pending testing
/**
 * This function is for student assessment controller to access move feedback
 * @param {classId, assignmentId} values
 * @param {*} callback
 */
var studentGetMoveFeedback = function(values, callback) {
  var classId = values.classId;
  var assignmentId = values.assignmentId;

  assignmentModel
    .findOne({ _id: assignmentId })
    .select("moveFeedback")
    .exec((err, response) => {
      if (err) {
        return callback({ status: 500, message: err });
      }
      if (response.length > 0) {
        return callback({ status: 200, message: response });
      }

      classModel
        .findOne({ _id: classId })
        .select("moveFeedback")
        .exec((err, response) => {
          if (err) {
            return callback({ status: 500, message: err });
          }

          return callback({ status: 500, message: response });
        });
    });
};

// Deprecated: use createAssignemnt()
var newassignment = function(values, instructorid, courseid, callback) {
  courseModel.findOne({ _id: { $in: [courseid] } }, function(
    err,
    existingCourse
  ) {
    if (existingCourse) {
      var aid = mongoose.Types.ObjectId();
      var newtest = {
        assignmentName: values.name,
        assignmentOrder: values.order,
        assignmentID: aid,
        assignmentType: values.type
      };

      courseModel.update(
        { _id: { $in: [courseid] } },
        { $push: { assignments: newtest } },
        function(err, test_inserted) {
          if (!err) {
            console.log(test_inserted);
            callback({
              status: 200,
              message: { inserted: test_inserted, testid: aid }
            });
          } else
            callback({ status: 404, message: { error: "Not saved into db" } });
        }
      );
      return;
    }
    callback({ status: 404, message: { error: "Course doesnt exist." } });
  });
};

var addCoursetoLP = function(order, courseID, LPid, callback) {
  LPModel.findOne({ _id: { $in: [LPid] } }, function(err, existingLP) {
    if (existingLP) {
      //var aid = mongoose.Types.ObjectId();
      var newCourse = {
        CourseOrder: order,
        CourseID: courseID
      };

      LPModel.update(
        { _id: { $in: [LPid] } },
        { $push: { courses: newCourse } },
        function(err, test_inserted) {
          if (!err) {
            console.log(test_inserted);
            callback({
              status: 200,
              message: { inserted: test_inserted, testid: courseID }
            });
          } else
            callback({ status: 404, message: { error: "Not saved into db" } });
        }
      );
      return;
    }
    callback({ status: 404, message: { error: "LP doesnt exist." } });
  });
};

/**
 * Remove an assignment from quest
 * @param {String} courseId
 * @param {String} assignmentId
 * @param {*} callback
 */
var removeAssignment = function(courseId, assignmentId, callback) {
  //console.log("in remove assignment" + assignment_id);

  courseModel
    .findOneAndUpdate(
      { _id: courseId },
      { $pull: { assignments: { assignmentID: assignmentId } } }
    )
    .exec()
    .then(response => {
      return assignmentModel.findOneAndRemove({ _id: assignmentId }).exec();
    })
    .then(response => {
      return callback({ status: 200, message: "success" });
    })
    .catch(err => {
      console.log(err);
      return callback({ status: 500, message: err });
    });
};

var updateCourse = function(coursename, desc, Courseid, callback) {
  courseModel.findOne({ _id: { $in: [Courseid] } }, function(err, existingLP) {
    if (existingLP) {
      courseModel.update(
        { _id: { $in: [Courseid] } },
        { $set: { courseName: coursename, desc: desc } },
        function(err, msg) {
          if (!err) {
            console.log(msg);
            callback({
              status: 200,
              message: { message: "Course order successfully updated." }
            });
          } else
            callback({ status: 404, message: { error: "Not saved into db" } });
        }
      );
      return;
    }
    callback({ status: 404, message: { error: "Course doesnt exist." } });
  });
};

var updateCourseOrderInLP = function(courses, LPid, callback) {
  LPModel.findOne({ _id: { $in: [LPid] } }, function(err, existingLP) {
    if (existingLP) {
      LPModel.update(
        { _id: { $in: [LPid] } },
        { $set: { courses: courses } },
        function(err, msg) {
          if (!err) {
            console.log(msg);
            callback({
              status: 200,
              message: { message: "Course order successfully updated." }
            });
          } else
            callback({ status: 404, message: { error: "Not saved into db" } });
        }
      );
      return;
    }
    callback({ status: 404, message: { error: "LP doesnt exist." } });
  });
};

var updateAssignmentOrderInQuest = function(assignments, courseid, callback) {
  courseModel.findOne({ _id: { $in: [courseid] } }, function(err, existingLP) {
    if (existingLP) {
      console.log("found course to update");
      courseModel.update(
        { _id: { $in: [courseid] } },
        { $set: { assignments: assignments } },
        function(err, msg) {
          if (!err) {
            console.log(msg);
            callback({
              status: 200,
              message: { message: "assignment order successfully updated." }
            });
          } else
            callback({ status: 404, message: { error: "Not saved into db" } });
        }
      );
      return;
    }
    callback({ status: 404, message: { error: "LP doesnt exist." } });
  });
};

module.exports = {
  // isAuthenticated: isAuthenticated,
  newtime: newtime,
  newcourse: newcourse,
  newclass: newclass,
  updateMoveFeedbackClass: updateMoveFeedbackClass,
  fetchMoveFeedbackClass: fetchMoveFeedbackClass,
  updateClassRoster: updateClassRoster,
  updateClassMissions: updateClassMissions,
  copyClass: copyClass,
  updateClassInformation: updateClassInformation,
  createAssignment: createAssignment,
  newassignment: newassignment, // should remove this later
  newinstruction: newinstruction,
  removeInstruction: removeInstruction,
  updateInstruction: updateInstruction,
  addCoursetoLP: addCoursetoLP,
  newLP: newLP,
  updateCourseInfo: updateCourseInfo,
  updateCourseLevelCTConcepts: updateCourseLevelCTConcepts,
  newLPGameLevel: newLPGameLevel, // should remove this later
  updateCourse: updateCourse,
  removeAssignment: removeAssignment,
  updateAssignmentOrderInQuest: updateAssignmentOrderInQuest,
  updateAssignmentCTConcepts: updateAssignmentCTConcepts,
  updateCourseOrderInLP: updateCourseOrderInLP,
  newbadge: newbadge,
  getParentQuestCTConcepts: getParentQuestCTConcepts,
  studentGetMoveFeedback: studentGetMoveFeedback,
  getAssignmentMoveFeedbackClass: getAssignmentMoveFeedbackClass,
  addAssignmentMoveFeedbackClass: addAssignmentMoveFeedbackClass
};
