angular.module('instructorApp')
    .controller('InstructorLPController', ['$scope', '$window', '$http', "$routeParams", "$location" , "$route",
    function($scope, $window, $http, $routeParams, $location, $route) {
        console.log("testing_LP");


        $scope.instrid=$routeParams.sid;
        $scope.LPid=$routeParams.LPid;
        $scope.orderSt = {};
        $scope.temp = [];
        // $scope.isHideTable = true;

        // $scope.isActiveCourse = function (course_id) {
        //     return course_id == $routeParams.cid;
        // };

        // $scope.isActiveHw = function (hw_id) "590107b70be67621e81d90e3"        //     return hw_id == $routeParams.hid;
        // };
        if ($routeParams.sid != undefined && $routeParams.LPid != undefined) 
        {
            
            $http.get("/stats/instructors/" + $routeParams.sid + "/LPinfo/" + $routeParams.LPid )
                .then(function(response) {
                    //$scope.sid=$routeParams.sid
                    $scope.LP=response.data[0];
                    //var temp = $scope.LP.courses;
                    $scope.temp = $scope.LP.courses.sort(function(a, b){
                        aOrder = parseInt(a.CourseOrder);
                        bOrder = parseInt(b.CourseOrder);
                        if(aOrder < bOrder) return -1;
                        if(aOrder > bOrder) return 1;
                        return 0;
                    });
                    //$scope.LP.courses = temp;
                    var iterator = $scope.temp.entries();
                    for(let e of iterator) {
                        $scope.orderSt[String(e[1].CourseID)] = String(e[1].CourseOrder);
                    }
                    // for(var i = 0; i < temp.length; i++) {
                    //     console.log(temp[i]);
                    //     $scope.orderSt[String(temp[i].CourseID)] = String(temp[i].CourseOrder);
                    // }
                }            
            );

            $http.get("/stats/instructors/" + $routeParams.sid + "/LP/" + $routeParams.LPid )
                .then(function(response) {
                    $scope.sid=$routeParams.sid
                    $scope.LPcourses=response.data
                    var noOfCourses = $scope.LPcourses.length;
                    // for(var i=0; i < noOfCourses; i++){
                    //     $scope.LPcourses[i].order = 2;
                    //     //val = $scope.;
                    //     $scope["order_" + $scope.LPcourses[i].courseID] = 2;
                    // }
                    
                    //sort courses
                    var tempArray = [];
                    var iter = $scope.temp.entries()
                    for(let e of iter) {
                        var currId = e[1].CourseID;
                        var iter2 = $scope.LPcourses.entries()
                        for(let e1 of iter2) {
                            //console.log(e1[1]._id == currId)
                            if(e1[1]._id == currId) {
                                tempArray.push(e1[1]);
                                break;
                            }
                        }
                    }
                    $scope.LPcourses = tempArray;
                    if(noOfCourses != undefined && noOfCourses > 0) {
                        $scope.order = [];
                        for(i = 0; i < noOfCourses; i++){
                            $scope.order.push(i+1);
                        }
                    }

                    // array of quest names to check which quests are in current mission 
                    $scope.questNames = []
                    for(i = 0; i < $scope.LPcourses.length; i++){
                        $scope.questNames.push($scope.LPcourses[i].courseName);
                    }
                    // //$scope.orderSt = $scope.order[1];
                    // $scope.trial = ['0','3','2'];
                }
                );

            $http.get("/stats/instructors/coursesby/" + $routeParams.sid)
            .then(function(response) {
                $scope.coursesBy=response.data;
                }
            );
        }   
        
        $scope.addCourse=function(cid1){
            var c=0;
            for (each_existingcourse in $scope.coursesby){
                c+=1;
                if (each_existingcourse.courseID==cid1){
                    return ;
                }
            }
            $http({
            method: 'POST',
            url: "/stats/instructors/"+$scope.instrid+"/LP/"+$scope.LPid+"/addCourse/"+cid1,
            data: {'order':c+1,'courseID':cid1 },
            }).then(function(response) {
                        $route.reload();
                        ///coursePage/{{sid}}/LP/{{LP.LPID}}
                                                       
                     }
                    
            );
         }

        $scope.updateOrder=function(){
            var courses = [];
            for(each_course in $scope.orderSt){
                courses.push({
                    "CourseID" : each_course,
                    "CourseOrder" : parseInt($scope.orderSt[each_course])
                });
            }
            console.log(courses)
            $route.reload();

            $http({
            method: 'POST',
            url: "/stats/instructors/"+$scope.instrid+"/LP/"+$scope.LPid+"/updateCourseOrder",
            data: {"courses" : courses},
            }).then(function(response) {
                        //var path = "/coursePage/"+$scope.instrid+"/LP/"+$scope.LPid;
                        $route.reload();
                        ///coursePage/{{sid}}/LP/{{LP.LPID}}
                     }

            );
         }
    }]);