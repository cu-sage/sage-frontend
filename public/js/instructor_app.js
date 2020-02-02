var instructorApp = angular.module('instructorApp', [
    'ngMaterial',
    'mdSteppers',
    'ngRoute',
    'ngFileUpload',
    'satellizer',
    'treeControl',
    'ngMaterial',
    'ngMessages',
    'mdDataTable',
    'highcharts-ng',
    'ngFileUpload',
    //'controllers'
    //'serviceFactory',
    //'ui.bootstrap'
]);

instructorApp
    .service('loadingService', ['$mdDialog', function ($mdDialog) {
        this.start = function () {
            $mdDialog.show({
                template: '<md-dialog id="plz_wait" style="background-color:transparent;box-shadow:none">' +
                            '<div layout="row" layout-sm="column" layout-align="center center" aria-label="wait">' +
                                '<md-progress-circular md-mode="indeterminate" ></md-progress-circular>' +
                            '</div>' +
                         '</md-dialog>',
                parent: angular.element(document.body),
                clickOutsideToClose:false,
                fullscreen: false
            })
        };

        this.stop = function (){
            $mdDialog.cancel();
        }
    }])
    .config(function($routeProvider, $authProvider, $mdThemingProvider) {
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
            .when('/classes/:sid', {
                templateUrl: '/public/views/instructor_class.html',
                controller: 'InstructorClassController'
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
                templateUrl: '/public/views/instructor/instructor_questManagement.html',
                controller: 'InstructorQuestManagementController'
            })
            .when('/coursePage/:sid/eachcourse/:cid/hw/:hid', {
                templateUrl: '/public/views/instructor/instructor_questManagement.html',
                controller: 'InstructorQuestManagementController'
            })
            .when('/coursePage/:sid/createcourse', {
                templateUrl: '/public/views/instructor/instructor_createQuest.html',
                controller: 'InstructorCourseCreationController'
            })
            .when('/coursePage/:sid/course/:cid/createAssignment', {
                templateUrl: '/public/views/instructor/instructor_createGame.html',
                controller: 'InstructorGameCreationController'
            })
            .when('/coursePage/:sid/course/:cid/createAssignment/:aid/design', {
                templateUrl: '/public/views/instructor/instructor_scratchdesign.html',
                controller: 'InstructorDesignController'
            })
            .when('/coursePage/:sid/createLP', {
                templateUrl: '/public/views/instructor/instructor_createLP.html',
                controller: 'InstructorLPCreationController'
            })
            .when('/coursePage/:sid/course/:cid/Assignment/:ano/id/:aid/Game', {
                templateUrl: '/public/views/instructor/instructor_scratchdesign.html',
                controller: 'InstructorGamesController'
            })
            .when('/coursePage/:sid/course/:cid/Assignment/:ano/id/:aid/VAE', {
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
            .when('/librarires/:sid/badges',{
                templateUrl:'/public/views/instructor/instructor_badges.html',
                controller:'InstructorBadgesController'
            })
            .when('/createInstr/:sid',{
                templateUrl: '/public/views/instructor/instruction_creation.html',
                controller: 'InstructionCreationController'
            })
            .when('/coursePage/:sid/course/:cid/Assignment/:ano/id/:aid/Instruction',{
                templateUrl: '/public/views/instructor/instructor_updateGame.html',
                controller: 'InstructorInstructionsController'
            })
            .when('/metrics/:sid',{
                templateUrl: '/public/views/instructor/instructor_metrics.html',
                controller: 'InstructorMetricsController'
            })
            .when('/metrics/students/:sid',{
                templateUrl: '/public/views/instructor/instructor_s_metrics.html',
                controller: 'InstructorStudentsMetricsController'
            })
            .when('/metrics/missions/:sid',{
                templateUrl: '/public/views/instructor/instructor_m_metrics.html',
                controller: 'InstructorMissionsMetricsController'
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