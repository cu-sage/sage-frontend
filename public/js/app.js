var mainApp = angular.module('mainApp', [
    'ngRoute'
    //'controllers'
    //'serviceFactory',
    //'ui.bootstrap'
]);

//var studentApp = angular.module("studentApp", []);

mainApp.config(function($routeProvider) {
    $routeProvider
        .when('/students/tasks/', {
            templateUrl: './public/views/student_tasks.html',
            controller: 'StudentTasksController'
        })
        .when('/students/:sid', {
            templateUrl: './public/views/student_overview.html',
            controller: 'StudentOverviewController'
        })
        .when('/instructors', {
            templateUrl: './public/views/instructors_v2.html',
            controller: 'InstructorOverviewController'
        })
        .when('/', {
            templateUrl: "./public/views/error.html"
        });
});