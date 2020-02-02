var mainApp = angular.module('mainApp', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'satellizer',
    'toggle-switch'
]);

mainApp.config(function($routeProvider, $authProvider) {
    // special variable $routeProvider
    $routeProvider
        .when('/', {
            templateUrl: '/public/views/login.html',
            controller: 'LoginController'
        })
        .when('/login', {
            templateUrl: '/public/views/login.html',
            controller: 'LoginController'
        })
        .when('/reg', {
            templateUrl: '/public/views/reg.html',
            controller: 'RegController'
        })
        
    $authProvider.loginUrl = '/auth/login';
    $authProvider.signupUrl = '/auth/reg';
})
.run(function($rootScope, $window, $auth) {
    if ($auth.isAuthenticated()) {
        console.log($window.localStorage.currentUser);
        $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
    }
});
