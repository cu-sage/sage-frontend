angular.module('mainApp')
    .controller('StudentTasksController', ['$scope', '$window', '$http', "$routeParams", function($scope, $window, $http, $routeParams) {
        console.log("testing");
        $http.get("/stats/students/123")
            .then(function(response) {
                $scope.statuscode = response.status;
                $scope.statustext = response.statustext;
                $scope.student = response.data;
                $scope.barDataLoaded = false;
                $scope.spiderwebDataLoaded = false;
                //console.log(response.data);
                //console.log($scope);

            });

    }]);