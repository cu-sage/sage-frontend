angular.module('studentApp')
    .controller('StudentIndexController', ['$rootScope', '$scope', '$http', "$location", function($rootScope, $scope, $http, $location) {
        // console.log("testing_index");
        var path = $location.path().split('/');
        $scope.path = path[1];
        $scope.sid = path[2];

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path().split('/')[1];
        };

        $scope.student_url = "https://upload.wikimedia.org/wikipedia/commons/9/97/Student_icon.png";
    }]);