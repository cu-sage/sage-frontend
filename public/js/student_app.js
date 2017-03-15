var studentApp = angular.module('studentApp', [
    'ngRoute',
    'vjs.video',
    'ngFileUpload',
    'satellizer'
    //'controllers'
    //'serviceFactory',
    //'ui.bootstrap'
]);


studentApp
    .config(function($routeProvider, $authProvider) {
    $routeProvider
        .when('/home/:sid', {
            templateUrl: '/public/views/student/student_home.html',
            controller: 'StudentHomeController'
        })
        .when('/courses/:sid', {
            templateUrl: '/public/views/student/student_courses.html',
            controller: 'StudentCoursesController'
        })
        .when('/account/:sid', {
            templateUrl: '/public/views/student_account.html',
            controller: 'StudentAccountController'
        })
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
        $authProvider.loginUrl = '/auth/login';
        $authProvider.signupUrl = '/auth/reg';
    })
    .run(function($rootScope, $window, $auth) {
        $rootScope.isHidden = false;

        $rootScope.showHide = function () {
            //If DIV is hidden it will be visible and vice versa.
            $rootScope.isHidden = $rootScope.isHidden ? false : true;
            console.log($rootScope.isHidden);
        };
        if ($auth.isAuthenticated()) {
            $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
        }
    });
