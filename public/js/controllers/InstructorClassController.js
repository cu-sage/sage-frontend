angular.module('instructorApp')
    .controller('InstructorClassController', ['$scope', '$window', '$http', "$routeParams", "$mdDialog",
    function($scope, $window, $http, $routeParams, $mdDialog) {
        $scope.currentNavItem = 'page1';
        
        $scope.createClassPrompt = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Create Class')
                .textContent('Create a new class or copy an existing class.')
                .ariaLabel('Create Class')
                .targetEvent(ev)
                .ok('New')
                .cancel('Copy');

            $mdDialog.show(confirm).then(function() {
                $scope.createNewClass();
            }, function() {
                $scope.status = 'You decided to keep your debt.';
            });
          };

          $scope.createNewClass = function(ev) {
            $mdDialog.show({
              //controller: DialogController,
              templateUrl: '/public/views/instructor/instructor_createClass.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:true,
              fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
            .then(function(answer) {
              $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
              $scope.status = 'You cancelled the dialog.';
            });
          };

    }]);
