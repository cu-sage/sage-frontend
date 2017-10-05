angular.module('researcherApp')
    .controller('ResearcherClusterController', function($window, $location, $scope) {

    var path = $location.path().split('/');
    $scope.path = path[1];
    $scope.rid = path[2];
    var cl = this;

    cl.cluster = function() {
        console.log('starting clustering...');
        $.ajax({
            type: "POST",
            url: "/researcher/cluster"
        });
    };

    cl.stop_cluster = function() {
        console.log('stopping clustering...');
        $.ajax({
            type: "POST",
            url: "/researcher/stop"
        });
    };
});
