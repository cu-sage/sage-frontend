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
                templateUrl: '/public/views/instructor/instructor_home1.html',
                controller: 'InstructorHome1Controller'
                // templateUrl: '/public/views/instructor_overview.html',
                // controller: 'InstructorOverviewController'
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
            .when('/home1/:sid', {
                templateUrl: '/public/views/instructor/instructor_home1.html',
                controller: 'InstructorHome1Controller'
            })
            .when('/coursePage/:sid', {
                templateUrl: '/public/views/instructor/instructor_coursePage.html',
                controller: 'InstructorCourseController'
            })
            .when('/coursePage/:sid/LP/:LPid', {
                templateUrl: '/public/views/instructor/instructor_LP.html',
                controller: 'InstructorLPController'
            })
            .when('/coursePage/:sid/eachcourse/:cid', {
                templateUrl: '/public/views/instructor/instructor_eachcourse.html',
                controller: 'InstructorEachCourseController'
            })
            .when('/coursePage/:sid/eachcourse/:cid/hw/:hid', {
                templateUrl: '/public/views/instructor/instructor_eachcourse.html',
                controller: 'InstructorEachCourseController'
            })
            .when('/coursePage/:sid/createcourse', {
                templateUrl: '/public/views/instructor/instructor_createCourse.html',
                controller: 'InstructorCourseCreationController'
            })
            .when('/coursePage/:sid/course/:cid/createAssignment', {
                templateUrl: '/public/views/instructor/instructor_createAssignment.html',
                controller: 'InstructorAssignmentCreationController'
            })
            .when('/coursePage/:sid/course/:cid/createAssignment/:aid/design', {
                templateUrl: '/public/views/instructor/instructor_scratchdesign.html',
                controller: 'InstructorDesignController'
            })
            .when('/coursePage/:sid/createLP', {
                templateUrl: '/public/views/instructor/instructor_createLP.html',
                controller: 'InstructorLPCreationController'
            })
            .when('/coursePage/:sid/course/:cid/Assignment/:ano/id/:aid/VAE', {
                templateUrl: '/public/views/instructor/instructor_VAE.html',
                controller: 'InstructorVAEController'
            })
            .when('/', {
                templateUrl: "/public/views/error.html"
            });
        $authProvider.loginUrl = '/auth/login';
        $authProvider.signupUrl = '/auth/reg';
    })
    .run(function($rootScope, $window, $auth , $location) {
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