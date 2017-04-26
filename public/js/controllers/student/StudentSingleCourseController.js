angular.module('studentApp')
    .controller('StudentSingleCourseController',['$window', '$location','$scope', '$http', function($window, $location, $scope, $http) {
        

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
        $scope.enrollButtonToShow = true;
        $scope.leaderboard = []

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

                        $scope.chartConfig = prepareChartConfig (response.data.assignments);
                    }
            }
        

        $http.get("course/"+courseID+"/student/"+sid).then(putDataInScope);

        $http.get('course/'+courseID+'/leaderboard')
        .then(function(response) {

            if (response.status == 200) {

                $scope.leaderboard = response.data;


            }
        });

        $scope.onClickEnrollButton  = function () {
            $http.post("enroll/" + courseID + '/student/' + sid)
            .then(function (response) {

                return $http.get("course/"+courseID+"/student/"+sid); 

            }).then(putDataInScope)

            .catch (function (error) {

                console.log('error');
            })
            
        }

        
        



    }]);



