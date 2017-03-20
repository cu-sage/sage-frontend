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
        .when('/courses/:courseID/:sid', {
            templateUrl: '/public/views/student/student_single_course.html',
            controller: 'StudentSingleCourseController'
        })
        .when('/courses/:courseID/assessment/:aid/:sid', {
            templateUrl: '/public/views/student/student_assessment.html',
            controller: 'StudentAssessmentController'
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
    .run(function($rootScope, $window, $auth, $location) {
        $rootScope.isHidden = false;

        $rootScope.changeView = function (path) {
            $location.path(path);
        }

        $rootScope.showHide = function () {
            //If DIV is hidden it will be visible and vice versa.
            $rootScope.isHidden = $rootScope.isHidden ? false : true;
            console.log($rootScope.isHidden);
        };
        if ($auth.isAuthenticated()) {
            $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
        }
    });
