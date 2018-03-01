angular.module('instructorApp')
    .controller('InstructorCreateClassController', ['$scope', '$window', '$http', "$routeParams", "$location", function($scope, $window, $http, $routeParams, $location) {

        $scope.title = "Fill in the class name";
        $scope.class = {
            name: "",
        };

    	$scope.createClass = function() {

            $http({
                method: 'POST',
                url: "/stats/instructors/createCourse/"+$routeParams.sid,
                data: {'coursename':$scope.course.name,'desc' : $scope.course.desc,'features':featureslist,'ctconcepts':ctconceptslist},
                }).then(function(response) {
                        console.log(response.status);

                        console.log(response.data.message._id);
                        if (response.status=200){
                            var c1id=response.data.message._id;
                            var i1id=$routeParams.sid;
                            var path = "/coursePage/"+i1id+"/course/"+c1id+"/createAssignment";
                            console.log(path);
                            $location.path(path);
                            //"#/coursePage/{{sid}}/LP/{{LP.LPID}}"
                            //"#/coursePage/{{sid}}/course/{{cid}}/createAssignment"
                        }
                            
                    }
                        
                );
        };

}]);