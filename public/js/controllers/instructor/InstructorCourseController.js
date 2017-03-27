angular.module('instructorApp')
    .controller('InstructorCourseController', ['$scope', '$window', '$http', "$routeParams",
    function($scope, $window, $http, $routeParams) {
        console.log("testing_course");
        // console.log($routeParams.sid);
        // $scope.isHideTable = true;

        // $scope.isActiveCourse = function (course_id) {
        //     return course_id == $routeParams.cid;
        // };

        // $scope.isActiveHw = function (hw_id) {
        //     return hw_id == $routeParams.hid;
        // };

        $http.get("/stats/instructors/LP/" + $routeParams.sid)
            .then(function(response) {
                console.log("testing_LP");
                $scope.sid=$routeParams.sid
                        
                $scope.LPs=response.data
                        }
                    
            );

        $http.get("/stats/instructors/coursesby/" + $routeParams.sid)
            .then(function(response) {
                console.log("testing_LP");
                $scope.coursesBy=response.data
                        }
                    
            );

        

    }]);