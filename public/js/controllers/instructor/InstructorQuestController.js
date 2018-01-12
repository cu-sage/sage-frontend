angular.module('instructorApp')
    .controller('InstructorQuestController', ['$scope', '$window', '$http', "$routeParams",
    function($scope, $window, $http, $routeParams) {
        console.log("testing_quest");
        // console.log($routeParams.sid);
        // $scope.isHideTable = true;

        // $scope.isActiveQuest = function (course_id) {
        //     return course_id == $routeParams.cid;
        // };

        // $scope.isActiveHw = function (hw_id) {
        //     return hw_id == $routeParams.hid;
        // };

        $http.get("/stats/instructors/LP/" + $routeParams.sid)
            .then(function(response) {
                console.log("testing_LP");
                $scope.sid=$routeParams.sid
                        
                $scope.LPs=response.data;
                console.log(response.data);
                        }
                    
            );

        $http.get("/stats/instructors/questsby/" + $routeParams.sid)
            .then(function(response) {
                console.log("testing_questsby");
                $scope.coursesBy=response.data;
                        }
                    
            );

        

    }]);