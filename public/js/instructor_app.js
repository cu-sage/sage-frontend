var instructorApp = angular.module('instructorApp', [
    'ngRoute',
    'ngFileUpload',
    'satellizer',
    'treeControl'
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
            .when('/overview/:sid/quests/:cid', {
                templateUrl: '/public/views/instructor_overview.html',
                controller: 'InstructorOverviewController'
            })
            .when('/overview/:sid/quests/:cid/hw/:hid', {
                templateUrl: '/public/views/instructor_overview.html',
                controller: 'InstructorOverviewController'
            })
            .when('/home1/:sid', {
                templateUrl: '/public/views/instructor/instructor_home1.html',
                controller: 'InstructorHome1Controller'
            })
            .when('/questPage/:sid', {
                templateUrl: '/public/views/instructor/instructor_questPage.html',
                controller: 'InstructorQuestController'
            })
            .when('/questPage/:sid/LP/:LPid', {
                templateUrl: '/public/views/instructor/instructor_LP.html',
                controller: 'InstructorLPController'
            })
            .when('/questPage/:sid/eachquest/:cid', {
                templateUrl: '/public/views/instructor/instructor_eachquest.html',
                controller: 'InstructorEachQuestController'
            })
            .when('/questPage/:sid/eachquest/:cid/hw/:hid', {
                templateUrl: '/public/views/instructor/instructor_eachquest.html',
                controller: 'InstructorEachQuestController'
            })
            .when('/questPage/:sid/createquest', {
                templateUrl: '/public/views/instructor/instructor_createQuest.html',
                controller: 'InstructorQuestCreationController'
            })
            .when('/questPage/:sid/quest/:cid/createGame', {
                templateUrl: '/public/views/instructor/instructor_createGame.html',
                controller: 'InstructorGameCreationController'
            })
            .when('/questPage/:sid/quest/:cid/createGame/:aid/design', {
                templateUrl: '/public/views/instructor/instructor_scratchdesign.html',
                controller: 'InstructorDesignController'
            })
            .when('/coursePage/:sid/createLP', {
                templateUrl: '/public/views/instructor/instructor_createLP.html',
                controller: 'InstructorLPCreationController'
            })
            .when('/questPage/:sid/quest/:cid/Game/:ano/id/:aid/Game', {
                templateUrl: '/public/views/instructor/instructor.html',
                controller: 'InstructorGameController'
            })
            .when('/questPage/:sid/quest/:cid/Game/:ano/id/:aid/VAE', {
                templateUrl: '/public/views/instructor/instructor_VAE.html',
                controller: 'InstructorVAEController'
            })
            .when('/librarires/:sid', {
                templateUrl: '/public/views/instructor/instructor_lib.html',
                controller: 'InstructorLibController'
            })
            .when('/librarires/:sid/missions', {
                templateUrl: '/public/views/instructor/instructor_missions.html',
                controller: 'InstructorMissionsController'
            })
            .when('/librarires/:sid/quests', {
                templateUrl: '/public/views/instructor/instructor_quest.html',
                controller: 'InstructorQuestsController'
            })
            .when('/librarires/:sid/games', {
                templateUrl: '/public/views/instructor/instructor_games.html',
                controller: 'InstructorGamesController'
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
