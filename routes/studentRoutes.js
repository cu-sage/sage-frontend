var express = require("express");
var router = express.Router();
var path = require("path");
var userModel = require("../models/userModel");
var courseModel = require("../models/courseModel");
var assignmentModel = require("../models/assignmentModel.js");
var enrollmentCourseModel = require("../models/enrollmentCourseModel.js");
var badgeModel = require("../models/badgeModel.js");
var studentbadgeModel = require("../models/studentbadgeModel.js");
var badgedescriptionModel = require("../models/badgedescriptionModel.js");
var studentMetricsModel = require("../models/studentMetricsModel.js");
var learningPathModel = require("../models/learningPathModel.js");
var classModel = require("../models/classModel.js");

var gameSettingModel = require("../models/gameSettingModel");
var studentSubmissionModel = require("../models/studentSubmissionModel");
var tempStudentScoresModel = require("../models/tempStudentScoresModel");
var tempPeerFeedbackModel = require("../models/tempPeerFeedbackModel");

var externalURLs = require("../config/externalURLs.js");
var fetch = require("node-fetch");

function prepareHashedEnrollments(object) {
  let hashedEnrollments = {};
  object.map(singleEnrollment => {
    if (hashedEnrollments.hasOwnProperty(singleEnrollment.studentID)) {
      hashedEnrollments[singleEnrollment.studentID][
        singleEnrollment.courseID
      ] = 5;
    } else {
      hashedEnrollments[singleEnrollment.studentID] = {};
      hashedEnrollments[singleEnrollment.studentID][
        singleEnrollment.courseID
      ] = 5;
    }
  });

  return hashedEnrollments;
}

function preparePayloadForRecommenderEngine(hashedEnrollments, studentID) {
  return {
    httpMethod: "POST",
    StudentID: studentID,
    body: {
      enrollments: hashedEnrollments
    }
  };
}

router.get("/", function(req, res) {
  res.sendFile("student_index.html", {
    root: path.join(__dirname, "../public/views")
  });
});

router.get("/recommendedCourses/student/:sid", function(req, res) {
  //getting random two courses.
  let studentID = req.params.sid;

  enrollmentCourseModel
    .find()
    .lean()
    .exec()
    .then(function(response, error) {
      let hashedEnrollments = prepareHashedEnrollments(response);
      let payloadForRecommenderEngine = preparePayloadForRecommenderEngine(
        hashedEnrollments,
        studentID
      );
      return fetch(externalURLs.RECOMMENDATION_SERVER + "Recommend", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(payloadForRecommenderEngine)
      });
      //TODO - handle error.
    })
    .then(responseFromRecommenderEngine => {
      return responseFromRecommenderEngine.json();
    })
    .then(json => {
      return courseModel
        .find({
          _id: {
            $in: json.body
          }
        })
        .lean()
        .exec();
    })
    .then(courses => {
      let returnResponse = courses.map(singleCourse => {
        singleCourse.courseID = singleCourse._id;
        return singleCourse;
      });

      res.status(200).send(returnResponse);
    });
});

router.get("/recentCourses/student/:sid", function(req, res) {
  //getting random courses for now - NEEDS TO BE IMPLEMENTED

  courseModel
    .find()
    .lean()
    .exec()
    .then(function(response, error) {
      //TODO - handle error.

      let returnResponse = response.map(singleCourse => {
        singleCourse.courseID = singleCourse._id;
        return singleCourse;
      });

      res.status(200).send(returnResponse);
    });
});

router.get("/badgesearned/student/:sid", function(req, res) {
  let sid = req.params.sid;
  console.log(sid);
  badgeModel
    .findOne({ studentID: sid })
    .lean()
    .exec()
    .then(function(response, error) {
      //TODO - handle error.

      res.status(200).send(response);
    });
});

