angular.module('instructorApp')
    .controller('InstructorHome1Controller', ['$scope', '$window', '$http', "$routeParams",
    function($scope, $window, $http, $routeParams) {
        console.log("testing_home");
        

        $http.get("/stats/instructors/quests_home/" + $routeParams.sid)
            .then(function(response) {
                console.log("testing_quests");
                //console.log(response.status);
                $scope.sid=$routeParams.sid
                $scope.courses=response.data
                        }
                    
            );

        

    }]);