angular
  .module('instructorApp')
  .controller('InstructorUpdateMoveFeedbackController', [
    '$scope',
    '$mdDialog',
    '$http',
    '$window',
    'level',
    'id',
    InstructorUpdateMoveFeedbackController
  ]);

function InstructorUpdateMoveFeedbackController(
  $scope,
  $mdDialog,
  $http,
  $window,
  level,
  id
) {
  var getUrl = '/stats/' + level + '/' + id + '/getmovefeedbacks';
  var addUrl = '/stats/' + level + '/' + id + '/addmovefeedbacks';
  var deleteUrl = '/stats/' + level + '/' + id + '/deletemovefeedbacks';

  $http.get(getUrl).then(
    response => {
      console.log('hhhhh');
      console.log(response.data);
      if (!response.data.message.moveFeedbacks) {
        console.log('wowowowowo');
        $scope.currentFeedbacks = { feedbacks: [] };
      } else {
        $scope.currentFeedbacks = {
          feedbacks: response.data.message.moveFeedbacks
        };
      }
    },
    err => {
      console.log(err);
      $window.alert('Error when retrieving database');
    }
  );

  if (level === 'assignment') {
    $scope.level = 'game';
  } else {
    $scope.level = 'quest';
  }

  $scope.moveFeedbackInput = [];
  $scope.enterMoveFeedback = function(keyEvent) {
    if (keyEvent.which === 13) {
      try {
        console.log($scope.users.comment);
        console.log($scope.users);
      } catch (error) {
        $scope.users = {};
        $scope.users.comment = 'Warning: input null';
      }
      let user = angular.copy($scope.users);
      $scope.moveFeedbackInput.push(user);
      $scope.users = null;
    }
  };

  $scope.pushInArray2 = function() {
    try {
      console.log($scope.users.comment);
      console.log($scope.users);
    } catch (error) {
      $scope.users = {};
      $scope.users.comment = 'Warning: input null';
    }
    let user = angular.copy($scope.users);
    $scope.moveFeedbackInput.push(user);
    let temp = $scope.moveFeedbackInput;
  };
  $scope.removeComment = function(i) {
    $scope.moveFeedbackInput.splice(i, 1);
  };
  $scope.cancel = function() {
    $scope.users = {};
    $scope.moveFeedbackInput = [];
    $mdDialog.cancel();
  };

  // make your new feedbacks into this variable====== COMPLETE HERE
  $scope.newFeedbacks = null;

  ///=====

  // This block is for instructor can delete assignemt feedback
  $scope.deleteSingleFeedback = function($event, i) {
    // YUAN: We need to remove that feedback from $scope.currentFeedback
    // for example $scope.currentFeedbacks.pop(...)

    $scope.currentFeedbacks.feedbacks.splice(i, 1);
    let updatedFeedbacks = {
      feedbacks: $scope.currentFeedbacks.feedbacks
    };

    $http.post(deleteUrl, updatedFeedbacks).then(
      response => {
        $scope.currentFeedbacks.feedbacks = response.data.moveFeedbacks;
      },
      err => {
        console.log(err);
      }
    );
  };

  var newMoveFeedbacks = [];
  $scope.submitFeedback = function() {
    if ($scope.moveFeedbackInput.length === 0) {
      $window.alert('Please enter at least one feedback');
    }

    for (let i = 0; i < $scope.moveFeedbackInput.length; i++) {
      newMoveFeedbacks[i] = {
        type: $scope.moveResult,
        content: $scope.moveFeedbackInput[i].comment
      };
    }
    let newFeedbacks = {
      feedbacks: newMoveFeedbacks
    };

    console.log(newFeedbacks);
    $http.post(addUrl, newFeedbacks).then(
      response => {
        $scope.currentFeedbacks.feedbacks = response.data.message;
        $scope.moveFeedbackInput = [];
      },
      err => {
        $window.alert('Error when saving feedbacks, try again later');
      }
    );
  };
}
