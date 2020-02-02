angular
  .module("studentApp")

  .directive("scratch", function () {
    return {
      restrict: "E",
      scope: {
        movie: "@"
      },
      link: function (scope, element) {
        var object =
          '<object style="position: absolute; left:-40px" width="99%" height="100%">' +
          '<param name="movie" width="100%" height="100%" value="' +
          scope.movie +
          '" />' +
          "</object>";
        element.replaceWith(object);
      }
    };
  })
  .directive("customDraggable", function () {
    return {
      restrict: "A",
      link: function (scope, elem, attr, ctrl) {
        elem.draggable();
      }
    };
  });

// use a factory to accommodate all interactions with database
studentApp.factory("FeedbackService", function ($http) {
  var service = {};

  // get student name, used in placeholder
  service.getStudentName = function (studentID) {
    var url = "/student/" + studentID + "/getInfo";
    return $http.get(url);
  };

  // Deprecated
  service.getCorrectFeedbacks = function (gameID) {
    var url = "/stats/courses/" + gameID + "/getGoodComment";
    return $http.get(url);
  };

  //Deprecated
  service.getWrongFeedbacks = function (gameID) {
    var url = "/stats/courses/" + gameID + "/getBadComment";
    return $http.get(url);
  };

  // fill the student name in feedbacks
  function fillStudentName(studentName, feedback) {
    // var matches = feedback.matches("/\{\{(.*?)\}\}/");
    // if (!matches || !matches.includes('studentName')) {
    //     return feedback;
    // }

    startIndex = feedback.indexOf("{{");
    if (startIndex === -1) {
      return feedback;
    }

    endIndex = feedback.indexOf("}}");

    return (
      feedback.substring(0, startIndex) +
      studentName +
      feedback.substring(endIndex + 2)
    );
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function randomSelectFeedbacks(scratchFeedback, feedbacks) {
    // change this to include signals from scratch
    var scratchCorrect = ["Good Going!"];
    var scratchNeutral = [
      "Oops! You selected a distractor",
      "Try removing a few blocks!"
    ];
    var scratchIncorrect = [];
    var scratchClose = [];

    if (
      scratchCorrect.includes(scratchFeedback) &&
      feedbacks.correct.length !== 0
    ) {
      return feedbacks.correct[getRandomInt(feedbacks.correct.length - 1)];
    } else if (
      scratchIncorrect.includes(scratchFeedback) &&
      feedbacks.incorrect.length !== 0
    ) {
      return feedbacks.incorrect[getRandomInt(feedbacks.incorrect.length - 1)];
    } else if (
      scratchNeutral.includes(scratchFeedback) &&
      feedbacks.neutral.length !== 0
    ) {
      return feedbacks.neutral[getRandomInt(feedbacks.neutral.length - 1)];
    } else if (
      scratchClose.includes(scratchFeedback) &&
      feedbacks.close.length !== 0
    ) {
      return feedbacks.close[getRandomInt(feedbacks.close.length - 1)];
    } else {
      return scratchFeedback;
    }
  }

  service.getFeedback = function (scratchFeedback, feedbacks, studentName) {
    feedback = randomSelectFeedbacks(scratchFeedback, feedbacks);
    feedback = fillStudentName(studentName, feedback);
    return feedback;
  };

  service.getDefaultMoveFeedbacks = function () {
    let defaults = {
      correct: ["You did great", "That is a good direction"],
      incorrect: ["Try something else"],
      neutral: ["You selected an distractor"],
      close: ["Good move, try attach to other blocks"]
    };
    return defaults;
  };

  /**
   * For instructor convnience, we store feedback in list format [{type: feedback}, ...], we need to transform
   * the list into dictionary
   */
  service.reconstructMoveFeedbacks = function (moveFeedbacksFromDB) {
    let moveFeedbacks = {
      correct: [],
      incorrect: [],
      neutral: [],
      close: []
    };

    for (let i = 0; i < moveFeedbacksFromDB.length; i++) {
      let cur = moveFeedbacksFromDB[i];
      if (cur.type === "correct") {
        moveFeedbacks.correct.push(cur.content);
      } else if (cur.type === "incorrect") {
        moveFeedbacks.incorrect.push(cur.content);
      } else if (cur.type === "neutral") {
        moveFeedbacks.neutral.push(cur.content);
      } else {
        moveFeedbacks.close.push(cur.content);
      }
    }
    return moveFeedbacks;
  };
  // *******************************************************************
  // this is the corresponding transformation for assignment feedback
  // *******************************************************************
  service.getDefaultAssignmentFeedbacks = function () {
    let defaults = {
      proficient: ["Excellent Job"],
      developing: ["Nice Job"],
      basic: ["Give it another try"]
    };
    return defaults;
  };

  service.reconstructAssignmentFeedback = function (assignmentFeedbacksFromDB) {
    let feedbacks = {
      proficient: [],
      developing: [],
      basic: []
    };

    for (var i = 0; i < assignmentFeedbacksFromDB.length; i++) {
      if (assignmentFeedbacksFromDB[i].type === "proficient") {
        feedbacks.proficient.push(assignmentFeedbacksFromDB[i].content);
      } else if (assignmentFeedbacksFromDB[i].type === "developing") {
        feedbacks.developing.push(assignmentFeedbacksFromDB[i].content);
      } else {
        feedbacks.basic.push(assignmentFeedbacksFromDB[i].content);
      }
    }

    return feedbacks;
  };

  service.selectFinalAssignmentFeedback = function (feedbacks, level) {
    if (level === "proficient") {
      return feedbacks.proficient[
        getRandomInt(feedbacks.proficient.length - 1)
      ];
    } else if (level === "developing") {
      return feedbacks.developing[
        getRandomInt(feedbacks.developing.length - 1)
      ];
    } else {
      return feedbacks.basic[getRandomInt(feedbacks.basic.length - 1)];
    }
  };

  // *******************************************************************
  // this is end of the corresponding transformation for assignment feedback
  // *******************************************************************
  service.getGameLevelMoveFeedbackFromInstructor = function (gameId) {
    return $http.get("/stats/assignment/" + gameId + "/getmovefeedbacks");
  };

  service.getQuestLevelMoveFeedbackFromInstructor = function (courseId) {
    return $http.get("/stats/course/" + courseId + "/getmovefeedbacks");
  };

  service.getGameLevelAssignmentFeedbackFromInstructor = function (gameId) {
    return $http.get("/stats/assignment/" + gameId + "/getassignmentfeedbacks");
  };

  service.getQuestLevelAssignmentFeedbackFromInstructor = function (courseId) {
    return $http.get("/stats/course/" + courseId + "/getassignmentfeedbacks");
  };

  return service;
});

studentApp.controller("StudentAssessmentController", [
  "$window",
  "$location",
  "$scope",
  "$timeout",
  "$http",
  "$log",
  "$routeParams",
  "$mdStepper",
  "Upload",
  "FeedbackService",
  function (
    $window,
    $location,
    $scope,
    $timeout,
    $http,
    $log,
    $routeParams,
    $mdStepper,
    Upload,
    FeedbackService
  ) {
    $scope.courseID = $routeParams.courseID;
    $scope.gameID = $routeParams.aid;
    $scope.studentID = $routeParams.sid;
    $scope.type = $location.search().type;
    $scope.dataLoaded = false;
    $scope.hide = true;
    $scope.hinthide = true;
    $scope.showFeedback = false;
    $scope.speech = [{ message: "Hello !", color: "black" }]; // array of message to display
    // console.log($scope.speech)
    //$scope.initHide = true;
    var updateFlag = -2;
    var path = $location.path().split("/");
    $scope.aid = path[path.length - 2];
    $scope.baseUrl =
      window.location.protocol + "//" + window.location.hostname + ":8081";
    $scope.baseUrl2 =
      window.location.protocol + "//" + window.location.hostname;

    //==============GET STUDENT ENROLLEMNT INFO, this is used when student assessment need to access class level information

    // $http.get("/student/test/" + $scope.studentID)
    // .then((response) => {

    //     console.log(response);
    //     $scope.enrollments = response.data;
    //     // $scope.classId = getClassIdFromEnrollmentsInfo($scope.courseID, response.data.classIDs); // this is the class Id that student current taking this assignment
    //     console.log("==================DEBUG=================");
    //     console.log($scope.enrollments);
    //     console.log("CLASSID:" + $scope.classId);
    // }, (err) => {
    //     console.log("Error when accessing enrollemnt");
    //     console.log(err);
    // })

    // Get student name that we can replace the placeholder in the move feedback
    FeedbackService.getStudentName($scope.studentID).then(function (res, error) {
      $scope.studentName = res.data.fullname;
    });

    // Get move feedback using the inherit system
    var gameLevelMoveFeedbacks = [];
    var questLevelMoveFeedbacks = [];
    FeedbackService.getGameLevelMoveFeedbackFromInstructor($scope.gameID)
      .then(response => {
        if (response.data.length !== 0) {
          gameLevelMoveFeedbacks = response.data;
        }
        return FeedbackService.getQuestLevelMoveFeedbackFromInstructor(
          $scope.courseID
        );
      })
      .then(response => {
        if (response.data.length !== 0) {
          questLevelMoveFeedbacks = response.data;
        }
      })
      .then(() => {
        if (gameLevelMoveFeedbacks.length !== 0) {
          $scope.moveFeedbacks = FeedbackService.reconstructMoveFeedbacks(
            gameLevelMoveFeedbacks
          );
        } else if (questLevelMoveFeedbacks.length !== 0) {
          $scope.moveFeedbacks = FeedbackService.reconstructMoveFeedbacks(
            questLevelMoveFeedbacks
          );
        } else {
          $scope.moveFeedbacks = FeedbackService.getDefaultMoveFeedbacks();
        }
        console.log("LOOOOOOOK HERERERER");
        console.log($scope.moveFeedbacks);
      })
      .catch(err => {
        console.log(err);
      });

    // Get move feedback using the inherit system
    var gameLevelAssignmentFeedbacks = [];
    var questLevelAssignmentFeedbacks = [];
    FeedbackService.getGameLevelAssignmentFeedbackFromInstructor($scope.gameID)
      .then(response => {
        if (response.data.length !== 0) {
          gameLevelAssignmentFeedbacks = response.data;
        }
        return FeedbackService.getQuestLevelAssignmentFeedbackFromInstructor(
          $scope.courseID
        );
      })
      .then(response => {
        if (response.data.length !== 0) {
          questLevelAssignmentFeedbacks = response.data;
        }
      })
      .then(() => {
        if (gameLevelAssignmentFeedbacks.length !== 0) {
          $scope.assignmentFeedbacks = FeedbackService.reconstructAssignmentFeedback(
            gameLevelAssignmentFeedbacks
          );
        } else if (questLevelAssignmentFeedbacks.length !== 0) {
          $scope.assignmentFeedbacks = FeedbackService.reconstructAssignmentFeedback(
            questLevelAssignmentFeedbacks
          );
        } else {
          $scope.assignmentFeedbacks = FeedbackService.getDefaultAssignmentFeedbacks();
        }

        console.log($scope.assignmentFeedbacks);
      })
      .catch(err => {
        console.log(err);
      });

    if (window.location.hostname === "localhost") {
      $scope.baseUrl2 += ":3000";
      // give game 1.5 seconds to fetch objective from local assessment server
      setTimeout(function () {
        if (!$scope.dataLoaded) {
          $scope.movie = {
            name: "movie",
            url:
              "/public/sampleSWF/scratch.swf?sid=" +
              $scope.studentID +
              "&assignmentID=" +
              $scope.gameID +
              "&objectiveID=" +
              $scope.objectiveID +
              "&mode=PLAY" +
              "&backend=" +
              $scope.baseUrl +
              "&type=" +
              $scope.type
          };
        }
        $scope.dataLoaded = true;
      }, 1500);
    }

    //for instruction
    $scope.steps = [];
    $http.get("/student/courses/submitdownload").then(function (response) {
      console.log("response");
      console.log(response);
    });
    ///instructors/games/:gid/instructions
    $http
      .get("/stats/instructors/games/" + $scope.aid + "/instructions")
      .then(function (response) {
        if (response.data === "") {
          //no instruction in db
          $scope.isCreated = false;
          $scope.previewImg = [
            {
              img: "/public/images/logo.png",
              imgWidth: "",
              imgHeight: ""
            }
          ];

          $scope.steps = [
            {
              heading: "",
              description: "",
              img: "/public/images/logo.png",
              imgWidth: "",
              imgHeight: ""
            }
          ];
        } else {
          $scope.isCreated = true;
          var stepContent = response.data.content;
          console.log("zhutou", response);
          $scope.iid = response.data._id;
          console.log($scope.iid);
          for (var i = 0; i < stepContent.length; i++) {
            var heading = stepContent[i].heading;
            var description = stepContent[i].other[0].description;
            var img = stepContent[i].other[0].image;
            var step = {
              heading: heading,
              description: description,
              img: img,
              imgWidth: "",
              imgHeight: ""
            };
            $scope.steps.push(step);
          }

          $scope.previewImg = {
            img: response.data.img,
            imgWidth: "",
            imgHeight: ""
          };
          //document.querySelector("#previewImg").src = response.data.img;
        }
      });

    $scope.previousStep = function () {
      var steppers = $mdStepper("preview-step");
      steppers.back();
    };

    $scope.nextStep = function () {
      var steppers = $mdStepper("preview-step");
      steppers.next();
    };

    var results = null;

    timex = 0;

    var backendUrl = $scope.baseUrl;

    // Get Objective from Game
    $http.get(backendUrl + "/games/" + $scope.gameID).then(function (response) {
      if (response.data.objectiveID) {
        $log.info(response);
        $scope.objectiveID = response.data.objectiveID;
        console.log("response.data.objectiveID:", response.data.objectiveID);
      } else {
        $log.info("Objective not found");
        console.log("response.data.objectiveID not found:");
      }

      if (!$scope.dataLoaded) {
        $scope.movie = {
          name: "movie",
          url:
            "/public/sampleSWF/scratch.swf?sid=" +
            $scope.studentID +
            "&assignmentID=" +
            $scope.gameID +
            "&objectiveID=" +
            $scope.objectiveID +
            "&mode=PLAY" +
            "&backend=" +
            $scope.baseUrl +
            "&type=" +
            $scope.type
        };
        $scope.dataLoaded = true;
      }

      // $timeout(polldata, 1000);
      // checkFlag();
    });

    //timer
    var totalTime = 500;
    $scope.timer = 500;
    $scope.question = "";
    $scope.hint = "";
    $scope.basic = 0;
    $scope.developing = 0;
    $scope.proficient = 0;

    // get game setting info
    $http
      .get(
        $scope.baseUrl2 +
        "/student/courses/" +
        $scope.courseID +
        "/assessment/" +
        $scope.gameID +
        "/" +
        $scope.studentID
      )
      .then(function (response) {
        totalTime = response.data.time;
        $scope.timer = response.data.time;
        $scope.question = response.data.question;
        $scope.hint = response.data.hint;
        $scope.basic = parseInt(response.data.basic);
        $scope.developing = parseInt(response.data.developing);
        $scope.proficient = parseInt(response.data.max);
        $scope.timer_display = secondsToHms($scope.timer);
        console.log("Timer:");
        console.log($scope.timer);
      });

    // check whether is parsons puzzle
    $scope.is_parsons_puzzle = false;
    $scope.is_no_feedback_parsons = false;

    $http
      .get(
        $scope.baseUrl2 + "/stats/students" + "/assignment/" + $routeParams.aid
      )
      .then(function (response) {
        console.log($routeParams.aid);
        console.log("a type is: ");
        console.log(response.data);
        if (response.data.indexOf("parsons") >= 0) {
          $scope.is_parsons_puzzle = true;
        }
        if (response.data.indexOf("feedback") >= 0) {
          $scope.is_no_feedback_parsons = true;
        }
      });

    // $http
    //   .get(
    //     $scope.baseUrl2 +
    //       "/student/courses/" +
    //       $scope.courseID +
    //       "/assessment/" +
    //       $scope.gameID +
    //       "/" +
    //       $scope.studentID +
    //       "/coursename"
    //   )
    //   .then(function(response) {
    //     var name = response.data.response.courseName;
    //     if (name == "Parson's Puzzles") {
    //       $scope.is_parsons_puzzle = true;
    //     }
    //   });

    var type = "manual";

    // check if auto-submitted every second
    var aurl =
      $scope.baseUrl2 +
      "/student/courses/assessment/" +
      $scope.gameID +
      "/" +
      $scope.studentID +
      "/autosubmit";
    (function poll() {
      setTimeout(function () {
        $.ajax({
          url: aurl,
          success: function (data) {
            var submitted = data.submitted;
            if (submitted) {
              $scope.endTimer();
              type = "autosubmit";
            }
          },
          dataType: "json",
          complete: poll
        });
      }, 1000);
    })();

    var lastFeedback = "";

    checkFlag();
    $scope.meaningfulMoves = 0;
    $scope.feedbackFetched = false;
    $scope.progressBar = 0;
    var finishedPuzzle = false;
    var correctlySolved = false;
    function checkFlag() {
      if ($scope.dataLoaded == false) {
        window.setTimeout(
          checkFlag,
          100
        ); /* this checks the flag every 100 milliseconds*/
        $log.info("Checking");
      } else {
        // get score every second
        console.log("get score in checkFlag");
        var surl =
          $scope.baseUrl2 +
          "/student/courses/" +
          $scope.courseID +
          "/assessment/" +
          $scope.gameID +
          "/" +
          $scope.studentID +
          "/score";
        (function poll() {
          var timeoutPromise = $timeout(function () {
            $.ajax({
              url: surl,
              success: function (data) {
                console.log("get data from " + surl);
                $scope.score = data.response;
                $scope.feedbackFetched = true;
                $scope.isFinal = data.isFinal;
                $scope.isNotFinal = !data.isFinal;

                // var levelword = document.getElementById("level");
                // if ($scope.score < $scope.basic) {
                //   levelword.innerHTML = "Fighting";
                // } else if ($scope.score < $scope.developing) {
                //   levelword.innerHTML = "Basic";
                // } else if ($scope.score < $scope.proficient) {
                //   levelword.innerHTML = "Developing";
                // } else {
                //   levelword.innerHTML = "Proficient";
                // }
                // console.log(lastFeedback);
                // console.log(data.feedback);
                // if (lastFeedback !== data.feedback) {
                //   lastFeedback = data.feedback;
                //   var curFeedback = FeedbackService.getFeedback(
                //     data.feedback,
                //     $scope.moveFeedbacks,
                //     $scope.studentName
                //   );
                // }

                if (data.meaningfulMoves !== 0) {
                  $scope.meaningfulMoves = data.meaningfulMoves;
                }
                if (data.maxScoreForGame !== 0) {
                  $scope.progressBar = 100 * $scope.score / data.maxScoreForGame;
                }
                fullResults = data;
                console.log("Updating score every second.");
                $scope.level1 = "Basic";
                console.log($scope.score);

                var color = "black";
                if (updateFlag !== fullResults.updateFlag) {
                  $scope.score = fullResults.response;
                  $scope.customStyle = {};
                  updateFlag = fullResults.updateFlag;
                  if (fullResults.colorFlag === 4) {
                    // $scope.customStyle.style = { color: "grey" };
                    color = "grey";
                  } else if (fullResults.colorFlag === 1) {
                    // $scope.customStyle.style = { color: "red" };
                    color = "red";
                  } else if (fullResults.colorFlag === 2) {
                    // $scope.customStyle.style = { color: "blue" };
                    color = "blue";
                  } else if (fullResults.colorFlag === 3) {
                    // $scope.customStyle.style = { color: "green" };
                    color = "green";
                  } else {
                    // $scope.customStyle.style = { color: "black" };
                    color = "black";
                  }
                  const pushfeedback = fullResults.feedback;
                  //$scope.speech.push(fullResults.feedback);
                  $scope.speech.push({ message: pushfeedback, color: color });
                  $scope.feedback1 = fullResults.feedback;
                }

                console.log("Feedback: " + fullResults.feedback);
                if (
                  (fullResults.feedback == "Congratulations!" ||
                    fullResults.feedback.indexOf("submitted") >= 0) &&
                  !finishedPuzzle
                ) {
                  correctlySolved = true;
                  $scope.endTimer();
                  $timeout.cancel(timeoutPromise);
                }

                var feedbackBtn = document.getElementById("feedbackbtn");
                // if (data.wrongState) {
                //   var surl2 =
                //     $scope.baseUrl2 +
                //     "/student/courses/" +
                //     $scope.courseID +
                //     "/assessment/" +
                //     $scope.gameID +
                //     "/" +
                //     $scope.studentID +
                //     "/peerFeedback";
                //   $.ajax({
                //     url: surl2,
                //     success: function(data) {
                //       $scope.peerFeedback = data.feedback;
                //       $scope.instructorFeedback = data.instructorFeedback;
                //     },
                //     dataType: "json"
                //   });

                //   if (
                //     $scope.peerFeedback != null &&
                //     $scope.peerFeedback.length != 0
                //   ) {
                //     feedbackbtn.style.display = "block";
                //   } else {
                //     feedbackbtn.style.display = "none";
                //   }
                // } else {
                //   feedbackbtn.style.display = "none";
                // }

                $scope.$apply();
              },
              dataType: "json",
              complete: poll
            });
          }, 1000);

          $scope.$on("$destroy", function () {
            $timeout.cancel(timeoutPromise);
          });
        })();
      }
    }

    var ml = new MessageList();
    var polldata = function () {
      // poll a GET request to node, send every second

      // update points
      // $log.info("updating points " + $scope);
      // console.log("updating points");
      // console.log($scope);
      $http({
        method: "GET",
        url:
          $scope.baseUrl2 +
          "/student/courses/" +
          $scope.courseID +
          "/assessment/" +
          $scope.gameID +
          "/" +
          $scope.studentID +
          "/score"
      }).then(function (response) {
        if (response.status == "400") {
          console.log(response.data.error);
        } else {
          fullResults = response.data;
          console.log("my test!!!!!!!!!!!!!!!!!!!!!!!!");
          console.log(fullResults);
          $scope.level1 = "Basic";
          //   $scope.speech = fullResults.feedback["feedback"];
          // $scope.feedback1 = fullResults.feedback;
          console.log($scope.score);
          console.log(fullResults.score);
          var color = "black";
          if (updateFlag !== fullResults.updateFlag) {
            $scope.score = fullResults.response;
            $scope.customStyle = {};
            updateFlag = fullResults.updateFlag;
            if (fullResults.colorFlag === 4) {
              // $scope.customStyle.style = { color: "grey" };
              color = "grey";
            } else if (fullResults.colorFlag === 1) {
              // $scope.customStyle.style = { color: "red" };
              color = "red";
            } else if (fullResults.colorFlag === 2) {
              // $scope.customStyle.style = { color: "blue" };
              color = "blue";
            } else if (fullResults.colorFlag === 3) {
              // $scope.customStyle.style = { color: "green" };
              color = "green";
            } else {
              // $scope.customStyle.style = { color: "black" };
              color = "black";
            }
            const pushfeedback = fullResults.feedback;
            //$scope.speech.push(fullResults.feedback);
            $scope.speech.push({ message: pushfeedback, color: color });
            $scope.feedback1 = fullResults.feedback;
          }
        }
      });
      //   $log.info("Printing assessment " + $scope);
      //   // $http({ method: 'GET', url: backendUrl + '/assess/game/' + $scope.gameID + '/objective/' + $scope.objectiveID + '/student/' + $scope.studentID })
      //   $http({
      //     method: "GET",
      //     url:
      //       backendUrl +
      //       "/assess/game/" +
      //       $scope.gameID +
      //       "/student/" +
      //       $scope.studentID
      //   }).then(function(response) {
      //     // console.log("helloworld");
      //     // if (response.status == '200') {
      //     //     console.log(response.body);
      //     // }
      //     if (response.status == "403") {
      //       $log.info("Inside GET");
      //       $window.location.href = "/public/views/error.html";
      //     } else {
      //       fullResults = response.data;
      //       results = fullResults.assess.assessmentResult.sort(function(a, b) {
      //         if (a._id < b._id) {
      //           return -1;
      //         } else if (a._id > b._id) {
      //           return 1;
      //         }
      //         return 0;
      //       });

      //       if (Object.keys(results).length != 0) {
      //         //$log.info(results)
      //         let spliceNum = 0;
      //         for (x in results) {
      //           if (results[x].actions != null) {
      //             ml.addNode(results[x].actions.command);
      //             // $log.info($scope.speech=results[x].actions.command)
      //           }
      //         }
      //         $scope.results = results;
      //         $scope.progress = "33";
      //         $scope.level = "Basic";
      //         $log.info($scope.results);
      //       }
      //     }
      //   });
      $timeout(polldata, 2000);
    };

    var counter = 0,
      howManyTimes = 1,
      index = 0;
    function f() {
      ml.next();
      if (typeof ml.current !== "undefined") {
        //$scope.speech.push(ml.current.message);
        $scope.speech.push({ message: ml.current.message, color: "black" });
        // $("#speech").text(ml.current.message);
      }
      // Free the resource
      // if(ml.size>50){
      //     ml.pop();
      // }
      setTimeout(f, 1000);
    }
    f();

    // Timer Functions
    $scope.timer_display = secondsToHms($scope.timer);
    $scope.timer_running = true;

    // $scope.timer = 600;
    // $scope.timer_display = secondsToHms($scope.timer);
    // $scope.timer_running = false;

    var timeoutFn;

    $scope.startTimer = function () {
      $scope.timer_running = true;
      timeoutFn = $timeout(function () {
        $scope.timer--;
        $scope.timer_display = secondsToHms($scope.timer);
        $scope.timer > 0 ? $scope.startTimer() : $scope.endTimer();
        if ($scope.timer == 0) {
          type = "timeup";
          $scope.speech.push({ message: "Times Up!", color: "black" });
        } else if ($scope.timer == 180) {
          $scope.speech.push({ message: "3 Minutes Left!", color: "black" });
        } else if ($scope.timer == 60) {
          $scope.speech.push({ message: "1 Minute Left!", color: "black" });
        }
      }, 1000);
    };

    // pop up modal
    $scope.endTimer = function () {
      $scope.timer_running = false;
      $timeout.cancel(timeoutFn);
      finishedPuzzle = true;
      // send submission info
      var url =
        $scope.baseUrl2 +
        "/student/courses/" +
        $scope.courseID +
        "/assessment/" +
        $scope.gameID +
        "/" +
        $scope.studentID +
        "/selfsubmit";

      $http
        .post(url, {
          point: $scope.score
        })
        .success(function (data) {
          console.log(data);
          console.log("Submit type is: " + type);

          if (type === "manual") {
            if (!$scope.is_no_feedback_parsons) {
              document.getElementById("line").innerHTML = "Your Result";
            } else {
              document.getElementById("line").innerHTML = "Submit Your Result";
            }
          } else if (type === "autosubmit") {
            document.getElementById("line").innerHTML = "Congratulations!";
          } else if (type === "timeup") {
            document.getElementById("line").innerHTML = "Time's Up!";
          }

        })
        .error(function (data) {
          console.log("Failed! ", JSON.stringify({ data: data }));
        });

      var modal = document.getElementById("submitModal");
      var history = document.getElementById("history");

      // get feedback
      // var histroyURL = $scope.baseUrl2 + "/student/courses/" + $scope.courseID + "/assessment/" + $scope.gameID + "/" + $scope.studentID + "/checkHistory";
      // $http.get(histroyURL)
      // .then( (response) => {
      //     // console.log("here");
      //     // console.log(response);
      //     // console.log(response.data.times);
      //     var times;
      //     var avgScore;
      //     // $scope.history = {
      //     //     "times": response.data.times,
      //     //     "avgScore": response.data.times
      //     // };
      //     console.log(response);
      //     if (response.data.times === 0) {
      //         history.style.display = "none";
      //         times = 0;
      //         avgScore = 0;
      //     } else {
      //         history.style.display = "inline-block";
      //         times = response.data.times;
      //         avgScore = response.data.avgScore;
      //     }
      //     $scope.history = {
      //         "times": response.data.times,
      //         "avgScore": response.data.avgScore
      //     };
      // }, (error) => {
      //     history.style.display = "none";
      //     console.log(error);
      // })
      $scope.hintUsage = hintUsage;
      $scope.timeUsage = totalTime - $scope.timer;

      // select assignement feedback based on performance
      var finalEvaluation;
      if ($scope.score < $scope.basic) {
        finalEvaluation = "basic";
      } else if ($scope.score < $scope.developing) {
        finalEvaluation = "developing";
      } else {
        finalEvaluation = "proficient";
      }

      $scope.assignmentFeedbacksFinal = {};
      // $scope.assignmentFeedbacksFinal.content = FeedbackService.selectFinalAssignmentFeedback(
      //   $scope.assignmentFeedbacks,
      //   finalEvaluation
      // );
      console.log("5555555");
      console.log($scope.assignmentFeedbacksFinal);
      modal.style.display = "block";
    };

    // if auto-submit from backend, also trigger endtimer

    // submission
    var sbtn = document.getElementById("sbtn");

    sbtn.onmousedown = function () {
      type = "manual";
      $scope.endTimer();

      // send submission info
      var url =
        $scope.baseUrl2 +
        "/student/courses/" +
        $scope.courseID +
        "/assessment/" +
        $scope.gameID +
        "/" +
        $scope.studentID +
        "/selfsubmit";

      $http
        .post(url, {
          point: $scope.score,
          solved: correctlySolved
        })
        .success(function (data) {
          console.log("Succeed!");
        })
        .error(function (data) {
          console.log("Failed! ", JSON.stringify({ data: data }));
        });
    };
    sbtn.onmouseup = function () {
      var url =
        $scope.baseUrl2 +
        "/student/courses/" +
        $scope.courseID +
        "/assessment/" +
        $scope.gameID +
        "/" +
        $scope.studentID +
        "/submitdownload";
      $http
        .post(url, {})
        .success(function (data) {
          console.log("download!");
        })
        .error(function (data) {
          console.log("Failed! ", JSON.stringify({ data: data }));
        });
    };

    // submit and go to main
    var mbtn = document.getElementById("mbtn");

    mbtn.onclick = function () {
      // send submission info
      var url =
        $scope.baseUrl2 +
        "/student/courses/" +
        $scope.courseID +
        "/assessment/" +
        $scope.gameID +
        "/" +
        $scope.studentID +
        "/timeup";

      // textarea
      var selfExplanation = document.getElementById("explaination").value;

      if (!selfExplanation || 0 === selfExplanation.length) {
        document.getElementById("errmsg").style.display = "block";
      } else {
        $http
          .post(url, {
            selfExplanation: selfExplanation
          })
          .success(function (data) {
            console.log("Succeed!");
          })
          .error(function (data) {
            console.log("Failed! ", JSON.stringify({ data: data }));
          });
        window.location = "#/home/" + $scope.studentID;
      }
    };

    var ctn = document.getElementById("ctn");
    ctn.onclick = function () {
      var smodal = document.getElementById("submitModal");
      smodal.style.display = "none";
      if ($scope.timer > 0) {
        console.log("restart timer");
        $scope.startTimer();
      }
    };

    $scope.instructionControl = function () {
      $scope.speech.push({
        message: "Here is the Instructions!",
        color: "black"
      });
      $scope.hide = !$scope.hide;
    };

    // Get the modal
    var modal = document.getElementById("popModal");

    // Get the button that opens the modal
    var qtbtn = document.getElementById("qtbtn");
    var hibtn = document.getElementById("hibtn");
    var feedbackbtn = document.getElementById("feedbackbtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    qtbtn.onclick = function () {
      // modal.style.display = "block";
      if (!$scope.question || $scope.question === "") {
        $scope.speech.push({
          message: "No question available",
          color: "black"
        });
      } else {
        $scope.speech.push({ message: $scope.question, color: "black" });
      }
      // $scope.speech = $scope.question
      // $scope.modal_title = "Question"
      // $scope.modal_content = $scope.question
    };

    feedbackbtn.onclick = function () {
      modal.style.display = "block";
      $scope.modal_title = "Wondering why that was the wrong block?";

      var feedbackStr = "";
      var count = 1;

      for (var i = 0; i < $scope.peerFeedback.length; i++) {
        feedbackStr =
          feedbackStr + count + ": " + $scope.peerFeedback[i] + "\n";
        count += 1;
      }

      if ($scope.instructorFeedback != null) {
        feedbackStr =
          "Feedback from instructor:" +
          "\n" +
          $scope.instructorFeedback +
          "\n" +
          "Feedback from your peers:" +
          "\n" +
          feedbackStr;
      }

      $scope.modal_content = feedbackStr;

      //send update-point event
      var url =
        $scope.baseUrl2 +
        "/student/courses/" +
        $scope.courseID +
        "/assessment/" +
        $scope.gameID +
        "/" +
        $scope.studentID +
        "/feedbackUsed";

      $http
        .post(url, {
          feedback: true
        })
        .success(function (data) {
          console.log("Succeed!");
        })
        .error(function (data) {
          console.log("Failed! ", JSON.stringify({ data: data }));
        });
    };

    var hintUsage = 0;
    // get hint
    hibtn.onclick = function () {
      // modal.style.display = "block";
      // $scope.modal_title = "Hint"
      // $scope.modal_content = $scope.hint
      if (!$scope.hint || $scope.hint === "") {
        $scope.speech.push({ message: "No hint available", color: "black" });
      } else {
        $scope.speech.push({ message: $scope.hint, color: "black" });
      }
      hintUsage++;

      // notify hint usage
      var url =
        $scope.baseUrl2 +
        "/student/courses/" +
        $scope.courseID +
        "/assessment/" +
        $scope.gameID +
        "/" +
        $scope.studentID +
        "/hint";

      $http
        .post(url, {
          hint: true
        })
        .success(function (data) {
          console.log("Succeed!");
        })
        .error(function (data) {
          console.log("Failed! ", JSON.stringify({ data: data }));
        });
    };

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
      modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };

    $scope.closeInstruction = function () {
      $scope.hide = true;
    };

    // Auto Start
    $scope.startTimer();

    $scope.mStr = "00";
    $scope.sStr = "05";
    $scope.score = 0;

    function secondsToHms(d) {
      d = Number(d);
      // var h = Math.floor(d / 3600);
      var m = Math.floor(d / 60);
      var s = Math.floor(d % 60);

      // var hStr = h > 0 ? h + ":" : "";
      var mStr = (m > 9 ? m : "0" + m) + ":";
      var sStr = s > 9 ? s : "0" + s;

      $scope.mStr = m > 9 ? m : "0" + m;
      $scope.sStr = s > 9 ? s : "0" + s;

      // return mStr + sStr;
    }

    // Orbs columns
    $scope.orb_col = 4; // 1,2,3,4, or 6
  }
]);
