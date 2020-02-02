angular.module('studentApp')
    .controller('StudentMetricsController', function(Upload, $window, $location, $scope, $http) {

        var path = $location.path().split('/');
        console.log("student path:", path)
        $scope.path = path[1];
        $scope.sid = path[2];

        var sid = path[2];
        //var sid = "5ab2ac69dae3cc15233c2805";
        

        var metrics_data;

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
        //
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

// 
        $http.get("smetrics/student/" + sid)
            .then(function(response) {

                if (response.status == '403') {
                    $window.location.href = '/public/views/error.html';
                } else {
                    console.log("smetrics response",response)

                    // var data = response.data;
                    // console.log("Read Metrics Data From Mlab!!!!!!!!sid:", sid);
                    // console.log(data);
                    metrics_data = response.data;
                    // $scope.metricsdata = response.data;
                    $scope.studentid = response.data.studentID;
                    $scope.mname = response.data.missionName;

                    $scope.chartConfig = prepareChart_mission(metrics_data);
                }
            });


        $scope.recommendedCourses = [];
        $scope.recentCourses = [];
        $scope.badgesEarned = [];
        $scope.studentBadges = [];


        function prepareChart_mission (metrics_data) {

            var series_data = [];
            for(var i = 0; i<metrics_data.enrolled.length;i++){

                series_data[i] = {};
                series_data[i].name = metrics_data.enrolled[i].q_name;

                var q_ct_sum_tmp = [0,0,0,0,0,0,0];
                for (var j = 0; j<metrics_data.enrolled[i].games.length;j++){
                    var g_ct_tmp = metrics_data.enrolled[i].games[j].g_ct;
                    for (var k = 0; k< g_ct_tmp.length;k++){
                        q_ct_sum_tmp[k] += g_ct_tmp[k];
                    }
                }
                for (var k = 0; k< g_ct_tmp.length;k++){
                    q_ct_sum_tmp[k] /= metrics_data.enrolled[i].games.length;
                }
                series_data[i].data = q_ct_sum_tmp;
            }


            chart ={
                chart: {
                    polar: true,
                    //borderWidth: 5,
                    marginLeft: 5,
                    type: 'line'
                    // width: 300
                },

                title: {
                    text: 'Quest CT scores',
                    x: -70
                },

                size: {
                    width: '70%'
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


                legend: {
                    align: 'right',
                    verticalAlign: 'top',
                    y: 70,
                    layout: 'vertical'
                },

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





        // $http.get("recentCourses/student/" + sid)
        $http.get("coursesEnrolled/student/" + sid)
            .then(function(response) {

                if (response.status == '403') {
                    $window.location.href = '/public/views/error.html';
                } else {

                    $scope.recentCourses = response.data;
              

                    //
                    // var metrics_tmp = check_match(sid, metrics_data);
                    // if (metrics_tmp != null){
                    //     for(var i =0; i<$scope.recentCourses.length; i++){
                    //
                    //             var q_progress_tmp = aggregate_progress(metrics_tmp[i].games);
                    //
                    //             $scope.recentCourses[i].quest_progress = q_progress_tmp;
                    //             $scope.recentCourses[i].obj_progress = Math.round(($scope.recentCourses[i].quest_progress.num_obj/$scope.recentCourses[i].quest_progress.num_obj_total*100)*100)/100;
                    //             $scope.recentCourses[i].val_progress = Math.round(($scope.recentCourses[i].quest_progress.num_opoi/$scope.recentCourses[i].quest_progress.num_opoi_total*100)*100)/100;
                    //
                    //             $scope.recentCourses[i].chartConfig = prepareChart(metrics_tmp[i].games);
                    //
                    //     }
                    // }

                    console.log("Recent Courses");
                    console.log($scope.recentCourses);
                    


                }
            });


        $http.get("badgesearned/student/" + sid)
            .then(function(response) {
                console.log("badgesearned response:",response);

                if (response.status == '403') {
                    $window.location.href = '/public/views/error.html';
                } else {
        
                    $scope.badgesEarned = response.data.badgesearned;
                    $scope.mouseOver = function (data) {
                        $scope.description = data[1];
                    };
                    $scope.mouseLeft = function (data) {
                        $scope.description = '';
                    };
                    console.log("in badges");
                    console.log($scope.badgesEarned);
        
        
        
                }
            });

        $http.get("studentbadges/student/" + sid)
            .then(function(response) {
                console.log("student metrics response:",response);
                var badge_src_name = [];

                if (response.status == '403') {
                    $window.location.href = '/public/views/error.html';
                } else {
                    console.log("student + badges in controller");
                    console.log(response);
                    for(var i=0; i<response.data.length;i++){
                        tmp = [response.data[i].src, response.data[i].description];
                        badge_src_name.push(tmp);
                    }
                    $scope.studentBadges = badge_src_name;

                    $scope.mouseOver = function (data) {
                        $scope.description1 = data[1];
                    };
                    $scope.mouseLeft = function (data) {
                        $scope.description1 = '';
                    };
                    // console.log("in badges");
                    // console.log($scope.studentBadges);
                }
            });

        // $http.get('https://api.badgr.io/v2/issuers/MAbeM5P7DJn_xL9g/badgeclasses',{
        //     headers: {
        //         "Authorization": "3b89637508b4773ef8ead98efb0a26adb169370d"
        //     }
        // }).success(function(response){
        //
        //     console.log("Badgr API RESPONSE");
        //     console.log(response);
        //
        // }).error(function () {
        //
        //     alert("Access Badgr API Error!");
        //
        //
        // });

        //FOR CONNECTING TO THE BADGR API USING A TOKEN ASSOCIATED WITH A TEST ACCOUNT
        /*
        var request = new XMLHttpRequest();
        request.open('GET', 'https://api.badgr.io/v2/issuers/MAbeMJQbQmy5P7DJn_xL9g/badgeclasses');
        request.setRequestHeader('Authorization', 'Token 3b89637508b4773ef8ead98efb0a26adb169370d');

        request.onreadystatechange = function () {
            if(request.readyState === 4 && request.status === 200) {
                console.log(request.responseText);
            }
        };
        request.send();
        */




    });
