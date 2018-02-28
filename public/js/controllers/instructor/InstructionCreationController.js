angular.module('instructorApp')
    .controller('InstructionCreationController', ['$scope', '$window', '$http', "$routeParams",
    function($scope, $window, $http, $routeParams) {
        console.log("testing_instruction_creation");
        $scope.sid = $routeParams.sid;
        console.log($routeParams.sid);
    }]);