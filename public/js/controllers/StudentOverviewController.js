angular.module('studentApp')
// Directive for generic chart, pass in chart options
    .directive('hcBarChart', [ '$window', function ($window) {
        return {
            restrict: 'E',
            template: '<div></div>',
            scope: {
                data: '='
            },
            link: function (scope, element) {
                console.log(scope);
                console.log(scope.barData);
                //while (scope.barData === undefined) {
                    console.log(scope.barData);
                    var chart = Highcharts.chart(element[0], {
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: 'Homework Scores'
                        },
                        colors: ['rgba(0,204,204,0.5)', 'rgba(102,204,0,0.5)'],
                        xAxis: {
                            categories: ['HW1', 'HW2', 'HW3', 'HW4', 'HW5'],
                            crosshair: true
                        },
                        yAxis: {
                            min: 0,
                            max: 100,
                            title: {
                                text: 'Score'
                            }
                        },
                        tooltip: {
                            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                            footerFormat: '</table>',
                            shared: true,
                            useHTML: true
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            }
                        },
                        series: scope.data
                    });
                    //console.log("chart");
                    //console.log(chart);
                    var canvas = angular.element(document.querySelector('#bar'))[0];
                    chart.setSize(canvas.offsetWidth, canvas.offsetHeight);
                    //console.log("Width:" + chartWidth);
                    //console.log("Height:" + chartHeight);

                    angular.element($window).bind('resize', function () {

                        canvas = angular.element(document.querySelector('#bar'))[0];
                        chart.setSize(canvas.offsetWidth, canvas.offsetHeight);
                        //chart.redraw();
                        //chart.reflow();

                        //console.log("detected window resize");
                    });
                //}
            }
        };
    }])
    // Directive for pie charts, pass in title and data only
    .directive('hcSpiderwebChart', ['$window', function ($window) {
        return {
            restrict: 'E',
            template: '<div></div>',
            scope: {
                title: '@',
                data: '='
            },
            link: function (scope, element) {
                console.log(scope);
                console.log(scope.data);
                var chart = Highcharts.chart(element[0], {
                    chart: {
                        polar: true,
                        type: 'area'
                    },
                    title: {
                        text: 'Assessment',
                        x: -80
                    },
                    colors: ['rgba(0,204,204,0.5)', 'rgba(102,204,0,0.5)', 'rgba(102,102,255,0.5)', 'rgba(255,128,0,0.5)', 'rgba(255,255,0,0.5)'],
                    pane: {
                        size: '75%'
                    },
                    xAxis: {
                        categories: ["Readability", "Reusability", "Documentation", "Coding", "Delivery", "Sleep"],
                        tickmarkPlacement: 'on',
                        lineWidth: 0
                    },
                    yAxis: {
                        gridLineInterpolation: 'polygon',
                        lineWidth: 0,
                        min: 0,
                        max:10
                    },
                    tooltip: {
                        shared: true,
                        pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
                    },
                    legend: {
                        align: 'right',
                        verticalAlign: 'bottom',
                        // y: 70,
                        layout: 'horizontal'
                    },
                    plotOptions: {
                        series: {
                            fillOpacity: 0.1
                        }
                    },
                    /*
                    events: {
                        click: function () {
                            $('#report').html('click on xAxis label');
                        },
                        contextmenu: function () {
                            $('#report').html('context menu on xAxis label');
                        }
                    }*/

                    series: scope.data

                });

                var canvas = angular.element( document.querySelector( '#spiderweb' ) )[0];
                chart.setSize(canvas.offsetWidth, canvas.offsetHeight);
                //console.log("Width:" + chartWidth);
                //console.log("Height:" + chartHeight);

                angular.element($window).bind('resize', function(){

                    canvas = angular.element( document.querySelector( '#spiderweb' ) )[0];
                    chart.setSize(canvas.offsetWidth, canvas.offsetHeight);
                });

            }
        };
    }])
    .controller('StudentOverviewController', ['$scope', '$window', '$http', "$routeParams", "$location", function($scope, $window, $http, $routeParams, $location) {
        console.log("testing");

        $http.get("/stats/students/" + $routeParams.sid)
            .then(function(response) {
                $scope.statuscode = response.status;
                $scope.statustext = response.statustext;
                $scope.student = response.data;
                $scope.sid = $routeParams.sid;
                $scope.barDataLoaded = false;
                $scope.spiderwebDataLoaded = false;
                //console.log(response.data);
                //console.log($scope);

                $scope.barData = [];
                for (i = 0; i < $scope.student.number_of_courses; i++) {
                    $scope.barData.push({
                        name: "Individual",
                        data: $scope.student.courses[i].individual
                    }, {
                        name: "Average",
                        data: $scope.student.courses[i].average
                    });
                }
                $scope.barDataLoaded = true;

                $scope.spiderwebData = [];
                for (i = 0; i < $scope.student.number_of_courses; i++) {
                    //for (j = 0; j < $scope.student.courses[i].number_of_hw; j++) {
                        for(k = 0; k < $scope.student.courses[i].assessments[0].number_of_assessments; k++) {
                            $scope.spiderwebData.push({
                                name: $scope.student.courses[i].assessments[0].data[k].name,
                                data: $scope.student.courses[i].assessments[0].data[k].data
                            });
                        }
                    //}
                }
                $scope.spiderwebDataLoaded = true;

            });

    }]);