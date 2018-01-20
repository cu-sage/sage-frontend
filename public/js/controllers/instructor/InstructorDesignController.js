angular.module('instructorApp')
    .controller('InstructorDesignController', ['$scope', '$window', '$http', "$routeParams", "$location" ,
    function($scope, $window, $http, $routeParams, $location) {
   	//$scope.course={};

    	$scope.iid=$routeParams.sid;
        $scope.aid=$routeParams.aid;

        document.getElementById("scratch").innerHTML='<object style="position: absolute;" width="100%" height="100%"><param name="movie" width="100%" height="100%" value="http://52.168.29.242:3000/public/sampleSWF/scratch.swf"><param name=FlashVars value="sid={{sid}}&assignmentID={{assignmentID}}"></object>'

        $http.get("/stats/instructors/" + $routeParams.sid + "/courses/" + $routeParams.cid)
            .then(function(response) {
                // $scope.statuscode = response.status;
                // $scope.statustext = response.statustext;
                $scope.course=response.data[0];
               
                //$scope.assign = response.data[0].assignments;
                //console.log($scope.assign);
                
                
            });

        }]);