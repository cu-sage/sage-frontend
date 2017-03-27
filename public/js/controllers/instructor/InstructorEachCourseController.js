angular.module('instructorApp')
    .controller('InstructorEachCourseController', ['$scope', '$window', '$http', "$routeParams",
    function($scope, $window, $http, $routeParams) {
        // console.log("testing");
        // console.log($routeParams.sid);
        $scope.isHideTable = true;

        

        $scope.isActiveHw = function (hw_id) {
            return hw_id == $routeParams.hid;
        };

        $http.get("/stats/instructors/" + $routeParams.sid + "/courses/" + $routeParams.cid)
            .then(function(response) {
                $scope.statuscode = response.status;
                $scope.statustext = response.statustext;
                $scope.course=response.data;
                $scope.hw = response.data.hw;
                $scope.sid = $routeParams.sid;
                $scope.cid = $routeParams.cid;
                
            });

        if ($routeParams.cid != undefined && $routeParams.hid != undefined) {
            $scope.isHideTable = false;
            $http.get("/stats/instructors/" + $routeParams.sid + "/courses/" + $routeParams.cid + "/hw/" + $routeParams.hid)
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