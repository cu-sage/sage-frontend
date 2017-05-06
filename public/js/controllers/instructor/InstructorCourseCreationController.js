angular.module('instructorApp')
    .controller('InstructorCourseCreationController', ['$scope', '$window', '$http', "$routeParams", "$location", function($scope, $window, $http, $routeParams, $location) {

    	//$scope.course={};



    	$scope.reset=function(){
    		$scope.course={};
    		//$scope.course.desc="";
    	};

    	var featureslist=[]

    	// $scope.newc={
    	// 	coursename: $scope.course.name,
    	// 	body : $scope.course.desc,
    	// 	features:featureslist,
    	// 	ctconcepts:[]
    	// };

    	
    	$scope.submitForm=function(){
    	
    		newc={
    		coursename: $scope.course.name,
    		desc : $scope.course.desc,
    		features:[],
    		ctconcepts:[]
    	};

        featurelist=[];
        ctconceptslist=[]

        console.log("in cntrlr");
        console.log($location.path());

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