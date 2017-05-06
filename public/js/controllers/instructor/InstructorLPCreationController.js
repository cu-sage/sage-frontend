angular.module('instructorApp')
    .controller('InstructorLPCreationController', ['$scope', '$window', '$http', "$routeParams", "$location", function($scope, $window, $http, $routeParams, $location) {

    	//$scope.course={};

    	$scope.reset=function(){
    		$scope.LP={};
    		//$scope.course.desc="";
    	};

    	//var featureslist=[]

    	// $scope.newc={
    	// 	coursename: $scope.course.name,
    	// 	body : $scope.course.desc,
    	// 	features:featureslist,
    	// 	ctconcepts:[]
    	// };

    	
    	$scope.submitForm=function(){
    	
    		newc={
    		coursename: $scope.LP.name,
    		desc : $scope.LP.desc,
    		features:[],
    		ctconcepts:[]
    	};

        var featurelist=[];
        var ctconceptslist=[];

        console.log("in cntrlr");
        console.log($location.path());

    	$http({
		    method: 'POST',
		    url: "/stats/instructors/createLP/"+$routeParams.sid,
		    data: {'LPname':$scope.LP.name,'desc' : $scope.LP.desc,'features':[],'ctconcepts':[]},
		    }).then(function(response) {
		                console.log(response.status);

		                console.log(response.data.message._id);
                        if (response.status=200){
                            var c1id=response.data.message._id;
                            var i1id=$routeParams.sid;
                            var path = "/coursePage/"+i1id+"/LP/"+c1id;
                            console.log(path);
                            $location.path(path);
                            //"#/coursePage/{{sid}}/LP/{{LP.LPID}}"
                            //"#/coursePage/{{sid}}/course/{{cid}}/createAssignment"
                        }
		                       
                     }
                    
            );
    	 };




        }]);