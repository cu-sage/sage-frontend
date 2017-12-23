angular.module('instructorApp')
    .controller('InstructorMissionsController', ['$scope', '$window', '$http', "$routeParams", "$location" ,
    function($scope, $window, $http, $routeParams, $location) {


        $http.get("/stats/instructors/"+$routeParams.sid+"/missions")
        .then(function(response) {
	        $scope.missions=response.data;
	        //console.log(response);
	        //console.log($scope.missions[0].LPName);
                        
        });
        



}]);
