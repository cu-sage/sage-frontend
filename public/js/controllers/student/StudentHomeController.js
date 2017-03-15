angular.module('studentApp')
    .controller('StudentHomeController', function(Upload, $window, $location, $scope) {
        var path = $location.path().split('/');
        $scope.path = path[1];
        $scope.sid = path[2];

        $scope.featuredCourses = [
            {courseID:1, courseName:'Intro to CT'}, 
            {courseID:2, courseName:'Advanced CT'},
            {courseID:3, courseName:'Looping in CT'}, 
            {courseID:4, courseName:'Recursion in CT'}
        ];
        $scope.recentCourses = [
            {courseID:1, courseName:'Looping'}, 
            {courseID:2, courseName:'Recursion'}
        ];

    });
