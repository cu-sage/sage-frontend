angular.module('instructorApp')
    .controller('InstructorQuestCreationController', ['$scope', '$window', '$http', "$routeParams", "$location", function($scope, $window, $http, $routeParams, $location) {

    	//$scope.quest={};



    	$scope.reset=function(){
    		$scope.quest={};
    		//$scope.quest.desc="";
    	};

    	var featureslist=[]

         $scope.orderSt = {};
         $scope.temp = [];

    	// $scope.newc={
    	// 	coursename: $scope.quest.name,
    	// 	body : $scope.quest.desc,
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
    		coursename: $scope.quest.name,
    		desc : $scope.quest.desc,
    		features:[],
    		ctconcepts:[]
    	};

        featurelist=[];
        ctconceptslist=[]

        console.log("in cntrlr");
        console.log($location.path());
    	$http({
		    method: 'POST',
		    url: "/stats/instructors/createquest/"+$routeParams.sid,
		    data: {'questname':$scope.quest.name,'desc' : $scope.quest.desc,'features':featureslist,'ctconcepts':ctconceptslist},
		    }).then(function(response) {
		                console.log(response.status);

		                console.log(response.data.message._id);
                        if (response.status=200){
                            var c1id=response.data.message._id;
                            var i1id=$routeParams.sid;
                            var path = "/questPage/"+i1id+"/quest/"+c1id+"/createGame";
                            console.log(path);
                            $location.path(path);
                            //"#/coursePage/{{sid}}/LP/{{LP.LPID}}"
                            //"#/coursePage/{{sid}}/quest/{{cid}}/createAssignment"
                        }
		                       
                     }
                    
            );
    	 };




        }]);