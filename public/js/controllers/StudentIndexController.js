angular.module('studentApp')
    .controller('StudentIndexController', ['$rootScope', '$scope', '$http', "$location", "$timeout", function($rootScope, $scope, $http, $location, $timeout) {
        // console.log("testing_index");
        var path = $location.path().split('/');
        $scope.path = path[1];
        $scope.sid = path[path.length-1];

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path().split('/')[1];
        };

        $scope.treeOptions = {
            nodeChildren: "children",
            dirSelectable: true,
            injectClasses: {
                ul: "a1",
                li: "a2",
                liSelected: "a7",
                iExpanded: "a3",
                iCollapsed: "a4",
                iLeaf: "a5",
                label: "a6",
                labelSelected: "a8"
            }
        };

        //$scope.student_url = "https://upload.wikimedia.org/wikipedia/commons/9/97/Student_icon.png";

        $http.get("coursesEnrolled/student/" + $scope.sid)
            .then(function(response) {

                if (response.status == '403') {
                    $window.location.href = '/public/views/error.html';
                } else {

                    $scope.coursesEnrolled = response.data;
                    $scope.dataForTheTree = response.data;
                    console.log($scope.coursesEnrolled);
                    /*  $scope.coursesInfo = [];
                     for(var quest in $scope.coursesEnrolled){
                     console.log("HERE is the quest", $scope.coursesEnrolled);
                     $http.get("/stats/student/" + $scope.sid + "/LPinfo/" + quest.courseID )
                     .then(function(response) {
                     $scope.LP=response.data[0];
                     $scope.coursesInfo.append([$scope.LP]);
                     //var temp = $scope.LP.courses;

                     }
                     );
                     }
                     console.log("DID IT DO IT?", $scope.coursesInfo);*/


                }
            });


        $scope.student_url = "https://www.susqu.edu/assets/images/news/2014-15/january-2015/columbia-wide-news.jpg";

    }]);
