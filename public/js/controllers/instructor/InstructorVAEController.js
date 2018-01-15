angular.module('instructorApp')
    .controller('InstructorVAEController', ['$scope', '$window', '$http', "$routeParams", "$log",
    function($scope, $window, $http, $routeParams, $log) {
        // console.log("testing");
        // console.log($routeParams.sid);
        $scope.isHideTable = true;

        $scope.sid = $routeParams.sid;
        $scope.cid = $routeParams.cid;
        $scope.aid = $routeParams.aid;
        $scope.ano = $routeParams.ano;

        var externalUrl = "http://dev.cu-sage.org:8081"; 

        // $scope.isActiveHw = function (hw_id) {
        //     return hw_id == $routeParams.hid;
        // };
            //C:\Users\yuval\Documents\School\Fall2017\SAGELab\sage-editor\app\editor
        //document.getElementById("vae").innerHTML='<object type="text/html" data="C:\\Users\\laisj\\Downloads\\SAGE\\sage-editor\\app\\editor\\index.html" style="width:100%; height: 100%;"></object>'
        
        // Get Assignment/Game Object
        $http.get(externalUrl + "/games/" + $scope.aid)
            .then(function(response) {

                if (response.data.objectiveID) {
                    //$log.info(response);
                    $scope.linkedObjective = response.data.objectiveID;

                    // Load Objective 
                    $scope.loadObjective($scope.linkedObjective);
                }
                else {
                    $log.info("Game not found");
                    // TODO: User could Create new Objective or Choose from existing Objectives
                }
        });

        // Get All Objectives
        $http.get(externalUrl + "/objectives/all")
            .then(function (response) {
                $scope.objectives = response.data;
            });

        // Create New Objectives
        $scope.createObjective = function() {
            $http.get(externalUrl + "/objectives/create")
                .then(function (response) {
                    var objectiveID = response.data.objectiveID;
                    $log.info('Created Objective ID : ' + objectiveID);
                    $scope.objectives.push(objectiveID);
                    $scope.linkObjective(objectiveID);

                    document.getElementById("vae").innerHTML='<object type="text/html" data="/public/objective-editor/app/editor/index.html?aid=' + objectiveID + '" style="width:100%; height: 100%;"></object>';
                });
        };

        // Load Objective to VAE
        $scope.loadObjective = function(objId) {
            $http.get(externalUrl + "/objectives/" + objId + "/result")
            .then(function (response) {
                if (response.status == '403') {
                    $log.info("Inside GET")
                    $window.location.href = '/public/views/error.html';
                } else {
                    fullResults = response.data;
                    
                    // store XML in sessionStorage to be opened by VAE
                    sessionStorage.loadOnceBlocks = fullResults.objectiveXML;

                    document.getElementById("vae").innerHTML='<object type="text/html" data="/public/objective-editor/app/editor/index.html?aid=' + objId + '" style="width:100%; height: 100%;"></object>';
                }
            });
        };

        // Link Objective to Current Game
        $scope.linkObjective = function(objId) {
            $http.get(externalUrl + "/games/link/game/" + $scope.aid + "/objective/" + objId)
            .then(function (response) {
                if (response.status == '200') {
                    $log.info("Game " + $scope.aid + " Linked with Objective " + objId);
                    $scope.linkedObjective = objId;
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