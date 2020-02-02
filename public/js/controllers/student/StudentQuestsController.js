angular.module('studentApp')
    .controller('StudentQuestsController', function(Upload, $window, $location, $scope, $http) {


        var path = $location.path().split('/');
        $scope.path = path[1];
        $scope.sid = path[2];

        var sid = path[2];

        var static_data;
        var metrics_data;
        //
        // $http.get("/stats/steven_static")
        //     .success(function(data){
        //         console.log("Read Static Data in JSON");
        //         console.log(data);
        //
        //         static_data = data;
        //     })
        //     .error(function(){
        //         alert("error")
        //     });

        // $http.get("/stats/metrics_static")
        //     .success(function(data){
        //         console.log("Read Metrics Data in JSON");
        //         console.log(data);
        //
        //         metrics_data = data;
        //     })
        //     .error(function(){
        //         alert("error")
        //     });



        $http.get("smetrics/student/" + sid)
            .then(function(response) {

                if (response.status == '403') {
                    $window.location.href = '/public/views/error.html';
                } else {

                    // var data = response.data;
                    // console.log("Read Metrics Data From Mlab!!!!!!!!sid:", sid);
                    // console.log(data);
                    metrics_data = response.data;
                }
            });




        $scope.recommendedCourses = [];
        $scope.recentCourses = [];



        function prepareChart (m_data_single_q) {

            var series_data = [];
            for (var i =0; i<m_data_single_q.length; i++){

                series_data[i] = {};
                series_data[i].name = m_data_single_q[i].g_name;
                series_data[i].data = m_data_single_q[i].g_ct;

            }



            chart ={
                chart: {
                    polar: true,
                    //borderWidth: 5,
                    type: 'line',
                    marginLeft: 6
                    // width: 300

                },

                title: {
                    text: 'Quest CT scores',
                    x: -70
                },

                pane: {
                    //center: 50%,
                    size: '85%'
                },

                xAxis: {
                    categories: ['Abstraction','Parallelization','Logic','Synchronization','FlowControl','UserInteractivity','DataRepresentation'],
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
                    horizontalAlign: '',
                    y: 70,
                    layout: 'vertical'
                },*/

                series: series_data
            };
            return chart;

        }



        $http.get("recommendedCourses/student/" + sid)
            .then(function(response) {

                if (response.status == '403') {
                    $window.location.href = '/public/views/error.html';
                } else {

                    $scope.recommendedCourses = response.data;


                }
            });


        function check_match(sid, m_data_raw) {
            if (sid == m_data_raw.studentID){
                return m_data_raw.enrolled;
            }
            else{
                console.log("No Metrics Data Found!")
                return null;
            }
        }

        function aggregate_progress(m_data_single_q) {
            var q_progress = {
                "num_obj" : 0,
                "num_opoi" : 0,
                "num_obj_total" : 0,
                "num_opoi_total" : 0
            };
            for (var i =0; i<m_data_single_q.length; i++){

                q_progress.num_obj += m_data_single_q[i].g_progress.num_obj;
                q_progress.num_opoi += m_data_single_q[i].g_progress.num_opoi;
                q_progress.num_obj_total += m_data_single_q[i].g_progress.num_obj_total;
                q_progress.num_opoi_total += m_data_single_q[i].g_progress.num_opoi_total;
            }
            return q_progress;
        }


        // $http.get("recentCourses/student/" + sid)
        $http.get("coursesEnrolled/student/" + sid)
            .then(function(response) {

                if (response.status == '403') {
                    $window.location.href = '/public/views/error.html';
                } else {

                    $scope.recentCourses = response.data;
                    console.log(response.dta)


                    var metrics_tmp = check_match(sid, metrics_data);
                    console.log('metrics')
                    console.log(metrics_tmp)

                    if (metrics_tmp != null){
                        for(var i =0; i<$scope.recentCourses.length; i++){

                            var q_progress_tmp = aggregate_progress(metrics_tmp[i].games);

                            $scope.recentCourses[i].quest_progress = q_progress_tmp;
                            $scope.recentCourses[i].obj_progress = Math.round(($scope.recentCourses[i].quest_progress.num_obj/$scope.recentCourses[i].quest_progress.num_obj_total*100)*100)/100;
                            $scope.recentCourses[i].val_progress = Math.round(($scope.recentCourses[i].quest_progress.num_opoi/$scope.recentCourses[i].quest_progress.num_opoi_total*100)*100)/100;

                            $scope.recentCourses[i].chartConfig = prepareChart(metrics_tmp[i].games);

                        }
                    }

                    console.log("Recent Courses");
                    console.log($scope.recentCourses);


                }
            });



    });
