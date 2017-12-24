angular.module('instructorApp')
    .controller('InstructorEachCourseController', ['$scope', '$window', '$http', "$routeParams", "$location" , "$route",
    function($scope, $window, $http, $routeParams, $location, $route) {
        // console.log("testing");
        // console.log($routeParams.sid);
        $scope.isHideTable = true;
        $scope.orderSt = {};
        $scope.info = []
        $scope.assessments = [1,2,3,4,5];


        /*console.log($scope);
        $scope.temp = $scope.LP.courses.sort(function(a, b){
            aOrder = parseInt(a.CourseOrder);
            bOrder = parseInt(b.CourseOrder);
            if(aOrder < bOrder) return -1;
            if(aOrder > bOrder) return 1;
            return 0;
        });
        var iterator = $scope.temp.entries();
        for(let e of iterator) {
                        //console.log(e)
           $scope.orderSt[String(e[1].CourseID)] = String(e[1].CourseOrder);
        }*/

        $scope.updateOrder=function(){
            var assignments = [];
            for(each_assignment in $scope.orderSt){
                assignments.push({
                    "assigmentID" : each_assignment,
                    "assignmentOrder" : parseInt($scope.orderSt[each_assignment])
                });
            }
            console.log(assignments)
            $route.reload();

            $http({
            method: 'POST',
            url: "/stats/instructors/course/"+$scope.course.courseID+"/updateAssignmentOrder",
            data: {"assignments" : assignments},
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


        $scope.updateCourse = function() {
            console.log("in update course function " + $routeParams.cid, $scope.info)
            $http({
            method: 'POST',
            url: "/stats/instructors/updateCourse/"+$routeParams.cid,
            data: {'coursename':$scope.info[0],'desc' : $scope.info[1]},
            }).then(function(response) {
                        console.log(response.status);

                        console.log(response.data);
                        //var path = "/coursePage/"+$scope.instrid+"/LP/"+$scope.LPid;
                        //console.log(path);
                        $route.reload();
                        ///coursePage/{{sid}}/LP/{{LP.LPID}}

                     }

            );
        };

        $scope.removeAssignment = function(assign, assignment_id){
            console.log("here "+assignment_id);
            var index = -1;
            for(var i in assign){
                if(assign[i].assigmentID == assignment_id){
                    index = i;
                    break;
                }
            }
            assign.splice(index, 1);
            $http({
            method: 'POST',
            url: "/stats/instructors/Course/"+$routeParams.cid+"/assignment/"+assignment_id,
            data: {"assignments" : assign},
            }).then(function(response) {
                        console.log(response.status);

                        console.log(response.data);
                        //var path = "/coursePage/"+$scope.instrid+"/LP/"+$scope.LPid;
                        //console.log(path);
                        $route.reload();
                        ///coursePage/{{sid}}/LP/{{LP.LPID}}

                     }

            );
        };

        $scope.isActiveHw = function (hw_id) {
            return hw_id == $routeParams.hid;
        };

        $http.get("/stats/instructors/" + $routeParams.sid + "/courses/" + $routeParams.cid)
            .then(function(response) {
                $scope.statuscode = response.status;
                $scope.statustext = response.statustext;
                $scope.course=response.data[0];
                console.log($scope.course)

                $scope.assign = response.data[0].assignments;

                    //var temp = $scope.LP.courses;
                $scope.temp = $scope.assign.sort(function(a, b){
                        aOrder = parseInt(a.assignmentOrder);
                        bOrder = parseInt(b.assignmentOrder);
                        if(aOrder < bOrder) return -1;
                        if(aOrder > bOrder) return 1;
                        return 0;
                });

                 var iterator = $scope.temp.entries();
                    for(let e of iterator) {
                                //console.log(e)
                    $scope.orderSt[String(e[1].assigmentID)] = String(e[1].assignmentOrder);
                }

                //console.log($scope.assign);
                $scope.sid = $routeParams.sid;
                $scope.cid = $routeParams.cid;

            });

        // get game objective of games
       /* $http.get("/stats/instructors/" + $routeParams.sid + "/courses/" + $routeParams.cid)
            .then(function(response) {
                $scope.statuscode = response.status;
                $scope.statustext = response.statustext;
                $scope.course=response.data[0];

                $scope.assign = response.data[0].assignments;
                //console.log($scope.assign);
                $scope.sid = $routeParams.sid;
                $scope.cid = $routeParams.cid;

            });
*/

    }]);
