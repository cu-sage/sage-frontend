angular.module('researcherApp')
    .controller('ResearcherOverviewController', ['$scope', '$window', '$http', "$routeParams",
    function($scope, $window, $http, $routeParams) {
        $scope.rid = $routeParams.rid;
    }]);
