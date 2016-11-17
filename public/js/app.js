var studentApp = angular.module('studentApp', [
    'ngRoute',
    'vjs.video'
    //'controllers'
    //'serviceFactory',
    //'ui.bootstrap'
]);

//var studentApp = angular.module("studentApp", []);

studentApp.config(function($routeProvider) {
    $routeProvider
        .when('/students/tasks/:sid', {
            templateUrl: './public/views/student_tasks.html',
            controller: 'StudentTasksController'
        })
        .when('/students/overview/:sid', {
            templateUrl: './public/views/student_overview.html',
            controller: 'StudentOverviewController'
        })
        .when('/students/', {
            templateUrl: "./public/views/error.html"
        })
        .when('/', {
            templateUrl: "./public/views/error.html"
        });
});