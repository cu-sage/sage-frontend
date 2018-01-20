angular.module('instructorApp')
    .controller('InstructorLibController', ['$scope', '$window', '$http', "$routeParams", "$location" ,
    function($scope, $window, $http, $routeParams, $location) {

    	$scope.sid = $routeParams.sid;
        $scope.cid = $routeParams.cid;

}]);
