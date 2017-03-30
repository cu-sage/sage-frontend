angular.module('instructorApp')
    .controller('InstructorDesignController', ['$scope', '$window', '$http', "$routeParams", "$location" ,
    function($scope, $window, $http, $routeParams, $location) {
   	//$scope.course={};

    	$scope.iid=$routeParams.sid;
        $scope.aid=$routeParams.aid;

        }]);