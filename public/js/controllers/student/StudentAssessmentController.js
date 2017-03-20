angular.module('studentApp')
    .controller('StudentAssessmentController', function(Upload, $window, $location, $scope) {
        var path = $location.path().split('/');
        $scope.path = path[1];
        $scope.sid = path[2];
        console.log(path);
    });
