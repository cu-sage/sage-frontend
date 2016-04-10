var countryApp = angular.module('countryApp', [
    'ngRoute',
    'controllers',
    'serviceFactory'
]);

countryApp.config(function($routeProvider) {
    $routeProvider.
        when('/students/:sid/assessments/:aid', {
            templateUrl: './dashboard.html',
            controller: 'DashboardController'
        }).
        otherwise({
            templateUrl: "./error.html"
        });
});