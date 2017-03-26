angular.module('studentApp')
    .controller('StudentCoursesController', function(Upload, $window, $location, $scope, $http) {
        var path = $location.path().split('/');
        $scope.path = path[1];
        $scope.sid = path[2];
        var sid = path[2];
        $scope.learningPathsEnrolled = [
            {pathID:1, pathName:'LP 1'},
            {pathID:2, pathName:'LP 2'},
            {pathID:3, pathName:'LP 3'},
            {pathID:4, pathName:'LP 4'}
        ];



        $scope.coursesEnrolled = []

        $http.get("coursesEnrolled/student/" + sid)
        .then(function(response) {

                if (response.status == '403') {
                    $window.location.href = '/public/views/error.html';
                } else {

                    $scope.coursesEnrolled = response.data;


                }
        });
    });
