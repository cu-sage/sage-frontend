var express = require('express');
var router = express.Router();
var path = require('path');
var mockGamesDataAdapter = require ('../adapters/mockGamesDataAdapter');
var recommendationsAdapter = require ('../adapters/recommendationsAdapter');

/**
 * This is a mock API for demo purpose. Converting into real APIs
 * isn't that hard.
 */

router.get('/student/games/:sid', function(req, res) {

    //getting random two courses.
    let studentID = req.params.sid;

    recommendationsAdapter.getStudentRecommendations(studentID).then(
        function(response) {
            console.log("RECOMMENDATIONS RESPONSE: " + JSON.stringify(response));
            return mockGamesDataAdapter.getGameByIds(response);
        }, 
        function(error) {
            res.status(500).send({
                message: 'An unexpected error occurred.',
            })
        }
    ).then(
        function(recommendations) {
            res.status(200).send(recommendations)
        },
        function(error) {
            res.status(500).send({
                message: 'An unexpected error occurred.',
            })
        }
    );
});

router.get('/instructors/:id/classes/:cid/games', function(req, res) {

    let classId = req.params.cid;

    recommendationsAdapter.getTeacherRecommendations(classId).then(
        function(response) {
            console.log("RECOMMENDATIONS RESPONSE: " + JSON.stringify(response));
            return mockGamesDataAdapter.getGameByIds(response);
        }, 
        function(error) {
            res.status(500).send({
                message: 'An unexpected error occurred.',
            })
        }
    ).then(
        function(recommendations) {
            res.status(200).send(recommendations)
        },
        function(error) {
            res.status(500).send({
                message: 'An unexpected error occurred.',
            })
        }
    );
});

router.get('/getAllData', function(req, res) {

    var resultsObject = {};

    mockGamesDataAdapter.getAllGames().then(
        function(allGames) {
            mockGamesDataAdapter.getAllGamesOfAllStudents().then(
                function(allStudentsGames){
                    mockGamesDataAdapter.getAllGamesInClass().then(
                        function(gamesInClass) {
                            resultsObject.allGames = allGames;
                            resultsObject.gamesInClass = gamesInClass;
                            resultsObject.allStudentsGames = allStudentsGames;
                            res.status(200).send(resultsObject)
                        }
                    )
                });
        }
    );

    recommendationsAdapter.getTeacherRecommendations(classId).then(
        function(response) {
            console.log("RECOMMENDATIONS RESPONSE: " + JSON.stringify(response));
            return mockGamesDataAdapter.getGameByIds(response);
        }, 
        function(error) {
            res.status(500).send({
                message: 'An unexpected error occurred.',
            })
        }
    ).then(
        function(recommendations) {
            res.status(200).send(recommendations)
        },
        function(error) {
            res.status(500).send({
                message: 'An unexpected error occurred.',
            })
        }
    );
});

module.exports = router;
