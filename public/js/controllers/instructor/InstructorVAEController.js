angular.module('instructorApp')
    .controller('InstructorVAEController', ['$scope', '$window', '$http', "$routeParams", "$log",
    function($scope, $window, $http, $routeParams, $log) {
        $scope.isHideTable = true;

        $scope.sid = $routeParams.sid;
        $scope.cid = $routeParams.cid;
        $scope.aid = $routeParams.aid;
        $scope.ano = $routeParams.ano;

        var externalUrl = "http://dev.cu-sage.org:8081"; 
        // var externalUrl = "http://localhost:8081"
        // $scope.isActiveHw = function (hw_id) {
        //     return hw_id == $routeParams.hid;
        // };
            //C:\Users\yuval\Documents\School\Fall2017\SAGELab\sage-editor\app\editor
        
            //document.getElementById("vae").innerHTML='<object type="text/html" data="/Users/ruiminzhao/Desktop/sage/code/sage-editor/app/editor"></object>'
        
        // Get Assignment/Game Object
        //$http.get(externalUrl + "/games/" + $scope.aid)
        $http.get("/stats/instructors/" + $scope.sid + "/course/" + $scope.cid + "/Assignment/"+$scope.aid)
            .then(function(response) {
                console.log(response.data);
                $scope.game = response.data['assignmentName'];
                console.log($scope.game);
                if (response.data.objectiveID) {
                    $scope.linkedObjective = response.data.objectiveID;

                    // Load Objective 
                    $scope.loadObjective($scope.linkedObjective);
                    console.log($scope.linkedObjective);
                    $scope.objectiveSelected = $scope.linkedObjective;
                }
                else {
                    $log.info("Game not found");
                    // TODO: User could Create new Objective or Choose from existing Objectives
                }
        });

        // Get All Objectives
        $http.get(externalUrl + "/objectives/all")
            .then(function (response) {
                // names = []
                // for (i = 0; i < response.data.length; i++){
                //     names[i] = response.data[i].objectiveName;
                // }
                // console.log(names);
                $scope.objectives = response.data;
                // $scope.objectives = names;

            });

        // Create New Objectives
        $scope.createObjective = function(existOrNot) {
            //added to show and hide the button for creating new template
            $scope.showChoice = true;
            console.log(existOrNot);
            if (existOrNot == 'yes') {
                $scope.showTemplate = true;
            } else {
                $scope.showTemplate = false;
            }

            $http.get(externalUrl + "/objectives/create")
            //$http.get("/stats/instructors/" + $scope.sid + "/course/" + $scope.cid + "/Assignment/"+$scope.aid+"/objectives/create")
                .then(function (response) {
                    console.log(response);
                    
                    var objectiveID = response.data.objectiveID;
                    // var objectiveName = response.data.objectiveName;
                    $scope.objectives.push(objectiveID);
                    $scope.linkObjective(objectiveID);

                    document.getElementById("vae").innerHTML='<object type="text/html" data="/public/objective-editor/app/editor/index.html?aid=' + objectiveID + '" style="width:100%; height: 100%;"></object>';

                });
        };

        // Load Objective to VAE
        $scope.loadObjective = function(objId) {
            console.log(objId);
            $http.get(externalUrl + "/objectives/" + objId + "/result")
            .then(function (response) {
                if (response.status == '403') {
                    $log.info("Inside GET")
                    $window.location.href = '/public/views/error.html';
                } else {
                    fullResults = response.data;
                    
                    // store XML in sessionStorage to be opened by VAE
                    sessionStorage.loadOnceBlocks = fullResults.objectiveXML;
                    
                    //TO DO: add objective name in this source HTML 
                    document.getElementById("vae").innerHTML='<object type="text/html" data="/public/objective-editor/app/editor/index.html?aid=' + objId + '" style="width:100%; height: 100%;"></object>';
                }
            });
        };
        $scope.showTemplate = false;
        $scope.showChoice = false;
        $scope.chooseExisting = function(existOrNot) {
            $scope.showChoice = true;
            console.log(existOrNot);
            if (existOrNot == 'yes') {
                $scope.showTemplate = true;
            } else {
                $scope.showTemplate = false;
            }
        };
        //default link objective to a game
        var defaultObjId = "5cb74d0aa8a08a1aec196d33";
        $http.get(externalUrl + "/games/link/game/" + $scope.aid + "/objective/" + defaultObjId)
            .then(function (response) {
                console.log("ins HERE!!!");
                if (response.status == '200') {
                    $log.info("Game " + $scope.aid + " Linked with Objective " + defaultObjId);
                    $scope.linkedObjective = defaultObjId;
                    console.log($scope.linkedObjective);
                }
                else
                    $log.info("Game not linked");
            })

        $http.get(externalUrl + "/objectives/" + defaultObjId + "/result")
            .then(function (response) {
                if (response.status == '403') {
                    $log.info("Inside GET")
                    $window.location.href = '/public/views/error.html';
                } else {
                    console.log("loaddddddddddd the data");
                    fullResults = response.data;

                    // store XML in sessionStorage to be opened by VAE
                    sessionStorage.loadOnceBlocks = fullResults.objectiveXML;

                    //TO DO: add objective name in this source HTML
                    document.getElementById("vae").innerHTML='<object type="text/html" data="/public/objective-editor/app/editor/index.html?aid=' + defaultObjId + '" style="width:100%; height: 100%;"></object>';
                }
            });
        // Link Objective to Current Game
        $scope.linkObjective = function(objId) {
            $http.get(externalUrl + "/games/link/game/" + $scope.aid + "/objective/" + objId)
            .then(function (response) {
                console.log("ins HERE!!!");
                if (response.status == '200') {
                    $log.info("Game " + $scope.aid + " Linked with Objective " + objId);
                    $scope.linkedObjective = objId;
                    console.log($scope.linkedObjective);
                }
                else
                    $log.info("Game not linked");
            })
        };
        

        // $http.get("/stats/instructors/" + $routeParams.sid + "/courses/" + $routeParams.cid)
        //     .then(function(response) {
        //         console.log("testing_VAE");
        //         // $scope.statuscode = response.status;
        //         // $scope.statustext = response.statustext;
        //         $scope.course=response.data[0];
        //         console.log($scope.course)
               
        //         //$scope.assign = response.data[0].assignments;
        //         //console.log($scope.assign);
                
                
        //     });

        
    }]);