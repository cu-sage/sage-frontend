angular.module("instructorApp").controller("InstructorDesignController", [
  "$scope",
  "$window",
  "$http",
  "$routeParams",
  "$location",
  function($scope, $window, $http, $routeParams, $location) {
    //$scope.course={};

    $scope.initHide = true;
    $scope.iid = $routeParams.sid;
    $scope.aid = $routeParams.aid;
    console.log("aid is");
    console.log($scope.aid);

    //for instruction
    $scope.steps = $location.search().steps;

    $scope.previousStep = function() {
      var steppers = $mdStepper("preview-step");
      steppers.back();
    };

    $scope.nextStep = function() {
      var steppers = $mdStepper("preview-step");
      steppers.next();
    };

    $scope.preview = function() {
      $scope.initHide = false;
    };

    $scope.closePreviewArea = function() {
      $scope.initHide = true;
    };

    $scope.baseUrl =
      window.location.protocol + "//" + window.location.hostname + ":8081";
    var url =
      "/public/sampleSWF/scratch.swf?sid=" +
      $scope.iid +
      "&assignmentID=" +
      $scope.aid +
      "&mode=DESIGN" +
      "&backend=" +
      $scope.baseUrl +
      "&type=" +
      $location.search().type;

    var object =
      '<object style="position: absolute" width="99%" height="800px">' +
      '<param name="movie" width="100%" height="100%" value="' +
      url +
      '" />' +
      "</object>";

    const scratchElements = document.getElementsByTagName("scratch");
    if (scratchElements.length) {
      scratchElements[0].remove();
    }
    document.getElementById("game").innerHTML = object;

    // $http.get("/stats/instructors/" + $routeParams.sid + "/courses/" + $routeParams.cid)
    //     .then(function(response) {
    //         // $scope.statuscode = response.status;
    //         // $scope.statustext = response.statustext;
    //         $scope.course=response.data[0];

    //         //$scope.assign = response.data[0].assignments;
    //         //console.log($scope.assign);

    //     });
  }
]);
