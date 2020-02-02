angular.module('instructorApp')
    .controller('InstructorLPCreationController', ['$scope', '$window', '$http', "$routeParams", "$location", function($scope, $window, $http, $routeParams, $location) {
        $scope.error = false; 
     
        $scope.concepts=[];
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
                    // console.log(response);
                    console.log($routeParams.sid);
                    console.log("=======");
                    $scope.dataForTheTree = response.data;
                    // $scope.dataForTheTree = [
                    //     { "name" : "Joe", "age" : "21", "children" : [
                    //             { "name" : "Smith", "age" : "42", "children" : [] },
                    //             { "name" : "Gary", "age" : "21", "children" : [
                    //                     { "name" : "Jenifer", "age" : "23", "children" : [
                    //                             { "name" : "Dani", "age" : "32", "children" : [] },
                    //                             { "name" : "Max", "age" : "34", "children" : [] }
                    //                         ]}
                    //                 ]}
                    //         ]},
                    //     { "name" : "Albert", "age" : "33", "children" : [] },
                    //     { "name" : "Ron", "age" : "29", "children" : [] }
                    // ];
                    console.log(typeof($scope.dataForTheTree));
                    console.log($scope.dataForTheTree);

                    }    
                );

        $scope.reset=function(){
            $scope.LP={};
            $scope.error = false; 
        };

        $scope.showSelected = function(sel, flag, nodes) {
            $scope.selectedNode = sel;
            console.log(nodes);
            console.log("this is for testing");
            if(flag) {
                $scope.concepts.push(sel);
            } else {
                index = $scope.concepts.indexOf(sel);
                if(index > -1) {
                    $scope.concepts.splice(index, 1)
                }
            }
            // console.log($scope.concepts);
        };

        
        $scope.submitForm = function (isValid) {
            // if (isValid) {
                console.log (this.error);
                newc = {
                    coursename: $scope.LP.name,
                    desc: $scope.LP.desc,
                    features: [],
                    ctconcepts: []
                };
    
                var featurelist = [];
                var ctconceptslist = [];
    
                // console.log("in cntrlr");
                // console.log($location.path());
    
                $http({
                    method: 'POST',
                    url: "/stats/instructors/createLP/" + $routeParams.sid,
                    data: { 'LPname': $scope.LP.name, 'desc': $scope.LP.desc, 'features': $scope.LP.feat, 'ctconcepts': $scope.concepts },
                }).then(function successCallback(response) {
                    console.log(response.status);
                    console.log(response.data.message._id);
                    if (response.status = 200) {
                        var c1id = response.data.message._id;
                        var i1id = $routeParams.sid;
                        var path = "/coursePage/" + i1id + "/LP/" + c1id;
                        console.log(path);
                        $location.path(path);
                    }
                }, function errorCallback(response) {
                    $scope.error = true;
                    console.log($scope.error);

                    // this.isValid = false;

                    // console.log($scope.test);
                }
    
                );
            // } else {
            //     // alert('our form is amazing')
            // }
            // this.error = false;
            
        };
        //this to add feedback in the mission level page////////////////////////////
        $scope.userFeedback = [];
        $scope.enterAssFeedback = function(keyEvent) {
            if (keyEvent.which === 13) {
                try {
                    console.log($scope.users.feedback);
                    console.log($scope.users);
                } catch (error) {
                    $scope.users = {};
                    $scope.users.feedback = "Warning: input null";
                }
                let user = angular.copy($scope.users);
                $scope.userFeedback.push(user);
            }
        };
        $scope.addFeedback = function() {
            try {
                console.log($scope.users.feedback);
                console.log($scope.users);
            } catch (error) {
                $scope.users = {};
                $scope.users.feedback = "Warning: input null";
            }
            let user = angular.copy($scope.users);
            $scope.userFeedback.push(user);

        };
        $scope.deleteFeedback = function() {
            $scope.users = null;
            console.log("user size" + $scope.userFeedback.length);
            $scope.userFeedback.pop();
            console.log("usersizeNew" + $scope.userFeedback.length);
            console.log($scope.userFeedback);
        };
        $scope.removeFeedback = function(i) {
            $scope.userFeedback.splice(i,1);
        };
        ////////////////////////////////////////////////////////////////////////////
        }]);