router.get("/studentbadges/student/:sid", function(req, res) {
  let sid = req.params.sid;
  console.log("sid", sid);
  studentbadgeModel
    .findOne({ studentID: sid })
    .lean()
    .exec()
    .then(function(response, error) {
      //TODO - handle error.
      console.log("student + badges");
      console.log(response);
      console.log(response.badgeIDs);
      return badgedescriptionModel
        .find({ _id: { $in: response.badgeIDs } })
        .lean()
        .exec();
    })
    .then(function(response, error) {
      // console.log(response);
      res.status(200).send(response);
    });
});
/*const sid = req.params.sid;
    
    let missionsIDs = [];
    classModel.find({roster:sid}).lean().exec()
    .then((response, error) => {
        response.map((singleClass) => {
            for (var i = 0; i < singleClass.missions.length; i++) {
                missionsIDs.push(singleClass.missions[i]);
            }
        })
        return learningPathModel.find({'_id' : {$in: missionsIDs}}).lean().exec();
    })
    .then((response, error) => {
        let missionsIDs = [];
        let missionsNames = [];
        
        response.map((mission) => {
            missionsIDs.push(mission._id);
            missionsNames.push(mission.LPName);
        })

        return res.status(200).send({missionsIDs:missionsIDs, missionsNames:missionsNames});
    })
    .catch((error) => {
        return res.status(500).send({error:error});
    })*/

router.get("/smetrics/student/:sid", function(req, res) {
  let sid = req.params.sid;
  studentMetricsModel
    .find({ studentID: sid })
    .lean()
    .exec()
    .then(function(response, error) {
      if (response.length > 0) {
        console.log(response[response.length - 1]);
        res.status(200).send(response[response.length - 1]);
      }
    })
    .catch(function(error) {
      return res.status(500).send({ error: error });
    });
  /*studentMetricsModel.findOne({"studentID" : sid}).lean().exec()
        .then(function(response, error) {
            //TODO - handle error.
            res.status(200).send(response);
        });*/
});

router.post("/enroll/:cid/student/:sid", function(req, res) {
  let { cid, sid } = req.params;
  //TODO fill the assignments array with data before saving.

  enrollmentCourseModel
    .create({ studentID: sid, courseID: cid, assignments: [] })
    .then(response => {
      if (response) {
        res.send(response);
      }
    })
    .catch(error => {
      res.status(500).send({ error: error });
    });
});

// get student infomation using studentID
router.get("/:sid/getInfo", function(req, res) {
  const sid = req.params.sid;
  userModel
    .find({ _id: sid })
    .exec()
    .then(function(response, error) {
      res.status(200).send(response[0]);
    })
    .catch(function(error) {
      console.log(error);
      res.status(500).send({ error: error });
    });
});

// get learning path/mission of a student
// Deprecated: use the '/getEnrollments'
router.get("/getMissions/student/:sid", function(req, res) {
  const sid = req.params.sid;

  let missionsIDs = [];
  classModel
    .find({ roster: sid })
    .lean()
    .exec()
    .then((response, error) => {
      response.map(singleClass => {
        for (var i = 0; i < singleClass.missions.length; i++) {
          missionsIDs.push(singleClass.missions[i]);
        }
      });
      return learningPathModel
        .find({ _id: { $in: missionsIDs } })
        .lean()
        .exec();
    })
    .then((response, error) => {
      let missionsIDs = [];
      let missionsNames = [];

      response.map(mission => {
        missionsIDs.push(mission._id);
        missionsNames.push(mission.LPName);
      });

      return res
        .status(200)
        .send({ missionsIDs: missionsIDs, missionsNames: missionsNames });
    })
    .catch(error => {
      return res.status(500).send({ error: error });
    });
});

