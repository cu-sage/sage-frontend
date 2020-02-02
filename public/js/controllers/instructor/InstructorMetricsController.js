angular.module('instructorApp')
    .controller('InstructorMetricsController', ['$scope', '$window', '$http', "$routeParams", "$location" ,
        function($scope, $window, $http, $routeParams, $location) {



        var path = $location.path().split('/');
        $scope.path = path[1];
        $scope.sid = path[2];

        }]);
