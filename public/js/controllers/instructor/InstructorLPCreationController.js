angular.module('instructorApp')
    .controller('InstructorLPCreationController', ['$scope', '$window', '$http', "$routeParams", "$location", function($scope, $window, $http, $routeParams, $location) {

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

        $http.get("/stats/instructors/"+$routeParams.sid + "/curricula_items")
                .then(function(response) {
                    console.log(response);
                    $scope.dataForTheTree = response.data;
                    }    
                );


        /*$scope.dataForTheTree =
        [
            {"name" : "ABC", "children" : [
            {"name" : "a", "children" : []},
            {"name" : "b", "children" : []}]},
            {"name" : "DEF", "children" : [
            {"name" : "d", "children" : []},
            {"name" : "e", "children" : []}]},
            {"name" : "GHI", "children" : []}


            // { "name" : "Joe", "age" : "21", "children" : [
            // { "name" : "Smith", "age" : "42", "children" : [] },
            // { "name" : "Gary", "age" : "21", "children" : [
            // { "name" : "Jenifer", "age" : "23", "children" : [
            // { "name" : "Dani", "age" : "32", "children" : [] },
            // { "name" : "Max", "age" : "34", "children" : [] }
            // ]}
            // ]}
            // ]},
            // { "name" : "Albert", "age" : "33", "children" : [] },
            // { "name" : "Ron", "age" : "29", "children" : [] }
        ];*/

        $scope.reset=function(){
            $scope.LP={};

            //$scope.quest.desc="";
        };

        //var featureslist=[]

        // $scope.newc={
        //  coursename: $scope.quest.name,
        //  body : $scope.quest.desc,
        //  features:featureslist,
        //  ctconcepts:[]
        // };

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
            data: {'LPname':$scope.LP.name,'desc' : $scope.LP.desc,'features': $scope.LP.feat,'ctconcepts':$scope.concepts},
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
                            //"#/coursePage/{{sid}}/quest/{{cid}}/createAssignment"
                        }
                               
                     }
                    
            );
         };




        }]);