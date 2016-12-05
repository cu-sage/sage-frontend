var instructorApp = angular.module('instructorApp', [
    'ngRoute'
    //'controllers'
    //'serviceFactory',
    //'ui.bootstrap'
]);

//var studentApp = angular.module("studentApp", []);

instructorApp
    .config(function($routeProvider) {
        $routeProvider
            .when('/overview/:sid', {
                templateUrl: '/public/views/instructor_overview.html',
                controller: 'InstructorOverviewController'
            })
            .when('/overview/:sid/courses/:cid', {
                templateUrl: '/public/views/instructor_overview.html',
                controller: 'InstructorOverviewController'
            })
            .when('/overview/:sid/courses/:cid/hw/:hid', {
                templateUrl: '/public/views/instructor_overview.html',
                controller: 'InstructorOverviewController'
            })
            .when('/', {
                templateUrl: "/public/views/error.html"
            })
    })
    .run(function($rootScope) {
        $rootScope.isHidden = false;

        $rootScope.showHide = function () {
            //If DIV is hidden it will be visible and vice versa.
            $rootScope.isHidden = $rootScope.isHidden ? false : true;
            console.log($rootScope.isHidden);
        };
    });