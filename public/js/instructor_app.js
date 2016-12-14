var instructorApp = angular.module('instructorApp', [
    'ngRoute',
    'ngFileUpload',
    'satellizer'
    //'controllers'
    //'serviceFactory',
    //'ui.bootstrap'
]);

instructorApp
    .config(function($routeProvider, $authProvider) {
        $routeProvider
            .when('/overview/:sid', {
                templateUrl: '/public/views/instructor_overview.html',
                controller: 'InstructorOverviewController'
            })
            .when('/uploadVideo/:sid', {
                templateUrl: '/public/views/instructor_upload.html',
                controller: 'InstructorUploadController'
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