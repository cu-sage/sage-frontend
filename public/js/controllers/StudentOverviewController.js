var app = angular.module('studentApp', []);

app.controller('StudentOverviewController', ['$scope', '$http', function($scope, $http) {
    console.log("testing");
    $http.get("/stats/students/123").then(function(response) {
        $scope.statuscode = response.status;
        $scope.statustext = response.statustext;
        $scope.student = response.data;
        console.log(response.data);
    });
}]);