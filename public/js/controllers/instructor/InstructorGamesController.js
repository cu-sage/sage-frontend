angular.module('instructorApp')
    .controller('InstructorGamesController', ['$scope', '$window', '$http', "$routeParams", "$location" ,
    function($scope, $window, $http, $routeParams, $location) {


        $http.get("/stats/instructors/"+$routeParams.sid+"/games")
        .then(function(response) {
	        $scope.games=response.data;
	        console.log($scope.games);
	        //console.log($scope.missions[0].LPName);
                        
        });
        



}]);
