angular.module('studentApp')
    .controller('StudentIndexController', ['$rootScope', '$scope', '$http', "$location", function($rootScope, $scope, $http, $location) {
        // console.log("testing_index");
        var path = $location.path().split('/');
        $scope.path = path[1];
        $scope.sid = path[path.length-1];

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path().split('/')[1];
        };

        $scope.student_url = "https://i.pinimg.com/236x/75/23/c6/7523c6fd002dd3f05e1c819cbc187f67--kung-fu-panda--fun-loving.jpg";
    }]);