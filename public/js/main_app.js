var mainApp = angular.module('mainApp', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'satellizer',
    'toggle-switch'
]);

mainApp.config(function($routeProvider, $authProvider) {
    // special varible $routeProvider
    $routeProvider
        .when('/login', {
            templateUrl: '/public/views/login.html',
            controller: 'LoginController'
        })
        .when('/reg', {
            templateUrl: '/public/views/reg.html',
            controller: 'RegController'
        })
        .when('/', {
            templateUrl: "/public/views/error.html"
        });

    $authProvider.loginUrl = '/auth/login';
    $authProvider.signupUrl = '/auth/reg';
})
.run(function($rootScope, $window, $auth) {
    if ($auth.isAuthenticated()) {
        $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
    }
});
