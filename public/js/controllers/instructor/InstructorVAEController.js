angular.module('instructorApp')
    .controller('InstructorVAEController', ['$scope', '$window', '$http', "$routeParams",
    function($scope, $window, $http, $routeParams) {
        // console.log("testing");
        // console.log($routeParams.sid);
        $scope.isHideTable = true;

        $scope.sid = $routeParams.sid;
        $scope.cid = $routeParams.cid;
        $scope.aid = $routeParams.aid;
        $scope.ano = $routeParams.ano;

        // $scope.isActiveHw = function (hw_id) {
        //     return hw_id == $routeParams.hid;
        // };
            //C:\Users\yuval\Documents\School\Fall2017\SAGELab\sage-editor\app\editor
        //document.getElementById("vae").innerHTML='<object type="text/html" data="C:\\Users\\laisj\\Downloads\\SAGE\\sage-editor\\app\\editor\\index.html" style="width:100%; height: 100%;"></object>'

        $http.get("/stats/instructors/" + $routeParams.sid + "/courses/" + $routeParams.cid)
            .then(function(response) {
                console.log("testing_VAE");
                // $scope.statuscode = response.status;
                // $scope.statustext = response.statustext;
                $scope.quest=response.data[0];
                console.log($scope.quest)
               
                //$scope.assign = response.data[0].assignments;
                //console.log($scope.assign);
                
                
            });

        
    }]);