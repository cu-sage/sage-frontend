var controller = angular.module('controllers', []);

controller.controller('DashboardController', function($scope, $routeParams, $timeout, service){
    var oldResult;
    $scope.isCollapsed = true;
    $scope.studentName = $routeParams.sid.charAt(0).toUpperCase() + $routeParams.sid.substr(1).toLowerCase();
    
    pollData();
    
    function pollData() {
        service.list(
            $routeParams.sid,
            $routeParams.aid,
            function(results) {
                $scope.results = results;
                
                if(oldResult == null || oldResult.toString() !== results.toString()) {
                    parseForAlerts(results);
                }
                oldResult = results;
                
                updateProgressBar(results);
                
                $timeout(pollData, 1000)
            }
        );
    }
    
    function updateProgressBar(results) {
        var passCount = 0;
        for(var i = 0; i < results.length; i++) {
            var result = results[i];
            if(result.pass) {
                passCount++;
            }
        }
        var progress = (passCount / results.length) * 100;
        
        if(progress < 50 ){
            $scope.type = "warning";
            $scope.barMessage = "Basic";
        } else if(progress < 100) {
            $scope.type = "info";
            $scope.barMessage = "Developing";
        } else {
            $scope.type = "success";
            $scope.barMessage = "Proficient";
            
        }
        
        $scope.dynamic = progress;
    }
    
    function dismissAlert() {
        $scope.isCollapsed = true;
    }
    
    function displayAlert(msg) {
        $scope.alertMsg = msg;
        $timeout(dismissAlert, 3000);
        $scope.isCollapsed = false;
    }
    
    function parseForAlerts(results) {
        for(var i = 0; i < results.length; i++) {
            var result = results[i];
            var actions = result.actions;
            
            if(actions != null) {
                for(var j = 0; j < actions.length; j++) {
                    var action = actions[j];
                    
                    if(action.type == "action_block_include") {
                        displayAlert("Block \"" + action.command + "\" has been enabled!");
                    }
                }
            }
        }
    }
});