angular.module('instructorApp')
    .controller('InstructorLPController', ['$scope', '$window', '$http', "$routeParams", "$location" , "$route",
    function($scope, $window, $http, $routeParams, $location, $route) {
        console.log("testing_LP");

        // $scope.comparison=function(a, b){
        //     aOrder = parseInt(a.CourseOrder);
        //     bOrder = parseInt(b.CourseOrder);
        //     if(aOrder < bOrder) return -1;
        //     if(aOrder > bOrder) return 1;
        //     return 0;
        // }

        $scope.instrid=$routeParams.sid;
        $scope.LPid=$routeParams.LPid;
        $scope.orderSt = {};
        $scope.temp = [];
        // console.log($routeParams.sid);
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
                    //console.log("testing_eachLP");
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
                    //console.log(temp);
                    //console.log($scope.LP);
                    var iterator = $scope.temp.entries();
                    for(let e of iterator) {
                        //console.log(e)
                        $scope.orderSt[String(e[1].CourseID)] = String(e[1].CourseOrder);
                    }


                    // for(var i = 0; i < temp.length; i++) {
                    //     console.log(temp[i]);
                    //     $scope.orderSt[String(temp[i].CourseID)] = String(temp[i].CourseOrder);
                    // }
                    // console.log($scope.orderSt)
                }            
            );

            $http.get("/stats/instructors/" + $routeParams.sid + "/LP/" + $routeParams.LPid )
                .then(function(response) {
                    console.log("testing_eachLP");
                    console.log($scope.temp)
                    $scope.sid=$routeParams.sid
                    $scope.LPcourses=response.data
                    //console.log($scope.LPcourses);
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

                    //console.log(tempArray)
                    $scope.LPcourses = tempArray;
                    if(noOfCourses != undefined && noOfCourses > 0) {
                        $scope.order = [];
                        for(i = 0; i < noOfCourses; i++){
                            $scope.order.push(i+1);
                        }
                    }
                    // //$scope.orderSt = $scope.order[1];
                    // $scope.trial = ['0','3','2'];
                    // console.log($scope);



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
                        console.log(response.status);

                        console.log(response.data);
                        //var path = "/coursePage/"+$scope.instrid+"/LP/"+$scope.LPid;
                        //console.log(path);
                        $route.reload();
                        ///coursePage/{{sid}}/LP/{{LP.LPID}}
                                                       
                     }
                    
            );
         }

        
        

    }]);