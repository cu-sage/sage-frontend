angular.module('studentApp')

.directive('scratch', function() {
    return {
        restrict: 'E',
        scope: {
          movie: '@'
        },
        link: function(scope, element) {
            var object = '<object style="position: absolute; left:-40px" width="99%" height="100%">' +
              '<param name="movie" width="100%" height="100%" value="' + scope.movie + '" />' +
            '</object>';
            element.replaceWith(object);
        }
    };
})
    .controller('StudentAssessmentController', function(Upload, $window, $location, $scope, $timeout, $http, $log, $routeParams) {
        $scope.gameID = $routeParams.aid;
        $scope.studentID = $routeParams.sid;

        $scope.dataLoaded = false;

        var results = null

        timex = 0;

        /*        var countUp = function() {
         timex+= 500;
         $log.info(timex)
         $timeout(countUp, 1000);
         }

         $timeout(countUp, 1000);*/
        
        var externalUrl = "http://dev.cu-sage.org:8081";
         $log.info($scope.gameID);
        // Get Objective from Game
        $http.get(externalUrl + "/games/" + $scope.gameID)
            .then(function(response) {
                if (response.data.objectiveID) {
                    $log.info(response);
                    $scope.objectiveID = response.data.objectiveID;
                }
                else {
                    $log.info("Objective not found");
                }

                $scope.movie = { 
                    name: 'movie',
                    url: 'http://dev.cu-sage.org/public/sampleSWF/scratch.swf?sid=' + $scope.studentID + '&assignmentID=' + $scope.gameID + '&objectiveID=' + $scope.objectiveID + '&mode=PLAY'
                  };
                $scope.dataLoaded = true;
                $timeout(polldata,1000);
        });


        var polldata = function() {
            // poll a GET request to node, send every second
            $log.info("Printing assessment " + $scope)

            $http({method: 'GET', url: externalUrl + '/assess/game/' + $scope.gameID + '/objective/' + $scope.objectiveID})
                .then(function (response) {
                    if (response.status == '403') {
                        $log.info("Inside GET")
                        $window.location.href = '/public/views/error.html';
                    } else {

                        fullResults = response.data;

                        results = fullResults.assess.assessmentResult

                        if(Object.keys(results).length!=0) {
                            //$log.info(results)
                            for (x in results) {
                                if (results[x].actions!=null){
                                    $log.info($scope.speech=results[x].actions.command)
                                }
                            }

                            $scope.results = results;
                            $scope.progress = "33";
                            $scope.level = "Basic";
                            $log.info($scope.results)
                        }
                    }
                });
            $timeout(polldata,2000);
        };

        // Timer Functions
        $scope.timer = 600;
        $scope.timer_display = secondsToHms($scope.timer);
        $scope.timer_running = false;

        var timeoutFn;

        $scope.startTimer = function() {
            $scope.timer_running = true;
            timeoutFn = $timeout(function () {
                $scope.timer--;
                $scope.timer_display = secondsToHms($scope.timer);
                $scope.timer > 0 ? $scope.startTimer() : $scope.endTimer();
            }, 1000);
        };

        $scope.stopTimer = function() {
            $scope.timer_running = false;
            $timeout.cancel(timeoutFn);
        };

        $scope.endTimer = function() {
            // End of Timer
            $scope.stopTimer();
        }

        // Auto Start
        // $scope.startTimer();

        function secondsToHms(d) {
            d = Number(d);
            var h = Math.floor(d / 3600);
            var m = Math.floor(d % 3600 / 60);
            var s = Math.floor(d % 3600 % 60);

            var hStr = h > 0 ? h + ":" : "";
            var mStr = (m > 9 ? m : "0" + m) + ":";
            var sStr = s > 9 ? s : "0" + s;
            return hStr + mStr + sStr;
        };

        // Orbs columns
        $scope.orb_col = 4; // 1,2,3,4, or 6
    });
