angular.module('instructorApp')
    .controller('InstructorQuestsController', ['$scope', '$window', '$http', "$routeParams", "$location" ,
    function($scope, $window, $http, $routeParams, $location) {


        $http.get("/stats/instructors/"+$routeParams.sid+"/quests")
        .then(function(response) {
	        $scope.quests=response.data;
	        console.log($scope.quests);
	        //console.log($scope.missions[0].LPName);
                        
        });
        



}]);
