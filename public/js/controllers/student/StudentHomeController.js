angular.module('studentApp')
    .controller('StudentHomeController', function(Upload, $window, $location, $scope, $http) {
        var path = $location.path().split('/');
        $scope.path = path[1];
        $scope.sid = path[2];

        var sid = path[2];

        $scope.recommendedCourses = [];
        $scope.recentCourses = [];

        $http.get("recommendedCourses/student/" + sid)
        .then(function(response) {

                if (response.status == '403') {
                    $window.location.href = '/public/views/error.html';
                } else {

                    $scope.recommendedCourses = response.data;


                }
        });

        $http.get("recentCourses/student/" + sid)
        .then(function(response) {

                if (response.status == '403') {
                    $window.location.href = '/public/views/error.html';
                } else {

                    $scope.recentCourses = response.data;


                }
        });

    });
