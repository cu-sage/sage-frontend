angular.module('studentApp')
    /* .directive('progressChart', [ '$window', function ($window) {
        return {
            restrict: 'E',
            template: '<div></div>',
            scope: {
                title: '@',
                data: '='
            },
            link: function (scope, element) {
                // angular.element(document.querySelector('.radial-progress').setAttribute('data-progress', '30'));
            }
        };
    }]) */
    .controller('StudentTasksController', ['$scope', '$window', '$http', "$routeParams", function($scope, $window, $http, $routeParams) {
        console.log("testing");
        console.log($routeParams.sid);
        $scope.progress = 60;
        $http.get("/stats/students/" + $routeParams.sid)
            .then(function(response) {
                $scope.statuscode = response.status;
                $scope.statustext = response.statustext;
                $scope.student = response.data;
                $scope.sid = $routeParams.sid;

            });

    }]);