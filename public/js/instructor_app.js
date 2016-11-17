var instructorApp = angular.module('instructorApp', [
    'ngRoute'
    //'controllers'
    //'serviceFactory',
    //'ui.bootstrap'
]);

//var studentApp = angular.module("studentApp", []);

instructorApp.config(function($routeProvider) {
    $routeProvider
        .when('/tasks/:sid', {
            templateUrl: '/public/views/student_tasks.html',
            controller: 'StudentTasksController'
        })
        .when('/overview/:sid', {
            templateUrl: '/public/views/student_overview.html',
            controller: 'InstructorOverviewController'
        })
        .when('/', {
            templateUrl: "/public/views/error.html"
        });
});