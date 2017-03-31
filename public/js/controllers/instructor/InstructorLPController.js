angular.module('instructorApp')
    .controller('InstructorLPController', ['$scope', '$window', '$http', "$routeParams", "$location" , "$route",
    function($scope, $window, $http, $routeParams, $location, $route) {
        console.log("testing_LP");

        $scope.instrid=$routeParams.sid;
        $scope.LPid=$routeParams.LPid;

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

            $http.get("/stats/instructors/coursesby/" + $routeParams.sid)
            .then(function(response) {
                console.log("testing_coursesby");
                $scope.coursesBy=response.data;
                        }
                    
            );

        
        }   
        
        $scope.addCourse=function(cid1){
            var c=0;
            for (each_existingcourse in $scope.coursesby){
                c+=1;
                if (each_existingcourse.courseID==cid1){
                    console.log("Course already in LP");
                    return ;
                }
            }
            $http({
            method: 'POST',
            url: "/stats/instructors/"+$scope.instrid+"/LP/"+$scope.LPid+"/addCourse/"+cid1,
            data: {'order':c+1,'courseID':cid1 },
            }).then(function(response) {
                        console.log(response.status);

                        console.log(response.data.message.testid);
                        //var path = "/coursePage/"+$scope.instrid+"/LP/"+$scope.LPid;
                        //console.log(path);
                        $route.reload();
                        ///coursePage/{{sid}}/LP/{{LP.LPID}}
                                                       
                     }
                    
            );
         }


        

    }]);