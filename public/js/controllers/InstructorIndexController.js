angular.module('instructorApp')
    .controller('InstructorIndexController', ['$rootScope', '$scope', '$http', "$location", function($rootScope, $scope, $http, $location) {
        console.log("testing_index");
        var path = $location.path().split('/');
        $scope.path = path[1];
        $scope.sid = path[2];

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path().split('/')[1];
        };

        $http.get("/stats/instructors/" + $scope.sid)
            .then(function(response) {
                $scope.statuscode = response.status;
                $scope.statustext = response.statustext;
                $scope.student = response.data;
                //$scope.sid = sid;
                //console.log(response.data);
                //console.log($scope);
            });
    }]);