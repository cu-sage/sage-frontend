angular.module('instructorApp')
    .controller('InstructorOverviewController', ['$scope', '$window', '$http', "$routeParams",
    function($scope, $window, $http, $routeParams) {
        // console.log("testing");
        // console.log($routeParams.sid);
        $scope.isHideTable = true;

        $scope.isActiveQuest = function (quest_id) {
            return quest_id == $routeParams.cid;
        };

        $scope.isActiveHw = function (hw_id) {
            return hw_id == $routeParams.hid;
        };

        $http.get("/stats/instructors/" + $routeParams.sid)
            .then(function(response) {
                $scope.statuscode = response.status;
                $scope.statustext = response.statustext;
                $scope.instructor = response.data.courses;
                $scope.sid = $routeParams.sid;
                if ($routeParams.cid != undefined && $scope.instructor != undefined) {
                    $scope.cid = $routeParams.cid;
                    // console.log("quest");
                    var courses = $scope.instructor;
                    for (var i = 0; i < courses.length; i++) {
                        // console.log(courses[i]);
                        if (courses[i].id == $routeParams.cid) {
                            $scope.hw = courses[i].hw;
                            // console.log($scope.hw);
                        }
                    }
                }
            });

        if ($routeParams.cid != undefined && $routeParams.hid != undefined) {
            $scope.isHideTable = false;
            $http.get("/stats/instructors/" + $routeParams.sid + "/quests/" + $routeParams.cid + "/hw/" + $routeParams.hid)
                .then(function (response) {
                    $scope.statuscode = response.status;
                    $scope.statustext = response.statustext;
                    $scope.sid = $routeParams.sid;
                    $scope.cid = $routeParams.cid;
                    $scope.hid = $routeParams.hid;
                    $scope.data = response.data.data;
                    $scope.average = response.data.average;
                    // console.log($scope.data);
                });
        }

    }]);