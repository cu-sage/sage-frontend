var studentSubmissionModel = require("../models/studentSubmissionModel");
var tempStudentScoresModel = require("../models/tempStudentScoresModel");
var assignmentPointConfigModel = require("../models/assignmentPointConfigModel");
var gameSettingModel = require("../models/gameSettingModel");
var peerFeedbackModel = require("../models/peerFeedbackModel");
var tempPeerFeedbackModel = require("../models/tempPeerFeedbackModel");
var mongoose = require("mongoose");

var submitStudentAnswer = (
  startTime,
  score,
  hintUsage,
  remainingSeconds,
  submitMsg,
  endTime,
  meaningfulMoves,
  maxScoreForGame,
  blocks,
  studentID,
  assignmentID,
  objectiveID,
  selfExplanation,
  sb2File
) => {
  var newStudentSubmission = new studentSubmissionModel({
    startTime: startTime,
    score: score,
    hintUsage: hintUsage,
    remainingSeconds: remainingSeconds,
    submitMsg: submitMsg,
    endTime: endTime,
    meaningfulMoves: meaningfulMoves,
    maxScoreForGame: maxScoreForGame,
    blocks: [...blocks],
    studentID: studentID,
    assignmentID: assignmentID,
    objectiveID: objectiveID,
    selfExplanation: selfExplanation,
    sb2File: sb2File,
    hairball_score: ""
  });

  newStudentSubmission.save((err, submission_inserted) => {
    if (!err) {
      console.log({ status: 200, message: submission_inserted });
    } else
      console.log({ status: 404, message: { error: "Not saved into db" } });
  });
};

// Assume that every student has only one submission
var getStudentSubmission = (studentID, assignmentID) => {
  return new Promise((resolve, reject) => {
    studentSubmissionModel
      .find({
        studentID: studentID,
        assignmentID: assignmentID
      })
      .exec()
      .then((res, err) => {
        resolve(res);
      })
      .catch(error => {
        res.status(500).send({ error: error });
      });
  });
};

var updateSubmission = json => {
  return new Promise((resolve, reject) => {
    studentSubmissionModel
      .find({
        studentID: json.studentID,
        assignmentID: json.assignmentID
      })
      .update(json)
      .exec()
      .then((res, err) => {
        resolve(res);
      })
      .catch(error => {
        res.status(500).send({ error: error });
      });
  });
};

var scoreChanging = (
  studentID,
  assignmentID,
  objectiveID,
  timestamp,
  newPoint,
  feedback,
  isFinal,
  firstBlock,
  wrongBlock,
  correctBlock,
  colorFlag,
  updateFlag,
  meaningfulMoves,
  maxScoreForGame
) => {
  var wrongState = false;
  if (
    feedback != "Good Going!" &&
    feedback != "Welcome to the Parson's Puzzles!"
  ) {
    wrongState = true;
  }
  var newScoreChange = new tempStudentScoresModel({
    studentID: studentID,
    assignmentID: assignmentID,
    objectiveID: objectiveID,
    timestamp: timestamp,
    newPoint: newPoint,
    feedback: feedback,
    isFinal: isFinal,
    wrongState: wrongState,
    colorFlag: colorFlag,
    updateFlag: updateFlag,
    meaningfulMoves: meaningfulMoves,
    maxScoreForGame: maxScoreForGame
  });

  newScoreChange.save((err, update_inserted) => {
    if (!err) {
      console.log({ status: 200, message: update_inserted });
    } else
      console.log({ status: 404, message: { error: "Not saved into db" } });
  });

  if (wrongState) {
    //get a list of feedbacks here
    var listOfPeerFeedbacks = [];
    var instructorFeedback = null;
    peerFeedbackModel
      .find({
        assignmentID: assignmentID,
        firstBlock: firstBlock,
        wrongBlock: wrongBlock,
        correctBlock: correctBlock
      })
      .exec()
      .then((response, error) => {
        for (var i = 0; i < response.length; i++) {
          listOfPeerFeedbacks.push(response[i].feedback);
        }

        peerFeedbackModel
          .find({
            assignmentID: assignmentID,
            firstBlock: firstBlock,
            wrongBlock: wrongBlock,
            correctBlock: null
          })
          .exec()
          .then((response, error) => {
            if (response.length != 0) {
              instructorFeedback = response[0].feedback;
            }

            //update list of feedback here
            tempPeerFeedbackModel
              .find({
                assignmentID: assignmentID,
                studentID: studentID
              })
              .remove()
              .exec()
              .then((res, err) => {
                var insertAgent = new Promise((resolve, reject) => {
                  var newFeedback = new tempPeerFeedbackModel({
                    assignmentID: assignmentID,
                    studentID: studentID,
                    feedback: listOfPeerFeedbacks,
                    instructorFeedback: instructorFeedback
                  });
                  newFeedback.save((err, update_inserted) => {
                    if (!err) {
                      console.log({ status: 200, message: update_inserted });
                    } else
                      console.log({
                        status: 404,
                        message: { error: "Not saved into db" }
                      });
                  });
                });
              });
          })
          .catch(e => {
            console.log("ERROR getting instructor feedback for student");
          });
      })
      .catch(e => {
        console.log("ERROR getting feedback for student");
      });
  }
};