// get student's quest (courses)
// TODO: Could improve readability by moving the service logic to service.js
router.get("/getEnrollments/student/:sid", function(req, res) {
  console.log("RECEIVE GET ENROLLMENT");
  console.log("===================");

  const sid = req.params.sid;

  let classIDs = [];
  let missionIDs = [];
  let missionNames = [];
  let questIDsSet = new Set();
  let questIDs = [];
  let questNames = [];

  classModel
    .find({ roster: sid })
    .lean()
    .exec()
    .then(response => {
      response.map(singleClass => {
        classIDs.push(singleClass._id);
        for (var i = 0; i < singleClass.missions.length; i++) {
          missionIDs.push(singleClass.missions[i]);
        }
      });
      return learningPathModel
        .find({ _id: { $in: missionIDs } })
        .lean()
        .exec();
    })
    .then(response => {
      missionIDs = [];
      response.map(singleMission => {
        missionIDs.push(singleMission._id.toString());
        missionNames.push(singleMission.LPName);
        for (var i = 0; i < singleMission.courses.length; i++) {
          questIDsSet.add(singleMission.courses[i].CourseID);
        }
      });
      questIDs = Array.from(questIDsSet);
      return courseModel
        .find({ _id: { $in: questIDs } })
        .lean()
        .exec();
    })
    .then(response => {
      questIDs = [];
      response.map(singleQuest => {
        questIDs.push(singleQuest._id.toString());
        questNames.push(singleQuest.courseName);
      });
      return res.status(200).send({
        classIDs: classIDs,
        missionIDs: missionIDs,
        missionNames: missionNames,
        questIDs: questIDs,
        questNames: questNames
      });
    })
    .catch(error => {
      return res.status(500).send({ error: error });
    });
});

router.get("/course/:cid/getassignments", function(req, res) {
  var cid = req.params.cid;
  courseModel.findOne({ _id: cid }).exec((err, course) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    return res.status(200).send(course.assignments);
  });
});

// Deprecated, we don't use enrollmentCourseModel anymore
router.get("/coursesEnrolled/student/:sid", function(req, res) {
  let sid = req.params.sid;

  let allCoursesEnrolledIDs = [];
  enrollmentCourseModel
    .find({ studentID: sid })
    .lean()
    .exec()
    .then((response, error) => {
      response.map(singleEnrollment => {
        allCoursesEnrolledIDs.push(singleEnrollment.courseID);
      });

      return courseModel
        .find({ _id: { $in: allCoursesEnrolledIDs } })
        .lean()
        .exec();
    })
    .then((response, error) => {
      let returnResponse = response.map(singleCourse => {
        singleCourse.courseID = singleCourse._id;
        return singleCourse;
      });

      res.status(200).send(returnResponse);
    })
    .catch(error => {
      res.status(500).send({ error: error });
    });
});

