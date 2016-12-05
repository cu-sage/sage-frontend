var service = angular.module('serviceFactory', []);

service.factory('dataFactory', function($scope, $http) {
    $http.get("welcome.htm").then(function(response) {
        $scope.myWelcome = response.data;
    });
});
