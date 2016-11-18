angular.module('studentApp')
    .controller('StudentIndexController', ['$rootScope', '$scope', '$http', "$location", function($rootScope, $scope, $http, $location) {
        console.log("testing");
        var path = $location.path().split('/');
        $scope.path = path[1];
        $scope.sid = path[2];

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path().split('/')[1];
        };

        $scope.leftVisible = false;
        $scope.rightVisible = false;

        $scope.close = function() {
            $scope.leftVisible = false;
            $scope.rightVisible = false;
        };

        $scope.showLeft = function(e) {
            $scope.leftVisible = true;
            e.stopPropagation();
        };

        $scope.showRight = function(e) {
            $scope.rightVisible = true;
            e.stopPropagation();
        };

        $rootScope.$on("documentClicked", _close);
        $rootScope.$on("escapePressed", _close);

        function _close() {
            $scope.$apply(function() {
                $scope.close();
            });
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