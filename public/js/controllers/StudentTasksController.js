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
                $scope.badges= response.data.badges;
                $scope.tutorialID= response.data.tutorialID;
                $scope.url = 'https://s3.amazonaws.com/sage-videos-2016/' + $scope.tutorialID + '.flv';

                $scope.mediaToggle = {
                    sources: [
                        {
                            src: $scope.url,
                            type: 'video/flv'
                        }
                    ]
                };
            });

    }]);