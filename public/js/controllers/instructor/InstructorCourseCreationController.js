angular.module('instructorApp')
    .controller('InstructorCourseCreationController', ['$scope', '$window', '$http', "$routeParams", "$location", function($scope, $window, $http, $routeParams, $location) {

    	//$scope.course={};



    	$scope.reset=function(){
    		$scope.course={};
    		//$scope.course.desc="";
    	};

    	var featureslist=[]

         $scope.orderSt = {};
         $scope.temp = [];

    	// $scope.newc={
    	// 	coursename: $scope.course.name,
    	// 	body : $scope.course.desc,
    	// 	features:featureslist,
    	// 	ctconcepts:[]
    	// };
         $scope.concepts=[];
        // $scope.concepts = {
        //         "concepts" : [
        //             {
        //                 "name" : "A",
        //                 "topics" : ["a","b"]
        //             },
        //             {
        //                 "name" : "B",
        //                 "topics" : ["c","d"]
        //             }
        //         ]
        //     }
        $scope.treeOptions = {
            nodeChildren: "children",
            dirSelectable: true,
            injectClasses: {
                ul: "a1",
                li: "a2",
                liSelected: "a7",
                iExpanded: "a3",
                iCollapsed: "a4",
                iLeaf: "a5",
                label: "a6",
                labelSelected: "a8"
            }
        };

        $scope.showSelected = function(sel, flag, nodes) {
             $scope.selectedNode = sel;
             console.log(nodes);
             if(flag) {
                 $scope.concepts.push(sel);
             } else {
                 index = $scope.concepts.indexOf(sel);
                 if(index > -1) {
                     $scope.concepts.splice(index, 1)
                 }
             }
             console.log($scope.concepts);
         };

        $http.get("/stats/instructors/"+$routeParams.sid + "/curricula_items")
                 .then(function(response) {
                     console.log(response);
                     $scope.dataForTheTree = response.data;
                     }    
                 );
    	
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