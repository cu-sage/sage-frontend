var countryApp = angular.module('countryApp', [
    'ngRoute',
    'controllers'
    //'serviceFactory',
    //'ui.bootstrap'
]);

countryApp.config(function($routeProvider) {
    $routeProvider.
    when('/students/:sid/assessments/:aid', {
        templateUrl: './public/views/dashboard.html',
        controller: 'dashboardController'
    }).
    otherwise({
        templateUrl: "./public/views/error.html"
    });
});
