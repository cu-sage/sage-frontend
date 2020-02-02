angular.module('studentApp').controller('StudentSingleCourseController', [
  '$window',
  '$location',
  '$scope',
  '$http',
  function($window, $location, $scope, $http) {
    //$scope.game_prog = $sce.trustAsHtml(game_prog_html);
    var path = $location.path().split('/');
    console.log('studentApp path is');
    console.log($location.path());
    console.log(path);
    $scope.courseID = path[2];
    $scope.sid = path[3];
    console.log('sid is:');
    console.log(path[3]);
    console.log($scope);

    var sid = path[3];
    var courseID = path[2];

    var metrics_data_singe_q;

    //
    // $http.get("/stats/metrics_static")
    //     .success(function(data){
    //         console.log("Read Metrics Data in JSON");
    //         console.log(data);
    //
    //         for (var i =0; i<data.enrolled.length; i++){
    //
    //             if (data.enrolled[i].q_id == courseID){
    //                 metrics_data_singe_q = data.enrolled[i].games;
    //             }
    //         }
    //     })
    //     .error(function(){
    //         alert("error")
    //     });

    $http.get('smetrics/student/' + sid).then(function(response) {
      if (response.status == '403') {
        $window.location.href = '/public/views/error.html';
      } else {
        var data = response.data;
        // $scope.badgesEarned = response.data.badgesearned;
        console.log('Read Metrics Data From Mlab!!!!!!!!sid:', sid);
        console.log(data);
        if (typeof data !== 'undefined' && data.hasOwnProperty('enrolled')) {
          console.log('metrics_data_singe_q');
          for (var i = 0; i < data.enrolled.length; i++) {
            //if (data.enrolled[i].q_id == courseID){

            metrics_data_singe_q = data.enrolled[i].games;
            console.log(metrics_data_singe_q);
            //}
          }
        }
      }
    });

    function prepareChart_game(data) {
      chart = {
        chart: {
          polar: true,
          type: 'line',
          marginLeft: 6
          // width: 300
        },

        title: {
          text: 'CT scores',
          x: -70
        },

        pane: {
          size: 250
        },

        xAxis: {
          categories: [
            'Abstraction',
            'Parallelization',
            'Logic',
            'Synchronization',
            'FlowControl',
            'UserInteractivity',
            'DataRepresentation'
          ],
          tickmarkPlacement: 'on',
          lineWidth: 0
        },

        yAxis: {
          gridLineInterpolation: 'polygon',
          lineWidth: 0,
          min: 0
        },

        /*legend: {
                    align: 'right',
                    verticalAlign: 'top',
                    y: 70,
                    layout: 'vertical'
                },*/

        series: [
          {
            name: data.g_name,
            data: data.g_ct
          }
        ]
      };
      return chart;
    }

    $scope.course = {
      courseName: '',
      desc: '',
      resources: [],
      assignments: []
    };
    $scope.enrollButtonToShow = true;
    $scope.leaderboard = [];

    // $http.get('coursesEnrolled/student/' + sid).then(function(response) {
    //   console.log(response);

    //   if (response.status == '403') {
    //     $window.location.href = '/public/views/error.html';
    //   } else {
    //     for (var x = 0; x < response.data.length; x++) {
    //       console.log('Load game', response.data[x]);
    //       console.log(response.data[x].courseID, ' ids ', courseID);
    //       if (response.data[x].courseID == courseID) {
    //         console.log('Get the course!');
    //         $scope.myCourse = response.data[x];
    //         break;
    //       }
    //     }

    // modified by just get from course model
    $http.get('/stats/course/' + courseID).then(function(response) {
      $scope.myCourse = response.data;
      $scope.myCourse.courseID = 'placeholder';

      console.log('metrics', metrics_data_singe_q);
      console.log($scope.myCourse);
      console.log($scope.myCourse.assignments);

      for (var i = 0; i < $scope.myCourse.assignments.length; i++) {
        if (
          typeof metrics_data_singe_q !== 'undefined' &&
          typeof metrics_data_singe_q[i] !== 'undefined'
        ) {
          console.log(metrics_data_singe_q[i]);
          $scope.myCourse.assignments[i].game_progress =
            metrics_data_singe_q[i].g_progress;

          $scope.myCourse.assignments[i].obj_progress =
            Math.round(
              ($scope.myCourse.assignments[i].game_progress.num_obj /
                $scope.myCourse.assignments[i].game_progress.num_obj_total) *
                100 *
                100
            ) / 100;
          $scope.myCourse.assignments[i].val_progress =
            Math.round(
              ($scope.myCourse.assignments[i].game_progress.num_opoi /
                $scope.myCourse.assignments[i].game_progress.num_opoi_total) *
                100 *
                100
            ) / 100;
          $scope.myCourse.assignments[i].chartConfig = prepareChart_game(
            metrics_data_singe_q[i]
          );
          //attempt to only display progress if there are game objectives assigned
          /*if($scope.myCourse.assignments[i].game_progress.num_obj_total>0)
                            {
                               
                                console.log(document.getElementById("game-obj-display-parent"));
                                console.log(document.getElementById("game-obj-display-parent").lastChild);
                                //document.getElementById("game-obj-display-parent").lastChild.innerHTML = game_prog_html;
                               
                                // $("#game-obj-display").prepend(game_prog_html);
                                $("#game-obj-display").prepend(game_prog);
                             
                                $("."+$scope.myCourse.assignments[i].assignmentId).append($scope.game_prog);


                        }*/
        }
      }

      console.log('my course is ', $scope.myCourse);

      //             console.log("ASSIGNMENTS:!")

      //             console.log($scope.myCourse.assignments)
      //}
    });

    function prepareChartConfig(response) {
      let categories = [
        'Abstraction',
        'Parallelization',
        'Logic',
        'Synchronization',
        'FlowControl',
        'UserInteractivity',
        'DataRepresentation'
      ];
      let seriesArray = [];
      console.log('in prepare Chart Config');
      if (response) {
        console.log('in response');
        console.log(response);
        response.map(singleAssignment => {
          if (singleAssignment.results) {
            let data = categories.map(singleCategory => {
              return singleAssignment.results[singleCategory];
            });

            seriesArray.push({
              name: singleAssignment.assignmentName,
              data: data,
              pointPlacement: 'on'
            });
          }
        });
      }

      return {
        chart: {
          polar: true,
          type: 'line',
          marginLeft: 6
        },

        title: {
          text: 'Metrics',
          x: -80
        },

        pane: {
          size: '85%'
        },

        xAxis: {
          categories: categories,
          tickmarkPlacement: 'on',
          lineWidth: 0
        },

        yAxis: {
          gridLineInterpolation: 'polygon',
          lineWidth: 0,
          min: 0
        },

        tooltip: {
          shared: true,
          pointFormat:
            '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
        },

        /*legend: {
                    align: 'right',
                    verticalAlign: 'top',
                    y: 70,
                    layout: 'vertical'
                },*/

        series: seriesArray
      };
    }
    $scope.chartConfig = prepareChartConfig();

    function putDataInScope(response) {
      console.log('trying to put data in scope');
      console.log(response.data);
      console.log($scope);
      if (response.status == '403') {
        $window.location.href = '/public/views/error.html';
      } else {
        console.log('this is put data in scope: ' + response.data);
        $scope.course = response.data;

        $scope.enrollButtonToShow = !response.data.isEnrolled;

        // $scope.numberOfAssignmentsDone = getNumberOfAssignmentsDonePercentage (response.data);

        // if(!$scope.obj_progress){
        //     $scope.obj_progress = $scope.quest_progress.num_obj/$scope.quest_progress.num_obj_total*100;
        // }
        // if(!$scope.val_progress){
        //     $scope.val_progress = $scope.quest_progress.num_opoi/$scope.quest_progress.num_opoi_total*100;
        // }

        //static
        $scope.course.resources = [
          {
            resourceID: 1,
            resourceName: 'Resource 1',
            link: 'https://www.youtube.com/watch?v=Mv9NEXX1VHc'
          },
          {
            resourceID: 2,
            resourceName: 'Resource 2',
            link: 'https://www.youtube.com/watch?v=Mv9NEXX1VHc'
          },
          {
            resourceID: 3,
            resourceName: 'Resource 3',
            link: 'https://www.youtube.com/watch?v=Mv9NEXX1VHc'
          },
          {
            resourceID: 4,
            resourceName: 'Resource 4',
            link: 'https://www.youtube.com/watch?v=Mv9NEXX1VHc'
          }
        ];
        //static
        // $scope.course.ctConcepts = [
        //     {},
        //     {},
        //     {}
        // ]

        $scope.chartConfig = prepareChartConfig(response.data.assignments);
      }
    }

    //  $http.get("course/"+courseID+"/student/"+sid).then(putDataInScope);

    $http.get('course/' + courseID + '/leaderboard').then(function(response) {
      if (response.status == 200) {
        $scope.leaderboard = response.data;
      } else {
        console.log('read leader board failed');
      }
    });

    // original
    $scope.onClickEnrollButton = function() {
      $http
        .post('enroll/' + courseID + '/student/' + sid)
        .then(function(response) {
          return $http.get('course/' + courseID + '/student/' + sid);
        })
        .then(putDataInScope)

        .catch(function(error) {
          console.log('error');
        });
    };
  }
]);

// function getNumberOfAssignmentsDonePercentage (data) {
//     var numberOfAssignmentsDone = 0;
//
//     for (var i = 0; i < data.assignments.length; i ++) {
//         if (data.assignments[i].hasOwnProperty('results')) {
//             numberOfAssignmentsDone ++;
//         }
//     }
//
//     return Math.round(numberOfAssignmentsDone/data.assignments.length*100);
// }
//
// function getVALprogress(data) {
//     var numberof
//
// }
