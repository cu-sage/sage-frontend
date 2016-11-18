angular.module('studentApp')
    .directive("menu", function() {
        return {
            restrict: "E",
            template: "<div ng-class='{ show: visible, left: alignment === \"left\", right: alignment === \"right\" }' ng-transclude></div>",
            transclude: true,
            scope: {
                visible: "=",
                alignment: "@"
            }
        };
    })
    .controller('StudentIndexController', ['$rootScope', '$scope', '$http', "$location", function($rootScope, $scope, $http, $location) {
        console.log("testing_index");
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