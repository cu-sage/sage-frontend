angular.module("instructorApp").controller("InstructorClassController", [
  "$scope",
  "$window",
  "$http",
  "$routeParams",
  "$mdDialog",
  function($scope, $window, $http, $routeParams, $mdDialog) {
    $scope.currentNavItem = "Roster";
    $scope.model = {
      selectedClass: "",
      classes: null,
      roster: null,
    };

    $scope.classSelect = function(env) {
      if ($scope.model.selectedClass === "addClass") {
        createClassModal(env);
      } else {
        alert("Class Select not yet implemented");
      }
    };

    getAllClasses();

    function getAllClasses()
    {
      $scope.model.classes = [{id:1, name: 'Math'}, {id:2,name: 'English'}];
      return;

      $http.get("/stats/instructors/classes/" + $routeParams.sid)
        .then(function(response) {
          for (var i = 0; i < response.data.length; i++) {

          }
        });
    }

    function createClassModal(ev) {
      // Appending dialog to document.body to cover sidenav
      var confirm = $mdDialog
        .confirm()
        .title("Create Class")
        .textContent("Create a new class or copy an existing class.")
        .ariaLabel("Create Class")
        .targetEvent(ev)
        .ok("New")
        .cancel("Copy");

      $mdDialog.show(confirm).then(
        function() {
          createNewClass(ev);
        },
        function() {
          copyClass();
        }
      );
    }

    function createNewClass(ev) {
      $mdDialog
        .show({
          controller: InstructorCreateClassController,
          templateUrl: "/public/views/instructor/instructor_createClass.html",
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(
          function() { /*hide called*/ },
          function() { /*cancel called*/ }
        );
    }

    function copyClass() {
      alert("Copy Class has not yet been implemented!");
    }

    function InstructorCreateClassController($scope, $mdDialog) {
      $scope.title = "Fill in the class name";
      $scope.class = {
        name: "",
        description: ""
      };

      $scope.cancel = function() {
        $mdDialog.hide();
      };

      $scope.createClass = function() {
        debugger;
        $http({
          method: "POST",
          url: "/stats/instructors/classes/" + $routeParams.sid,
          data: {
            name: $scope.class.name,
            description: $scope.class.description,
            roster: [],
            missions: []
          }
        }).then(function(response) {
          console.log(response.status);
          $mdDialog.hide();
        });
      };
    }
  }
]);
