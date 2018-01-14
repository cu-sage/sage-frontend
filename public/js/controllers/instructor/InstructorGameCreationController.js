angular.module('instructorApp')
    .controller('InstructorGameCreationController', ['$scope', '$window', '$http', "$routeParams", "$location" ,
    function($scope, $window, $http, $routeParams, $location) {
    	//$scope.course={};

    	$scope.reset=function(){
    		$scope.assignment={};
    		//$scope.course.desc="";
    	};

        $scope.designGame=function(){
            $scope.assignment={};
            newc={
            order: $scope.assgn.order,
        };
        console.log(newc);

        $http({
            method: 'POST',
            url: "/stats/instructors/"+$routeParams.sid+"/course/"+$routeParams.cid+"/createAssignment/",
            data: newc,
            }).then(function(response) {
                        //console.log(response.status);
                        //console.log(response.data.message);
                        $scope.aid=(response.data.message.testid);
                        console.log($scope.aid);
                        var i1id=$routeParams.sid;
                        var c1id=$routeParams.cid;
                        var path = "/coursePage/"+i1id+"/course/"+c1id+"/createAssignment/"+$scope.aid+"/design";
                        console.log(path);
                        $location.path(path);
                                }
            );
            //$scope.course.desc="";
        };

    	$scope.submitForm=function(){
    	
    		newc={
            name: $scope.assgn.name,
    		order: $scope.assgn.order,
    		
    	};

        console.log(newc);

    	$http({
		    method: 'POST',
		    url: "/stats/instructors/"+$routeParams.sid+"/course/"+$routeParams.cid+"/createAssignment/",
		    data: newc,
		    }).then(function(response) {
                        //console.log(response.status);
		                //console.log(response.data.message);
		                $scope.aid=(response.data.message.testid);
                        console.log($scope.aid);
		                        }
            );
    	 };
        }]);