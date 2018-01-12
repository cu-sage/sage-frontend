angular.module('instructorApp')
    .controller('InstructorGameCreationController', ['$scope', '$window', '$http', "$routeParams", "$location" ,
    function($scope, $window, $http, $routeParams, $location) {

    	//$scope.quest={};



    	$scope.reset=function(){
    		$scope.assignment={};
    		//$scope.quest.desc="";
    	};

        $scope.design=function(){
            $scope.assignment={};
            newc={
            order: $scope.assgn.order,
            
        };

        console.log(newc);
        console.log($scope)
        $http({
            method: 'POST',
            url: "/stats/instructors/"+$routeParams.sid+"/quest/"+$routeParams.cid+"/createGame/",
            data: newc,
            }).then(function(response) {
                        //console.log(response.status);
                        //console.log(response.data.message);
                        $scope.aid=(response.data.message.testid);
                        console.log($scope.aid);
                        var i1id=$routeParams.sid;
                        var c1id=$routeParams.cid;
                        var path = "/questPage/"+i1id+"/quest/"+c1id+"/createGame/"+$scope.aid+"/design";
                        console.log(path);
                        $location.path(path);

                                }
                    
            );
                   
            //$scope.quest.desc="";
        };

    	    	
    	$scope.submitForm=function(){
    	
    		newc={
            name: $scope.assgn.name,
    		order: $scope.assgn.order,
    		
    	};

        console.log(newc);

    	$http({
		    method: 'POST',
		    url: "/stats/instructors/"+$routeParams.sid+"/quest/"+$routeParams.cid+"/createGame/",
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