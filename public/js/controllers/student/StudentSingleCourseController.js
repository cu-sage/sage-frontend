angular.module('studentApp')
    .controller('StudentSingleCourseController', function(Upload, $window, $location, $scope, $http) {
        

        var path = $location.path().split('/');
        $scope.courseID = path[2];
        $scope.sid = path[3];

        var sid = path[3];
        var courseID = path[2];

        $scope.course = {
            courseName: '',
            desc : '',
            resources : [],
            assignments : []
        };
        $scope.enrollButtonToShow = false;

        //get the results from server.

        function putDataInScope (response) {

            if (response.status == '403') {
                        $window.location.href = '/public/views/error.html';
                } else {
                        $scope.course = response.data;

                        $scope.enrollButtonToShow = !response.data.isEnrolled;

                        //static
                        $scope.course.resources = [
                            {'resourceID': 1, 'resourceName': 'Resource 1', link:"https://www.youtube.com/watch?v=Mv9NEXX1VHc"},
                            {'resourceID': 2, 'resourceName': 'Resource 2', link:"https://www.youtube.com/watch?v=Mv9NEXX1VHc"},
                            {'resourceID': 3, 'resourceName': 'Resource 3', link:"https://www.youtube.com/watch?v=Mv9NEXX1VHc"},
                            {'resourceID': 4, 'resourceName': 'Resource 4', link:"https://www.youtube.com/watch?v=Mv9NEXX1VHc"}
                        ];
                    }
            }
        

        $http.get("course/"+courseID+"/student/"+sid).then(putDataInScope);

        $scope.onClickEnrollButton  = function () {
            $http.post("enroll/" + courseID + '/student/' + sid)
            .then(function (response) {

                return $http.get("course/"+courseID+"/student/"+sid); 

            }).then(putDataInScope)

            .catch (function (error) {

                console.log('error');
            })
            
        }

        



    });



