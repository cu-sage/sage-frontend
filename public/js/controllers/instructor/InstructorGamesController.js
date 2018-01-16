angular.module('instructorApp')
    .directive('scratch', function() {
        return {
            restrict: 'E',
            scope: {
            movie: '@'
            },
            link: function(scope, element) {
                var object = '<object style="position: absolute" width="99%" height="100%">' +
                '<param name="movie" width="100%" height="100%" value="' + scope.movie + '" />' +
                '</object>';
                element.replaceWith(object);
            }
        };
    })
    .controller('InstructorGamesController', ['$scope', '$window', '$http', "$routeParams", "$location" ,
    function($scope, $window, $http, $routeParams, $location) {

        $scope.iid = $routeParams.sid;
        $scope.aid = $routeParams.aid;

        $scope.movie = { 
            name: 'movie',
            url: 'http://dev.cu-sage.org/public/sampleSWF/scratch.swf?sid=' + $scope.iid + '&assignmentID=' + $scope.aid + '&mode=DESIGN'
          };

        $http.get("/stats/instructors/"+$routeParams.sid+"/games")
        .then(function(response) {
	        $scope.games=response.data;
	        console.log($scope.games);
	        //console.log($scope.missions[0].LPName);
                        
        });
        



}]);
