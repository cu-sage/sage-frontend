angular.module('researcherApp')
    .controller('ResearcherIndexController', ['$rootScope', '$scope', '$http', "$location", function($rootScope, $scope, $http, $location) {
        var path = $location.path().split('/');
        $scope.path = path[1];
        $scope.rid = path[2];

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path().split('/')[1];
        };

        /*
        $http.get("/stats/instructors/" + $scope.sid)
            .then(function(response) {
                console.log("testing");
                console.log(response);
                if (response.status == '403') {
                    $window.location.href = '/public/views/error.html';
                } else {
                    $scope.statuscode = response.status;
                    $scope.statustext = response.statustext;
                    $scope.instructor = response.data.name;
                }

                //$scope.sid = sid;
                //console.log(response.data);
                //console.log($scope);
            });
        */
    }]);
