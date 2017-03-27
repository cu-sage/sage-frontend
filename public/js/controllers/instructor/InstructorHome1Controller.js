angular.module('instructorApp')
    .controller('InstructorHome1Controller', ['$scope', '$window', '$http', "$routeParams",
    function($scope, $window, $http, $routeParams) {
        console.log("testing_home");
        // console.log($routeParams.sid);
        // $scope.isHideTable = true;

        // $scope.isActiveCourse = function (course_id) {
        //     return course_id == $routeParams.cid;
        // };

        // $scope.isActiveHw = function (hw_id) {
        //     return hw_id == $routeParams.hid;
        // };

        $http.get("/stats/instructors/courses_home/" + $routeParams.sid)
            .then(function(response) {
                console.log("testing_courses");
                $scope.sid=$routeParams.sid
                $scope.courses=response.data
                        }
                    
            );

        

    }]);