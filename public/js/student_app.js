var studentApp = angular.module('studentApp', [
    'ngRoute',
    'vjs.video'
    //'controllers'
    //'serviceFactory',
    //'ui.bootstrap'
]);

//var studentApp = angular.module("studentApp", []);

studentApp
    .config(function($routeProvider) {
    $routeProvider
        .when('/tasks/:sid', {
            templateUrl: '/public/views/student_tasks.html',
            controller: 'StudentTasksController'
        })
        .when('/overview/:sid', {
            templateUrl: '/public/views/student_overview.html',
            controller: 'StudentOverviewController'
        })
        .when('/', {
            templateUrl: "/public/views/error.html"
        });
    })
    .run(function($rootScope) {
        document.addEventListener("keyup", function(e) {
            if (e.keyCode === 27)
                $rootScope.$broadcast("escapePressed", e.target);
        });

        document.addEventListener("click", function(e) {
            $rootScope.$broadcast("documentClicked", e.target);
        });
    });

app.directive("menu", function() {
    return {
        restrict: "E",
        template: "<div ng-class='{ show: visible, left: alignment === \"left\", right: alignment === \"right\" }' ng-transclude></div>",
        transclude: true,
        scope: {
            visible: "=",
            alignment: "@"
        }
    };
});

studentApp.directive("menuItem", function() {
    return {
        restrict: "E",
        template: "<div ng-click='navigate()' ng-transclude></div>",
        transclude: true,
        scope: {
            hash: "@"
        },
        link: function($scope) {
            $scope.navigate = function() {
                window.location.hash = $scope.hash;
            }
        }
    }
});