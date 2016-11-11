angular.module('mainApp')
    .controller('StudentTasksController', ['$scope', '$window', '$http', "$routeParams", function($scope, $window, $http, $routeParams) {
        console.log("testing");
        console.log($routeParams.sid);
        $http.get("/stats/students/" + $routeParams.sid)
            .then(function(response) {
                $scope.statuscode = response.status;
                $scope.statustext = response.statustext;
                $scope.student = response.data;
                $scope.sid = $routeParams.sid;

            });

    }]);