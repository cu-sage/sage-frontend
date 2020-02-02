const fetch = require ('node-fetch');
const externalURLs = require ('../config/externalURLs.js');
const mockGamesDataAdapter = require("./mockGamesDataAdapter");

const recommendationsAdapter = (function(dataAdapter) {
  // Validate Argument
  if (
    !dataAdapter ||
    !isFunction(dataAdapter.getAllGames) ||
    !isFunction(dataAdapter.getAllGamesOfAllStudents) ||
    !isFunction(dataAdapter.getAllGamesInClass)
  ) {
    throw new Error("Invalid Argument: [dataAdapter]");
  }

  function isFunction(obj) {
    return typeof obj === "function";
  }

  function createStudentsRequest(studentId, allGames, allStudentGames) {
    return {
      recommendation_type: "student",
      mode: "learn",
      studentID: studentId,
      allGames: allGames,
      enrollments: allStudentGames,
      featuresInfo: {
        difficulty: {
          weight: 0.3,
          type: "scalar",
          maxValue: 3
        },
        abstractionProblemDecompositionCtScore: {
          weight: 0.1,
          type: "scalar",
          maxValue: 3
        },
        parallelismCtScore: {
          weight: 0.1,
          type: "scalar",
          maxValue: 3
        },
        logicalThinkingCtScore: {
          weight: 0.1,
          type: "scalar",
          maxValue: 3
        },
        synchronizationCtScore: {
          weight: 0.1,
          type: "scalar",
          maxValue: 3
        },
        flowControlCtScore: {
          weight: 0.1,
          type: "scalar",
          maxValue: 3
        },
        userInteractivityCtScore: {
          weight: 0.1,
          type: "scalar",
          maxValue: 3
        },
        dataRepresentationCtScore: {
          weight: 0.1,
          type: "scalar",
          maxValue: 3
        }
      }
    };
  }

  function createTeachersRequest(allGames, gamesInClass) {
    return {
      recommendation_type: "teacher",
      mode: "learn",
      allGames: allGames,
      classroom: gamesInClass,
      featuresInfo: {
        difficulty: {
          weight: 0.3,
          type: "scalar",
          maxValue: 3
        },
        abstractionProblemDecompositionCtScore: {
          weight: 0.1,
          type: "scalar",
          maxValue: 3
        },
        parallelismCtScore: {
          weight: 0.1,
          type: "scalar",
          maxValue: 3
        },
        logicalThinkingCtScore: {
          weight: 0.1,
          type: "scalar",
          maxValue: 3
        },
        synchronizationCtScore: {
          weight: 0.1,
          type: "scalar",
          maxValue: 3
        },
        flowControlCtScore: {
          weight: 0.1,
          type: "scalar",
          maxValue: 3
        },
        userInteractivityCtScore: {
          weight: 0.1,
          type: "scalar",
          maxValue: 3
        },
        dataRepresentationCtScore: {
          weight: 0.1,
          type: "scalar",
          maxValue: 3
        }
      }
    };
  }

  function getStudentRecommendations(studentId) {
    return new Promise(function(resolve, reject) {
      // Get All Games
      dataAdapter.getAllGames().then(
        // Get All Games Success
        function(allGames) {
          // Get Games of Students
          dataAdapter.getAllGamesOfAllStudents().then(
            // Get Games of Students Success
            function(studentGames) {
              // Create Request to send
              var request = createStudentsRequest(
                studentId,
                allGames,
                studentGames
              );
              // Make request
              fetch (externalURLs.RECOMMENDATION_SERVER, {
                method : 'POST',
                headers : {
                    'Content-type' : 'application/json'
                },
                body : JSON.stringify (request)
              })
              .then(
                res => res.json()
              )
              .then(
                json => resolve(json)
              );
            },
            // Get Games of Students Error
            function(error) {
              reject(error);
            }
          );
        },
        // Get All Games Error
        function(error) {
          reject(error);
        }
      );
    });
  }

  function getTeacherRecommendations(classId) {
    return new Promise(function(resolve, reject) {
      // Get All Games
      dataAdapter.getAllGames().then(
        // Get All Games Success
        function(allGames) {
          // Get Games of Class
          dataAdapter.getAllGamesInClass(classId).then(
            // Get Games of Class Success
            function(classGames) {
              // Create Request to send
              var request = createTeachersRequest(
                allGames,
                classGames
              );
              // Make request
              fetch (externalURLs.RECOMMENDATION_SERVER, {
                method : 'POST',
                headers : {
                    'Content-type' : 'application/json'
                },
                body : JSON.stringify (request)
              })
              .then(
                res => res.json()
              )
              .then(
                json => resolve(json)
              );
            },
            // Get Games of Class Error
            function(error) {
              reject(error);
            }
          );
        },
        // Get All Games Error
        function(error) {
          reject(error);
        }
      );
    });
  }

  return {
    getStudentRecommendations,
    getTeacherRecommendations
  };
})(mockGamesDataAdapter);

module.exports = recommendationsAdapter;
