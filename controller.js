var controller = angular.module('controllers', []);

controller.controller('DashboardController', function($scope, $routeParams, $timeout, service){
    pollData();
    
    function pollData() {
        service.list(
            $routeParams.sid,
            $routeParams.aid,
            function(results) {
                $scope.results = results;
                $timeout(pollData, 1000)
            }
        );
    }
});