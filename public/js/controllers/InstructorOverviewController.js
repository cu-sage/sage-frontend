angular.module('instructorApp')
    .controller('InstructorOverviewController', ['$scope', '$window', '$http', "$routeParams", function($scope, $window, $http, $routeParams) {
        console.log("testing");
        console.log($routeParams.sid);
        $scope.progress = 60;
        $http.get("/stats/instructors/" + $routeParams.sid)
            .then(function(response) {
                $scope.statuscode = response.status;
                $scope.statustext = response.statustext;
                $scope.instructor = response.data;
                $scope.sid = $routeParams.sid;
            });

    }]);