var studentApp = angular.module('studentApp', [
    'ngMaterial',
    'mdSteppers',
    'ngRoute',
    'vjs.video',
    'ngFileUpload',
    'satellizer',
    'highcharts-ng',
    'luegg.directives'
    //'controllers'
    //'serviceFactory',
    //'ui.bootstrap'
]);


studentApp
    .service('loadingService', ['$mdDialog', function ($mdDialog) {
        this.start = function () {
            $mdDialog.show({
                template: '<md-dialog id="plz_wait" style="background-color:transparent;box-shadow:none">' +
                    '<div layout="row" layout-sm="column" layout-align="center center" aria-label="wait">' +
                    '<md-progress-circular md-mode="indeterminate" ></md-progress-circular>' +
                    '</div>' +
                    '</md-dialog>',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                fullscreen: false
            })
        };

        this.stop = function () {
            $mdDialog.cancel();
        }
    }])
    .config(function ($routeProvider, $authProvider) {
        $routeProvider
            .when('/home/:sid', {
                templateUrl: '/public/views/student/student_courses.html',
                controller: 'StudentCoursesController'
            })
            .when('/metrics/:sid', {
                templateUrl: '/public/views/student/student_matrics.html',
                controller: 'StudentMetricsController'
            })
            .when('/quests/:sid', {
                templateUrl: '/public/views/student/student_quests.html',
                controller: 'StudentCoursesController'
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
            .when('/learningPath/:lpID/:sid', {
                templateUrl: '/public/views/student/student_learning_path.html',
                controller: 'StudentLearningPathController'
            })
            .when('/account/:sid', {
                templateUrl: '/public/views/student_account.html',
                controller: 'StudentAccountController'
            })
            .when('/tasks/:sid', {
                templateUrl: '/public/views/student_tasks.html',
                controller: 'StudentTasksController'
            })
            .when('/', {
                templateUrl: "/public/views/error.html"
            });
        $authProvider.loginUrl = '/auth/login';
        $authProvider.signupUrl = '/auth/reg';
    })
    .run(function ($rootScope, $window, $auth, $location) {
        $rootScope.isHidden = false;
        console.log($rootScope, $window, $auth, $location)
        $rootScope.changeView = function (path, type = "") {
            $location.path(path);
            if (type != "") {
                $location.search("type", type);
            }
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
