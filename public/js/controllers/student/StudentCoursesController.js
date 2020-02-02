angular
  .module('studentApp')
  .controller('StudentCoursesController', function(
    Upload,
    $window,
    $location,
    $scope,
    $http
  ) {
    var path = $location.path().split('/');
    $scope.path = path[1];
    $scope.sid = path[2];
    var sid = path[2];

    $scope.missions = [];
    $scope.quests = [];
    $http
      .get('getEnrollments/student/' + sid)
      .then(response => {
        console.log('DEBUG!!!');
        console.log(response);
        for (var i = 0; i < response.data.missionIDs.length; i++) {
          // console.log(response.data.missionIDs[i]);
          $scope.missions.push({
            missionID: response.data.missionIDs[i],
            missionName: response.data.missionNames[i]
          });
        }

        for (var i = 0; i < response.data.questIDs.length; i++) {
          // console.log(response.data.questIDs[i]);
          $scope.quests.push({
            questID: response.data.questIDs[i],
            questName: response.data.questNames[i]
          });
        }
      })
      .catch(error => {
        $window.location.href = '/public/views/error.html';
        console.log(error);
      });
    // $scope.coursesEnrolled = []

    // $http.get("coursesEnrolled/student/" + sid)
    // .then(function(response) {
    //         if (response.status == '403') {
    //             $window.location.href = '/public/views/error.html';
    //         } else {

    //             $scope.coursesEnrolled = response.data;
    //         }
    // });
  });
