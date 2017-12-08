angular.module('studentApp')
    .controller('StudentAssessmentController', function(Upload, $window, $location, $scope, $http, $log) {
        var path = $location.path().split('/');
        $scope.path = path[1];
        $scope.sid = path[path.length-1];
        $scope.assignmentID = path[path.indexOf('assessment')+1];

        var results = null
        // poll a GET request to node, send every second

        $log.info("Printing assessment " +$scope)

        $http({method: 'GET', url: 'http://localhost:8081/assess/game/123/objective/58d845736e4ddb3ce20ed1b3' })
            .then(function(response) {
                if (response.status == '403') {
                    $log.info("Inside GET")
                    $window.location.href = '/public/views/error.html';
                } else {

                    fullResults = response.data;
                    results = fullResults.assess.assessmentResult
                    //$log.info(results)


                    $scope.results = results;
                    $scope.progress = "33";
                    $scope.level = "Basic";
                    $log.info($scope.results)
                }
            });


    });