var newFeedback = (
  assignmentID,
  studentID,
  firstBlock,
  wrongBlock,
  correctBlock,
  feedback
) => {
  peerFeedbackModel.findOne(
    {
      assignmentID: assignmentID,
      studentID: studentID,
      firstBlock: firstBlock,
      wrongBlock: wrongBlock,
      correctBlock: correctBlock
    },
    function(err, existingFeedback) {
      if (existingFeedback) {
        console.log({
          status: 409,
          message: {
            peerFeedback:
              "feedback on current blocks already taken from student"
          }
        });
        return;
      }

      if (
        feedback != null &&
        feedback != "" &&
        studentID != null &&
        correctBlock != null
      ) {
        //saving student feedback
        var peerFeedback = new peerFeedbackModel({
          assignmentID: assignmentID,
          studentID: studentID,
          firstBlock: firstBlock,
          wrongBlock: wrongBlock,
          correctBlock: correctBlock,
          feedback: feedback
        });

        peerFeedback.save(function(err, feedbackSaved) {
          if (!err) {
            console.log({ status: 200, message: feedbackSaved });
          } else console.log({ status: 404, message: { error: "Not saved into db" } });
        });
      } else if (feedback != null && feedback != "") {
        //saving instructor feedback
        var peerFeedback = new peerFeedbackModel({
          assignmentID: assignmentID,
          studentID: null,
          firstBlock: firstBlock,
          wrongBlock: wrongBlock,
          correctBlock: null,
          feedback: feedback
        });

        peerFeedback.save(function(err, feedbackSaved) {
          if (!err) {
            console.log({ status: 200, message: feedbackSaved });
          } else console.log({ status: 404, message: { error: "Not saved into db" } });
        });
      }
    }
  );
};

var checkDuplicateConfigName = (id, configName) => {
  // dew Promise((resolve, reject)=>{});
  // async function checkDuplicateConfigName(id,configName){
  return new Promise((resolve, reject) => {
    assignmentPointConfigModel
      .find({ id: id, configName: configName })
      .exec()
      .then((response, error) => {
        if (response.length > 0) {
          console.log("Check Duplicate response is TRUE");
          resolve(true);
        } else {
          console.log("Check Duplicate response is FALSE");
          resolve(false);
        }
        reject();
      })
      .catch(e => {
        console.log("ERROR Check Duplicate");
      });
  });
};

var savePointConfig = (id, configName, pointConfig) => {
  var newAssignmentPointConfig = new assignmentPointConfigModel({
    id: id,
    configName: configName,
    pointConfig: pointConfig
  });
  checkDuplicateConfigName(id, configName).then(res => {
    if (res) {
      var deleteAgent = new Promise((resolve, reject) => {
        assignmentPointConfigModel
          .find({
            id: id,
            configName: configName
          })
          .update({
            pointConfig: pointConfig
          })
          .exec();
      });
    } else {
      newAssignmentPointConfig.save((err, inserted) => {
        if (!err) {
          console.log({ status: 200, message: inserted });
        } else
          console.log({ status: 404, message: { error: "Not saved into db" } });
      });
    }
  });
};

var updateGameSetting = (
  assignmentID,
  studentID,
  time,
  question,
  hint,
  basic,
  developing,
  proficient,
  submitMsg
) => {
  var deleteAgent = new Promise((resolve, reject) => {
    gameSettingModel
      .find({
        assignmentID: assignmentID
      })
      .remove()
      .exec()
      .then((res, err) => {
        var insertAgent = new Promise((resolve, reject) => {
          var newGameSetting = new gameSettingModel({
            assignmentID: assignmentID,
            question: question,
            hint: hint,
            time: time,
            basic: basic,
            developing: developing,
            proficient: proficient,
            submitMsg: submitMsg
          });
          newGameSetting.save((err, update_inserted) => {
            if (!err) {
              console.log({ status: 200, message: update_inserted });
            } else
              console.log({
                status: 404,
                message: { error: "Not saved into db" }
              });
          });
        });
      });
  });
};

var fetchPointConfig = () => {
  return new Promise((resolve, reject) => {
    assignmentPointConfigModel
      .find()
      .exec()
      .then((response, error) => {
        resolve(response);
      })
      .catch(error => {
        res.status(500).send({ error: error });
      });
  });
};

var deleteStudentTempScores = (assignmentID, studentID) => {
  return new Promise((resolve, reject) => {
    tempStudentScoresModel
      .find({ studentID: studentID, assignmentID: assignmentID })
      .remove()
      .exec();
  });
};

module.exports = {
  submitStudentAnswer: submitStudentAnswer,
  scoreChanging: scoreChanging,
  savePointConfig: savePointConfig,
  checkDuplicateConfigName: checkDuplicateConfigName,
  fetchPointConfig: fetchPointConfig,
  getStudentSubmission: getStudentSubmission,
  updateSubmission: updateSubmission,
  updateGameSetting: updateGameSetting,
  deleteStudentTempScores: deleteStudentTempScores,
  newFeedback: newFeedback
};
