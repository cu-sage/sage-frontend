angular.module('instructorApp')
    .controller('InstructorLPController', ['$scope', '$window', '$http', "$routeParams",
    function($scope, $window, $http, $routeParams) {
        console.log("testing_LP");
        // console.log($routeParams.sid);
        // $scope.isHideTable = true;

        // $scope.isActiveCourse = function (course_id) {
        //     return course_id == $routeParams.cid;
        // };

        // $scope.isActiveHw = function (hw_id) {
        //     return hw_id == $routeParams.hid;
        // };
        if ($routeParams.sid != undefined && $routeParams.LPid != undefined) 
        {
            
             $http.get("/stats/instructors/" + $routeParams.sid + "/LPinfo/" + $routeParams.LPid )
                .then(function(response) {
                    //console.log("testing_eachLP");
                    //$scope.sid=$routeParams.sid
                    $scope.LP=response.data
                            }
                        
                );

            $http.get("/stats/instructors/" + $routeParams.sid + "/LP/" + $routeParams.LPid )
                .then(function(response) {
                    console.log("testing_eachLP");
                    $scope.sid=$routeParams.sid
                    $scope.LPcourses=response.data
                            }
                        
                );

        
        }   
        

    }]);