angular.module('studentApp')
    .controller('StudentSingleCourseController',['$window', '$location','$scope', '$http', function($window, $location, $scope, $http) {


        var path = $location.path().split('/');
        $scope.courseID = path[2];
        $scope.sid = path[3];

        var sid = path[3];
        var courseID = path[2];

        $scope.quest = {
            courseName: '',
            desc : '',
            resources : [],
            assignments : []
        };
        $scope.enrollButtonToShow = true;
        $scope.leaderboard = []

        $http.get("coursesEnrolled/student/" + sid)
        .then(function(response) {

                if (response.status == '403') {
                    $window.location.href = '/public/views/error.html';
                } else {
                    for( var x=0; x<response.data.length; x++){
                      console.log("here is de quest", response.data[x]);
                      console.log(response.data[x].courseID," ids ",courseID);
                      if( response.data[x].courseID == courseID){
                        $scope.myCourse = response.data[x];
                      }
                    }
                }
        });

        function prepareChartConfig (response) {
            let categories = ['Abstraction','Parallelization','Logic','Synchronization','FlowControl','UserInteractivity','DataRepresentation'];
            let seriesArray = [];

            if (response) {
                response.map ((singleAssignment) => {
                    if (singleAssignment.results) {
                        let data = categories.map ((singleCategory) => {
                            return singleAssignment.results[singleCategory];
                        });

                        seriesArray.push({
                            name: singleAssignment.gameName,
                            data: data,
                            pointPlacement: 'on'

                        });
                    }
                });
            }

            return {
                chart: {
                    polar: true,
                    type: 'line'
                },

                title: {
                    text: 'Metrics',
                    x: -80
                },

                pane: {
                    size: '80%'
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
                    pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
                },

                legend: {
                    align: 'right',
                    verticalAlign: 'top',
                    y: 70,
                    layout: 'vertical'
                },

                series: seriesArray
            };
        }
        $scope.chartConfig = prepareChartConfig ();


        function putDataInScope (response) {
            console.log("trying to put data in scope")
            if (response.status == '403') {
                        $window.location.href = '/public/views/error.html';
                } else {
                    console.log("this is put data in scope: "+response.data)
                        $scope.quest = response.data;

                        $scope.enrollButtonToShow = !response.data.isEnrolled;

                        $scope.numberOfAssignmentsDone = getNumberOfAssignmentsDonePercentage (response.data);
                        //static
                        $scope.quest.resources = [
                            {'resourceID': 1, 'resourceName': 'Resource 1', link:"https://www.youtube.com/watch?v=Mv9NEXX1VHc"},
                            {'resourceID': 2, 'resourceName': 'Resource 2', link:"https://www.youtube.com/watch?v=Mv9NEXX1VHc"},
                            {'resourceID': 3, 'resourceName': 'Resource 3', link:"https://www.youtube.com/watch?v=Mv9NEXX1VHc"},
                            {'resourceID': 4, 'resourceName': 'Resource 4', link:"https://www.youtube.com/watch?v=Mv9NEXX1VHc"}
                        ];

                        $scope.chartConfig = prepareChartConfig (response.data.assignments);
                    }
            }



      //  $http.get("quest/"+courseID+"/student/"+sid).then(putDataInScope);

        $http.get('quest/'+courseID+'/leaderboard')
        .then(function(response) {

            if (response.status == 200) {

                $scope.leaderboard = response.data;


            }
        });

        $scope.onClickEnrollButton  = function () {
            $http.post("enroll/" + courseID + '/student/' + sid)
            .then(function (response) {

                return $http.get("quest/"+courseID+"/student/"+sid);

            }).then(putDataInScope)

            .catch (function (error) {

                console.log('error');
            })

        }






    }]);


function getNumberOfAssignmentsDonePercentage (data) {
    var numberOfAssignmentsDone = 0;

    for (var i = 0; i < data.assignments.length; i ++) {
        if (data.assignments[i].hasOwnProperty('results')) {
            numberOfAssignmentsDone ++;
        }
    }

    return Math.round(numberOfAssignmentsDone/data.assignments.length*100);
}