router.get("/course/:cid/leaderboard", function(req, res) {
  let { cid } = req.params;
  let studentScoreHash = {};

  Promise.all([getCourseObject(cid), getAllEnrollments(cid)])
    .then(allData => {
      let courseObject = allData[0];
      let enrollments = allData[1];
      let allStudentIDs = getAllStudentIDsFromEnrollment(enrollments);
      let allAssignmentIDs = getAllAssignmentIdsFromCourseObject(courseObject);

      return { allAssignmentIDs, allStudentIDs };
    })
    .then(response => {
      let { allStudentIDs, allAssignmentIDs } = response;

      let fetches = allAssignmentIDs.map(singleAssignmentID => {
        return fetchProgressObjectsForParticularAssignmentID(
          singleAssignmentID,
          allStudentIDs
        );
      });

      return Promise.all(fetches);
    })
    .then(responses => {
      let allJsons = responses.map(singleResponse => {
        return singleResponse.json();
      });
      return Promise.all(allJsons);
    })
    .then(allJSONS => {
      let allProgresses = [];
      allJSONS.map(singleAssignmentProgresses => {
        singleAssignmentProgresses.map(singleStudentProgress => {
          allProgresses.push(singleStudentProgress);
        });
      });

      return allProgresses;
    })
    .then(allProgresses => {
      let studentHash = {};

      allProgresses.map(singleProgress => {
        if (studentHash.hasOwnProperty(singleProgress.studentID)) {
          studentHash[singleProgress.studentID] += getScore(
            singleProgress.results
          );
        } else {
          studentHash[singleProgress.studentID] = getScore(
            singleProgress.results
          );
        }
      });

      return studentHash;
    })
    .then(studentHash => {
      var studentIDs = [];
      studentScoreHash = studentHash;
      for (var k in studentHash) studentIDs.push(k);

      return userModel
        .find({ _id: studentIDs })
        .lean()
        .exec();
    })
    .then(students => {
      let responseToBeSent = students.map(singleStudent => {
        singleStudent.points = studentScoreHash[singleStudent._id];
        return singleStudent;
      });
      res.send(responseToBeSent);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
});

// get assigned time for this assessment
router.get("/courses/:courseID/assessment/:aid/:sid", function(req, res) {
  // var id = req.params.id;
  let aid = req.params.aid;

  gameSettingModel
    .find({ assignmentID: aid })
    .exec()
    // gameSettingModel.find().exec()
    .then(function(response, error) {
      console.log("see\n", response);
      res.status(200).send({
        time: response[0].time,
        question: response[0].question,
        hint: response[0].hint,
        basic: response[0].basic,
        developing: response[0].developing,
        max: response[0].max
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).send({ error: error });
    });
});

// get course name
router.get("/courses/:courseID/assessment/:aid/:sid/coursename", function(
  req,
  res
) {
  var id = req.params.id;
  let aid = req.params.aid;
  let cid = req.params.courseID;

  courseModel
    .findOne({ assignments: { $elemMatch: { assignmentID: aid } } })
    .exec()
    .then(function(response, error) {
      res.status(200).send({ response: response });
    })
    .catch(error => {
      console.log(error);
      res.status(500).send({ error: error });
    });
});

var map = {};

var submitset = new Set();
router.post("/courses/assessment/:aid/:sid/autosubmit", function(req, res) {
  var sid = req.params.sid;
  let aid = req.params.aid;
  submitset.add(aid + "-" + sid);
  res.status(200).send({ msg: "submitted" });
});

router.get("/courses/assessment/:aid/:sid/autosubmit", function(req, res) {
  var sid = req.params.sid;
  let aid = req.params.aid;
  if (submitset.has(aid + "-" + sid)) {
    submitset.delete(aid + "-" + sid);
    res.status(200).send({ submitted: true });
  } else {
    res.status(200).send({ submitted: false });
  }
});

// auto submit
router.post("/courses/:courseID/assessment/:aid/:sid/autosubmit", function(
  req,
  res
) {
  let cid = req.params.courseID;
  let aid = req.params.aid;
  let sid = req.params.sid;
  let selfExplanation = req.body.selfExplanation;

  var net = require("net");
  var client = new net.Socket();
  var json = {
    event: "FRONTEND_UPDATE_SUBMISSION",
    selfExplanation: selfExplanation,
    studentID: sid,
    assignmentID: aid
  };
  client.connect(8001, "localhost", function() {
    client.write(JSON.stringify(json));
    client.end();
  });

  map[cid + "-" + aid + "-" + sid] = selfExplanation;
  console.log(selfExplanation, "oh yeah!!!!");
  res.status(200).send({ message: "Succeed!" });
});

// indicate timeup
router.post("/courses/:courseID/assessment/:aid/:sid/timeup", function(
  req,
  res
) {
  let cid = req.params.courseID;
  let aid = req.params.aid;
  let sid = req.params.sid;
  let selfExplanation = req.body.selfExplanation;

  var net = require("net");
  var client = new net.Socket();
  var json = {
    event: "FRONTEND_SUBMITTED",
    selfExplanation: selfExplanation,
    assignmentID: aid,
    id: sid
  };
  client.connect(8001, "localhost", function() {
    client.write(JSON.stringify(json));
    client.end();
  });

  map[cid + "-" + aid + "-" + sid] = selfExplanation;
  console.log("json");
  console.log(selfExplanation, "oh yeah!!!!");
  res.status(200).send({ message: "Succeed!" });
});

router.get("/courses/:courseID/assessment/:aid/:sid/timeup", function(
  req,
  res
) {
  let cid = req.params.courseID;
  let aid = req.params.aid;
  let sid = req.params.sid;

  res.status(200).send({ selfExplanation: map[cid + "-" + aid + "-" + sid] });
});

// indicate hint usage
router.post("/courses/:courseID/assessment/:aid/:sid/hint", function(req, res) {
  let aid = req.params.aid;
  let sid = req.params.sid;

  var net = require("net");
  var client = new net.Socket();
  var json = {
    event: "HINT_CLICKED",
    assignmentID: aid,
    id: sid
  };
  client.connect(8001, "localhost", function() {
    client.write(JSON.stringify(json));
    client.end();
  });

  res.status(200).send({ message: "Succeed!" });
});
// indicate selfsubmit
router.post("/courses/:courseID/assessment/:aid/:sid/selfsubmit", function(
  req,
  res
) {
  console.log("acitivated");
  let aid = req.params.aid;
  let sid = req.params.sid;
  let point = req.body.point;
  let solved = req.body.solved;
  let date = new Date();

  var net = require("net");
  var client = new net.Socket();
  var json = {
    event: "UPDATE_POINT",
    studentID: sid,
    assignmentID: aid,
    objectiveID: null,
    newPoint: point,
    isFinal: true,
    feedback: "You submitted your assignment!",
    timestamp: date.getTime().toString()
  };

  client.connect(8001, "localhost", function() {
    client.write(JSON.stringify(json));
    client.end();
  });

  res.status(200).send({ message: "Succeed!" });
});

// loop to check score
router.get("/courses/:courseID/assessment/:aid/:sid/score", function(req, res) {
  let cid = req.params.courseID;
  let aid = req.params.aid;
  let sid = req.params.sid;
  // console.log("test");
  tempStudentScoresModel
    .find({ assignmentID: aid, studentID: sid })
    .sort({ timestamp: -1 })
    .exec()
    .then(function(response, error) {
      // console.log("This is from the router file");
      var updateFlag = -1;
      var colorFlag = -1;
      var meaningfulMoves = 0;
      var maxScoreForGame = 0;

      if (response[0]) {
        if (response[0].updateFlag) {
          updateFlag = response[0].updateFlag;
        }
        if (response[0].colorFlag) {
          colorFlag = response[0].colorFlag;
        }
        if (response[0].meaningfulMoves) {
          meaningfulMoves = response[0].meaningfulMoves;
        }
        if (response[0].maxScoreForGame) {
          maxScoreForGame = response[0].maxScoreForGame;
        }
      }

      res.status(200).send({
        response: response[0].newPoint,
        isFinal: response[0].isFinal,
        feedback: response[0].feedback,
        wrongState: response[0].wrongState,
        updateFlag: updateFlag,
        colorFlag: colorFlag,
        meaningfulMoves: meaningfulMoves,
        maxScoreForGame: maxScoreForGame
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).send({ error: error });
    });
});

// loop to find explanations for blocks
router.get("/courses/:courseID/assessment/:aid/:sid/peerFeedback", function(
  req,
  res
) {
  let cid = req.params.courseID;
  let aid = req.params.aid;
  let sid = req.params.sid;

  tempPeerFeedbackModel
    .find({ assignmentID: aid, studentID: sid })
    .exec()
    .then(function(response, error) {
      res.status(200).send({
        feedback: response[0].feedback,
        instructorFeedback: response[0].instructorFeedback
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).send({ error: error });
    });
});

// find submission history
router.get("/courses/:courseID/assessment/:aid/:sid/checkHistory", function(
  req,
  res
) {
  const cid = req.params.courseID;
  const aid = req.params.aid;
  const sid = req.params.sid;

  studentSubmissionModel
    .find({ assignmentID: aid, studentID: sid })
    .exec()
    .then((submissions, error) => {
      var response = {};
      var total_score = 0;
      submissions.forEach(submission => {
        total_score += parseInt(submission.score);
      });

      response["times"] = submissions.length;
      response["total"] = total_score;
      if (total_score === 0) {
        response["avgScore"] = 0;
      } else {
        response["avgScore"] =
          Math.floor((total_score / submissions.length) * 100) / 100;
      }
      res.status(200).send(response);
    })
    .catch(error => {
      console.log(error);
      res.status(500).send({ error: error });
    });
});

// notify sage-scratch to deduct points
router.post("/courses/:courseID/assessment/:aid/:sid/feedbackUsed", function(
  req,
  res
) {
  let aid = req.params.aid;
  let sid = req.params.sid;

  var net = require("net");
  var client = new net.Socket();
  var json = {
    event: "PEER_FEEDBACK_REQUESTED",
    assignmentID: aid,
    studentID: sid
  };
  client.connect(8001, "localhost", function() {
    client.write(JSON.stringify(json));
    client.end();
  });

  res.status(200).send({ message: "Succeed!" });
});

router.get("/:sid/games/:gid/courses/:cid/movefeedback", function(req, res) {
  let studentId = req.params.sid;
  let courseId = res.params.sid;
});

router.get("/course/:cid/student/:sid", function(req, res) {
  let cid = req.params.cid;
  let sid = req.params.sid;

  //TODO put the progress of the sid in the object - Enrollment done. Do assignment progress now.
  let course = {};
  let assignmentsHash = {};
  let allAssignmentIDs = [];

  courseModel
    .findOne({ _id: cid })
    .lean()
    .exec()
    .then((response, error) => {
      //res.send(response);
      course = response;
      course.courseID = course._id;
      if (course) {
        allAssignmentIDs = course.assignments.map(singleAssignment => {
          assignmentsHash[singleAssignment.assignmentID] = singleAssignment;
          return singleAssignment.assignmentID;
        });

        return assignmentModel
          .find({ _id: { $in: allAssignmentIDs } })
          .lean()
          .exec();
      } else {
        //TODO - handle error
      }
    })
    .then((response, error) => {
      response.map(singleAssignment => {
        assignmentsHash[singleAssignment._id] = Object.assign(
          {},
          singleAssignment,
          { assignmentID: singleAssignment._id }
        );
      });

      course.assignments = [];

      for (key in assignmentsHash) {
        course.assignments.push(assignmentsHash[key]);
      }

      return enrollmentCourseModel
        .findOne({ studentID: sid, courseID: cid })
        .lean()
        .exec();
    })
    .then((response, error) => {
      course.isEnrolled = response ? true : false;

      if (course.isEnrolled) {
        let callingURL =
          externalURLs.NODE_SERVER +
          "progress/student/" +
          sid +
          "?assignmentIDs=" +
          allAssignmentIDs.join(",");
        console.log(callingURL);
        return fetch(callingURL, {
          headers: {
            "Content-type": "application/json"
          }
        });
      }
    })
    .then(responseNode => {
      if (responseNode) {
        return responseNode.json();
      }
    })
    .then(nodeJSON => {
      if (nodeJSON) {
        nodeJSONHash = {};
        if (nodeJSON) {
          nodeJSON.map(singleAssignment => {
            nodeJSONHash[singleAssignment.assignmentID] = singleAssignment;
          });
        }

        course.assignments.map(singleAssignment => {
          singleAssignment.results = {};
          singleAssignment.results =
            nodeJSONHash[singleAssignment.assignmentID] &&
            nodeJSONHash[singleAssignment.assignmentID].results;
        });
      }

      res.send(course);
    })
    .catch(error => {
      console.log(error);
      res.status(500).send({ error: error });
    });
});

let getCourseObject = cid => {
  return courseModel.findOne({ _id: cid });
};

let getAllEnrollments = cid => {
  return enrollmentCourseModel.find({ courseID: cid });
};

// given mission(lp) id, return name
let getMissionName = id => {
  learningPathModel
    .findById(id)
    .lean()
    .exec()
    .then((response, error) => {
      return response.LPName;
    })
    .catch(error => {
      console.log(error);
    });
};

let getAllStudentIDsFromEnrollment = enrollments => {
  return enrollments.map(singleEnrollment => {
    return singleEnrollment.studentID;
  });
};
let getAllAssignmentIdsFromCourseObject = courseObject => {
  let allassignments = courseObject.assignments;
  return allassignments.map(singleAssignment => {
    return singleAssignment.assignmentID;
  });
};

let fetchProgressObjectsForParticularAssignmentID = (
  assignmentID,
  studentIDs
) => {
  return fetch(
    externalURLs.NODE_SERVER +
      "progress/assignment/" +
      assignmentID +
      "?studentIDs=" +
      studentIDs.join(",")
  );
};

let fetchAssessmentResult = (assignmentID, studentIDs) => {
  return fetch(
    externalURLs.NODE_SERVER +
      "assess/game/123/objective/58d845736e4ddb3ce20ed1b3"
  );
};

let getScore = resultsObject => {
  let score = 0;
  for (key in resultsObject) {
    score += resultsObject[key];
  }
  return score;
};

module.exports = router;
