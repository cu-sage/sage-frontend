var researcherApp = angular.module('researcherApp', [
    'ngRoute',
    'ngFileUpload',
    'satellizer',
    'ngMaterial',
    'mdSteppers',
    'treeControl',
    'ngMaterial',
    'ngMessages',
    'mdDataTable'
    //'controllers'
    //'serviceFactory',
    //'ui.bootstrap'
]);

researcherApp
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
    .config(function($routeProvider, $authProvider) {
        $routeProvider
            .when('/overview/:rid', {
                templateUrl: '/public/views/researcher_overview.html',
                controller: 'ResearcherOverviewController'
            })
            .when('/', {
                templateUrl: "/public/views/error.html"
            })
            .when('/instruction',{
                templateUrl: '/public/views/researcher_instruction.html',
                controller: 'ResearcherInstructionController'
            })
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

   