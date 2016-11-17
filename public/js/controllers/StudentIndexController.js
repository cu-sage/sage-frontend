angular.module('studentApp')
    .controller('StudentIndexController', ['$scope', '$http', "$location", function($scope, $http, $location) {
        console.log("testing");
        var path = $location.path().split('/');
        $scope.path = path[1];
        $scope.sid = path[2];

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path().split('/')[1];
        };

        $http.get("/stats/students/" + $scope.sid)
            .then(function(response) {
                $scope.statuscode = response.status;
                $scope.statustext = response.statustext;
                $scope.student = response.data;
                //$scope.sid = sid;
                //console.log(response.data);
                //console.log($scope);
            });
    }]);