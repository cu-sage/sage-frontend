var studentApp = angular.module('studentApp', [
    'ngRoute'
    //'controllers'
    //'serviceFactory',
    //'ui.bootstrap'
]);

//var studentApp = angular.module("studentApp", []);

studentApp.config(function($routeProvider) {
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
});