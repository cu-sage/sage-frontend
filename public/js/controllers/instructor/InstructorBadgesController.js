angular.module('instructorApp')
    .controller('InstructorBadgesController', ['$scope', '$window', '$http', "$routeParams", "$location" ,
        function($scope, $window, $http, $routeParams, $location) {


            $http.get("/stats/instructors/"+$routeParams.sid+"/badges")
                .then(function(response) {
                    $scope.badges=response.data;
                    //console.log(response);
                    //console.log($scope.missions[0].LPName);

                });

        }]);
