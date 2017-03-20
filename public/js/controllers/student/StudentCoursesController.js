angular.module('studentApp')
    .controller('StudentCoursesController', function(Upload, $window, $location, $scope) {
        var path = $location.path().split('/');
        $scope.path = path[1];
        $scope.sid = path[2];

        $scope.learningPathsEnrolled = [
            {pathID:1, pathName:'LP 1'},
            {pathID:2, pathName:'LP 2'},
            {pathID:3, pathName:'LP 3'},
            {pathID:4, pathName:'LP 4'}
        ];

        $scope.coursesEnrolled = [
            {courseID:1, courseName:'Course 1'},
            {courseID:2, courseName:'Course 2'},
            {courseID:3, courseName:'Course 3'},
            {courseID:4, courseName:'Course 4'}
        ];
    });
