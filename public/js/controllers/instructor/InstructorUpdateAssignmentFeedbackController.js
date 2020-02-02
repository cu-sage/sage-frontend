angular.module("instructorApp")
.controller("InstructorUpdateAssignmentFeedbackController", [
    "$scope", 
    "$mdDialog",
    "$http",
    "$window",
    "level",
    "id",
    InstructorUpdateAssignmentFeedbackController
]);


function InstructorUpdateAssignmentFeedbackController($scope, $mdDialog, $http, $window, level, id) {
    
    var geturl = "/stats/" + level + "/" + id;
    var addUrl = "/stats/" + level + "/" + id + "/addassignmentfeedbacks";
    var deleteUrl = "/stats/" + level + "/" + id + "/deleteassignmentfeedbacks";
    // TODO:

    $scope.cancel = function() {
        $scope.users = null;
        $scope.assignmentFeedbackInput = [];
        $mdDialog.cancel();
    };


    $http.get(geturl)
    .then((response) => {
        if (!response.data.assignmentFeedbacks) {
            $scope.currentFeedbacks = {feedbacks: []};
        } else {
            console.log(response.data.assignmentFeedbacks);
            $scope.currentFeedbacks = {feedbacks: response.data.assignmentFeedbacks};
        }
    }, (err) => {
        console.log(err);
        $window.alert("Error when retrieving database");
    })
    // make your new feedbacks into this variable======
    // var newFeedbacks = [];
    //
    // for (let i = 0; i < $scope.moveFeedbackInput.length; i++) {
    //     newFeedbacks[i] ={type: $scope.assignmentResult, content:$scope.moveFeedbackInput[i]};
    // }



    ///=====
    $scope.developing = false;
    $scope.basic = false;
    $scope.proficient = false;
    $scope.showEmoji=function(condition){

        if(condition.type == "developing"){
            $scope.emoji = '&#128522';
        } else if (condition.type == "proficient") {
            $scope.emoji = '&#128525';
        } else {
            $scope.emoji = '&#128528';
        }


        return condition;
    };
    // Step 2: DO THIS LATER
    $scope.deleteSingleFeedback = function ($event, i) {
        // delete feedback from view, COMPLETE HERE
        // YUAN: We need to remove that feedback from $scope.currentFeedback
        // for example $scope.currentFeedbacks.pop(...)
        $scope.currentFeedbacks.feedbacks.splice(i,1);

        let update = {
            feedbacks: $scope.currentFeedbacks.feedbacks // no need to modify, in this case we're going to replace the whole feedbacks with currentFeedback.
        }

        // complete by Anda
        $http.post(deleteUrl, update)
        .then((response) => {
            $scope.currentFeedbacks.feedbacks = response.data.assignmentFeedbacks;
        }, (err) => {
            // TODO LATER DISCUSS
            console.log(err);
        })
    }
// THIS IS TO GET INFO FROM BROWSER
    $scope.assignmentFeedbackInput = []; // use the name in Line: 53-57
    $scope.enterAssFeedback = function(keyEvent) {
        if (keyEvent.which === 13) {
            try {
                console.log($scope.users.feedback);
                console.log($scope.users);
            } catch (error) {
                $scope.users = {};
                $scope.users.feedback = "Warning: input null";
            }
            let user = angular.copy($scope.users);
            $scope.assignmentFeedbackInput.push(user);
        }
    };
    $scope.addFeedback = function() {
        try {
            console.log($scope.users.feedback);
            console.log($scope.users);
        } catch (error) {
            $scope.users = {};
            $scope.users.feedback = "Warning: input null";
        }
        let user = angular.copy($scope.users);
        $scope.assignmentFeedbackInput.push(user);
    };


    $scope.deleteFeedback = function() {
        $scope.users = null;
        console.log("user size" + $scope.assignmentFeedbackInput.length);
        $scope.assignmentFeedbackInput.pop();
        console.log("usersizeNew" + $scope.assignmentFeedbackInput.length);
        console.log($scope.assignmentFeedbackInput);
    };


    $scope.removeFeedback = function(i) {
        $scope.assignmentFeedbackInput.splice(i,1);
    };
    // END OF INFO FROM BROWSWER
    let newFeedbacksFromInput = [];
    $scope.submitFeedback = function() {
        if ($scope.assignmentFeedbackInput.length === 0) {
            $window.alert("Please enter at least one feedback");
        }
        // make your new feedbacks into this variable======
        for (let i = 0; i < $scope.assignmentFeedbackInput.length; i++) {
            newFeedbacksFromInput[i] ={type: $scope.assignmentResult, content:$scope.assignmentFeedbackInput[i].feedback};
        }
        let newFeedbacks = {
            feedbacks: newFeedbacksFromInput
        }

        $http.post(addUrl, newFeedbacks)
        .then((response) => {
            console.log("======DEBUG=======");
            console.log(response.data);
            $scope.currentFeedbacks.feedbacks = response.data.assignmentFeedbacks;
            $scope.assignmentFeedbackInput = [];
        }, (err) => {
            console.log(err);
            $window.alert("Error when saving feedbacks, try again later");
        })
    }
}