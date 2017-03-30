angular.module('instructorApp')
    .controller('InstructorEachCourseController', ['$scope', '$window', '$http', "$routeParams",
    function($scope, $window, $http, $routeParams) {
        // console.log("testing");
        // console.log($routeParams.sid);
        $scope.isHideTable = true;

        

        $scope.isActiveHw = function (hw_id) {
            return hw_id == $routeParams.hid;
        };

        $http.get("/stats/instructors/" + $routeParams.sid + "/courses/" + $routeParams.cid)
            .then(function(response) {
                $scope.statuscode = response.status;
                $scope.statustext = response.statustext;
                $scope.course=response.data[0];
               
                $scope.assign = response.data[0].assignments;
                //console.log($scope.assign);
                $scope.sid = $routeParams.sid;
                $scope.cid = $routeParams.cid;
                
            });

        
    }]);