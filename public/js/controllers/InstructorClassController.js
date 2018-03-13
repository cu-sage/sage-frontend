angular.module("instructorApp").controller("InstructorClassController", [
  "$scope",
  "$window",
  "$http",
  "$routeParams",
  "$mdDialog",
  function($scope, $window, $http, $routeParams, $mdDialog) {
    $scope.model = {
      selectedClassId: "",
      classes: null,
      selectedClass: null,
    };

    $scope.classSelect = function(env) {
      if ($scope.model.selectedClassId === "addClass") {
        createClassModal(env);
      } else {
        selectClass($scope.model.selectedClassId);
      }
    };

    getAllClasses();

    function getAllClasses()
    {
      $http.get("/stats/instructors/" + $routeParams.sid + '/classes')
        .then(function(response) {
          var classes = [];
          for (var i = 0; i < response.data.length; i++) {
            classes[i] = {
              id: response.data[i][0].classId,
              name: response.data[i][0].className,
            };
          }

          if (classes.length > 0) {
            $scope.model.selectedClassId = classes[0].id;
          }

          $scope.model.classes = classes;
        });
    }

    function selectClass(id)
    {
      $http.get("/stats/instructors/" + $routeParams.sid + '/classes/' + id)
        .then(function(response) {
          $scope.model.selectedClass = {
            id: response.data._id,
            instructorId: response.data.instructorId,
            name: response.data.name,
            description: response.data.description,
            roster: response.data.roster,
            missions: response.data.missions,
          };
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
