angular.module('instructorApp').controller('InstructorClassController', [
  '$scope',
  '$window',
  '$http',
  '$routeParams',
  '$mdDialog',
  'Upload',
  function($scope, $window, $http, $routeParams, $mdDialog, Upload) {
    var selectedMissionsToDelete = [];
    var selectedRosterToDelete = [];

    var instructorId = $routeParams.sid;

    $scope.model = {
      selectedClassId: null,
      classes: null,
      missions: null,
      allRoster: null,
      selectedClass: null,
      deleteMissionsEnabled: false,
      deleteRosterEnabled: false
    };

    $scope.classSelect = function(e) {
      if ($scope.model.selectedClassId === 'addClass') {
        createClassModal(e);
      } else {
        selectClass($scope.model.selectedClassId);
      }
    };

    $scope.addClassClicked = function(e) {
      createClassModal(e);
    };

    $scope.deleteClassClicked = function(e) {
      if (!$scope.model.selectedClass)
        alert('Please select a class to delete.');

      deleteClass($scope.model.selectedClass);
    };

    $scope.editClassClicked = function(e) {
      if (!$scope.model.selectedClass) alert('Please select a class to edit.');

      editClass($scope.model.selectedClass, e);
    };

    $scope.deleteRosterClicked = function(e) {
      if (!confirm('Are you sure you want to remove these students?')) return;

      var allStudents = $scope.model.selectedClass.roster;
      for (var i = 0; i < selectedRosterToDelete.length; i++) {
        _.remove(allStudents, {
          email: selectedRosterToDelete[i]
        });
      }
      allStudents = allStudents.map(function(r) {
        return r.email;
      });
      updateRoster(allStudents, null);
    };

    $scope.deleteMissionsClicked = function(e) {
      if (!confirm('Are you sure you want to remove these missions?')) return;

      var allMissions = $scope.model.selectedClass.missions;
      for (var i = 0; i < selectedMissionsToDelete.length; i++) {
        _.remove(allMissions, {
          id: selectedMissionsToDelete[i]
        });
      }
      allMissions = allMissions.map(function(mission) {
        return mission.id;
      });
      updateMissions(allMissions, null);
    };
    // This is to delete the feedback template from the nabvar
    $scope.deleteFeedbacksClicked = function(e) {
      if (!confirm('Are you sure you want to remove this feedback template?'))
        return;

      var allFeedbacks = $scope.model.selectedClass.feedbacks;
      for (var i = 0; i < selectedFeedbacksToDelete.length; i++) {
        _.remove(allFeedbacks, {
          id: selectedFeedbacksToDelete[i]
        });
      }
      allFeedbacks = allFeedbacks.map(function(feedback) {
        return feedback.id;
      });
      updateFeedbacks(allFeedbacks, null);
    };
    ////////////////////////////////////////////////////////////////////

    $scope.addMissionToClass = function(env) {
      addMissionToClass(env);
    };
    ////this is to add feedbacks///////////////////////////////////////////
    $scope.addFeedbackToClass = function(env) {
      //addFeedbackToClass(env);
      addFeedbackToClass(env);
    };
    ///////////////////////////////////////////////////////////////////////
    $scope.missionSelectionChanged = function(rows) {
      selectedMissionsToDelete = rows;
      $scope.model.deleteMissionsEnabled = rows.length > 0;
      $scope.$apply();
    };

    $scope.rosterSelectionChanged = function(rows) {
      selectedRosterToDelete = rows;
      $scope.model.deleteRosterEnabled = rows.length > 0;
      $scope.$apply();
    };
    //////////////////this is to mark the selection changed///////////////////
    $scope.feedbackSelectionChanged = function(rows) {
      selectedFeedbacksToDelete = rows;
      $scope.model.deleteFeedbacksEnabled = rows.length > 0;
      $scope.$apply();
    };
    ///////////////////////////////////////////////////////////////////////////

    /////////////this is to add move feedback to the game level///////////////
    //this is to add and delete the assignment feedback for each game
    $scope.userFeedback = [];
    $scope.enterAssFeedback = function(keyEvent) {
      if (keyEvent.which === 13) {
        try {
          console.log($scope.users.feedback);
          console.log($scope.users);
        } catch (error) {
          $scope.users = {};
          $scope.users.feedback = 'Warning: input null';
        }
        let user = angular.copy($scope.users);
        $scope.userFeedback.push(user);
      }
    };
    $scope.addFeedback = function() {
      try {
        console.log($scope.users.feedback);
        console.log($scope.users);
      } catch (error) {
        $scope.users = {};
        $scope.users.feedback = 'Warning: input null';
      }
      let user = angular.copy($scope.users);
      $scope.userFeedback.push(user);
    };
    $scope.deleteFeedback = function() {
      $scope.users = null;
      console.log('user size' + $scope.userFeedback.length);
      $scope.userFeedback.pop();
      console.log('usersizeNew' + $scope.userFeedback.length);
      console.log($scope.userFeedback);
    };
    $scope.removeFeedback = function(i) {
      $scope.userFeedback.splice(i, 1);
    };
    //////////////////////////////////////////////////////////////////
    ///////move feedback add and delete//////////////////////////////
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
    $scope.pushInArray = function() {
      try {
        console.log($scope.users.comment);
        console.log($scope.users);
      } catch (error) {
        $scope.users = {};
        $scope.users.comment = 'Warning: input null';
      }
      var user = angular.copy($scope.users);
      $scope.moveFeedbackInput.push(user);
      var temp = $scope.moveFeedbackInput;
      $scope.users = null;
    };
    //this three function is to add add confirm and delete operations to each input box
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
      $scope.users = null;
    };
    $scope.pushInArray3 = function() {
      $scope.users = null;
      console.log('user size' + $scope.moveFeedbackInput.length);
      $scope.moveFeedbackInput.pop();
      console.log('usersizeNew' + $scope.moveFeedbackInput.length);
      console.log($scope.moveFeedbackInput);
    };
    $scope.removeComment = function(i) {
      $scope.moveFeedbackInput.splice(i, 1);
    };

    // TODO:
    // pz2244 need to do
    // 2019/10/26 need to make the UI prettier
    // 2019/11/02 finished
    var moveFeedback = [];
    $scope.currentFeedback = [];
    function fetchFeedback(id) {
      $http
        .post('/stats/instructors/' + instructorId + '/fetchclassfeedback/', {
          classId: id
        })
        .then(
          feedback => {
            console.log('feedback \n');
            console.log(feedback.data.message);
            $scope.currentFeedback = feedback.data.message.moveFeedback;
          },
          err => {
            console.log(err);
          }
        );
    }

    //default value for move result
    $scope.moveResult = 'neutral';
    $scope.submitMoveFeedback = function() {
      for (let i = 0; i < $scope.moveFeedbackInput.length; i++) {
        moveFeedback[i] = {
          type: $scope.moveResult,
          content: $scope.moveFeedbackInput[i]
        };
      }
      console.log('test submit');
      console.log(moveFeedback);
      // moveFeedback = {
      //   // TODO: get feedback from $scope variable (done)
      // }

      // No Need To Modify Here
      let newFeedback = {
        classId: $scope.model.selectedClassId,
        moveFeedback: moveFeedback
      };

      $http
        .post(
          '/stats/instructors/' + instructorId + '/updateclassfeedback/',
          newFeedback
        )
        .then(
          feedback => {
            // COMPLETE HERE: add feedback to the right pane so that instructor can see it.
            console.log('feedback \n');
            console.log(feedback.data.message);
            $scope.currentFeedback = feedback.data.message;
          },
          err => {
            $window.alert(
              'Something wrong with the server, feedback not saved'
            );
          }
        );
    };

    $scope.deleteMoveFeedback = function($event, i) {
      $scope.currentFeedback.splice(i, 1);
      let updatedMoveFeedback = {
        classId: $scope.model.selectedClassId,
        moveFeedback: $scope.currentFeedback
      };

      $http
        .post(
          '/stats/instructors/' + instructorId + '/deleteclassfeedback/',
          updatedMoveFeedback
        )
        .then(
          feedback => {
            // COMPLETE HERE: add feedback to the right pane so that instructor can see it.
            console.log('feedback \n');
            console.log(feedback.data);
            $scope.currentFeedback = feedback.data.moveFeedback;
          },
          err => {
            $window.alert(
              'Something wrong with the server, feedback not saved'
            );
          }
        );
    };

    //////////////////////////////////////////////////////////////////
    $scope.importRosterClicked = function(e) {
      uploadRosterToClassModal($scope.model.selectedClass, e);
    };

    $scope.addRosterClicked = function(e) {
      addRosterToClassModal($scope.model.selectClass, e);
    };

    getAllClasses();
    getAllMissions();
    getAllRoster();
    ////
    getAllFeedbacks();
    // fetchFeedback();
    ////
    function getAllMissions() {
      $http
        .get('/stats/instructors/' + $routeParams.sid + '/missions')
        .then(function(response) {
          console.log(response.data);
          var missions = [];
          for (var i = 0; i < response.data.length; i++) {
            missions[i] = {
              id: response.data[i]._id,
              name: response.data[i].LPName,
              description: response.data[i].desc
            };
          }

          $scope.model.missions = missions;
        });
    }

    function getAllRoster() {
      $http
        .get('/stats/instructors/' + $routeParams.sid + '/students')
        .then(function(response) {
          var roster = [];
          for (var i = 0; i < response.data.length; i++) {
            roster[i] = {
              id: response.data[i]._id,
              name: response.data[i].fullname,
              email: response.data[i].email
            };
          }

          $scope.model.allRoster = roster;
        });
    }

    function getAllClasses(callback) {
      $scope.model.selectedClass = undefined;

      $http
        .get('/stats/instructors/' + $routeParams.sid + '/classes')
        .then(function(response) {
          var classes = [];
          for (var i = 0; i < response.data.length; i++) {
            classes[i] = {
              id: response.data[i][0].classId,
              name: response.data[i][0].className
            };
          }

          if (!$scope.model.classes) {
            selectClass(classes[0].id);
          }

          $scope.model.classes = classes;

          if (typeof callback === 'function') callback();
        });
    }
    ///////get allfeedbacks//////////////
    function getAllFeedbacks() {
      $http
        .get('/stats/instructors/' + $routeParams.sid + '/missions')
        .then(function(response) {
          console.log(response.data);
          var missions = [];
          for (var i = 0; i < response.data.length; i++) {
            missions[i] = {
              id: response.data[i]._id,
              name: response.data[i].LPName,
              description: response.data[i].desc
            };
          }

          $scope.model.feedbacks = feedbacks;
        });
    }
    //////////////////////////////////////////////////////
    function getMissionById(id) {
      if (!$scope.model.missions)
        throw new Error('Missions have not been loaded.');

      for (var i = 0; i < $scope.model.missions.length; i++) {
        if ($scope.model.missions[i].id == id) {
          return $scope.model.missions[i];
        }
      }
      throw new Error('Mission by Id {' + id + '} does not exist.');
    }

    function getRosterById(id) {
      if (!$scope.model.allRoster)
        throw new Error('Roster have not been loaded.');

      for (var i = 0; i < $scope.model.allRoster.length; i++) {
        if ($scope.model.allRoster[i].id == id) {
          return $scope.model.allRoster[i];
        }
      }

      throw new Error('Roster by Id {' + id + '} does not exist.');
    }
    ///////////////////////get feedbacks by id////////////////////////////
    function getFeedbackById(id) {
      if (!$scope.model.feedbacks)
        throw new Error('Missions have not been loaded.');

      for (var i = 0; i < $scope.model.feedbacks.length; i++) {
        if ($scope.model.feedbacks[i].id == id) {
          return $scope.model.feedbacks[i];
        }
      }
      throw new Error('Feedback by Id {' + id + '} does not exist.');
    }
    //////////////////////////////////////////////////////
    function selectClass(id) {
      $scope.model.selectedClassId = id;
      $http
        .get('/stats/instructors/' + $routeParams.sid + '/classes/' + id)
        .then(function(response) {
          var classInfo = {
            id: response.data._id,
            instructorId: response.data.instructorId,
            name: response.data.name,
            description: response.data.description,
            roster: response.data.roster,
            missions: response.data.missions
            // moveFeedback: response.data.moveFeedback
          };

          if (classInfo.missions) {
            for (var i = 0; i < classInfo.missions.length; i++) {
              classInfo.missions[i] = getMissionById(classInfo.missions[i]);
            }
          }

          if (classInfo.roster) {
            for (var i = 0; i < classInfo.roster.length; i++) {
              classInfo.roster[i] = getRosterById(classInfo.roster[i]);
            }
          }

          $scope.model.selectedClass = classInfo;
        });
      fetchFeedback(id);
    }

    function createClassModal(ev) {
      // Appending dialog to document.body to cover sidenav
      $mdDialog
        .show({
          controller: InstructorSelectCreateClassController,
          templateUrl:
            '/public/views/instructor/instructor_class_selectCreation.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true
        })
        .then(
          function() {
            /*hide called*/
          },
          function() {
            /*cancel called*/
          }
        );
    }

    function addMissionToClass(ev) {
      $mdDialog
        .show({
          controller: InstructorClassAddMissionController,
          templateUrl:
            '/public/views/instructor/instructor_class_addMission.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          locals: {
            missions: $scope.model.missions,
            classInfo: $scope.model.selectedClass
          },
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(
          function() {
            /*hide called*/
          },
          function() {
            /*cancel called*/
          }
        );
    }
    ///////////////////////add feedback to class////////////////////////
    function addFeedbackToClass(ev) {
      $mdDialog
        .show({
          controller: InstructorClassAddMissionController,
          templateUrl:
            '/public/views/instructor/instructor_class_addFeedback.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          locals: {
            missions: $scope.model.missions,
            classInfo: $scope.model.selectedClass
          },
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(
          function() {
            /*hide called*/
          },
          function() {
            /*cancel called*/
          }
        );
    }
    ///////////////////////////////////////
    function createNewClass() {
      $mdDialog
        .show({
          controller: InstructorCreateEditClassController,
          templateUrl:
            '/public/views/instructor/instructor_createEditClass.html',
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          locals: {
            classInfo: undefined
          }
        })
        .then(
          function(e) {
            /*hide called*/
          },
          function() {
            /*cancel called*/
          }
        );
    }

    function editClass(classInfo, domTarget) {
      $mdDialog
        .show({
          controller: InstructorCreateEditClassController,
          templateUrl:
            '/public/views/instructor/instructor_createEditClass.html',
          parent: angular.element(document.body),
          targetEvent: domTarget,
          clickOutsideToClose: true,
          locals: {
            classInfo: classInfo
          }
        })
        .then(
          function() {
            /*hide called*/
          },
          function() {
            /*cancel called*/
          }
        );
    }

    function deleteClass(classInfo) {
      if (!confirm('Are you sure you want to delete this class?')) {
        return;
      }

      $http({
        method: 'DELETE',
        url:
          '/stats/instructors/' +
          $routeParams.sid +
          '/classes/' +
          $scope.model.selectedClassId
      }).then(function(response) {
        $scope.model.classes = null;
        $scope.model.selectedClass = null;
        $scope.model.selectedClassId = null;
        getAllClasses();
      });
    }

    function updateMissions(missions, callback) {
      $http({
        method: 'PUT',
        url:
          '/stats/instructors/' +
          $routeParams.sid +
          '/classes/' +
          $scope.model.selectedClassId +
          '/updateMissions',
        data: {
          missions: missions
        }
      }).then(function(response) {
        if (callback) callback();
        selectClass($scope.model.selectedClassId);
      });
    }
    /////UPDATE THE FEEDBACK/////////////////////
    function updateFeedbacks(feedbacks, callback) {
      $http({
        method: 'PUT',
        url:
          '/stats/instructors/' +
          $routeParams.sid +
          '/classes/' +
          $scope.model.selectedClassId +
          '/updateMissions',
        data: {
          missions: feedbacks
        }
      }).then(function(response) {
        if (callback) callback();
        selectClass($scope.model.selectedClassId);
      });
    }
    ////////////////////////////////////////////
    function updateRoster(roster, callback) {
      $http({
        method: 'PUT',
        url:
          '/stats/instructors/' +
          $routeParams.sid +
          '/classes/' +
          $scope.model.selectedClassId +
          '/updateRoster',
        data: {
          roster: roster
        }
      }).then(function(response) {
        if (callback) callback();
        selectClass($scope.model.selectedClassId);
      });
    }

    function uploadRosterToClassModal(classInfo, ev) {
      $mdDialog
        .show({
          controller: InstructorClassUploadRosterController,
          templateUrl:
            '/public/views/instructor/instructor_class_uploadRoster.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          locals: {
            Upload: Upload,
            classInfo: classInfo
          },
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(
          function() {
            /*hide called*/
          },
          function() {
            /*cancel called*/
          }
        );
    }

    function addRosterToClassModal(classInfo, ev) {
      $mdDialog
        .show({
          controller: InstructorClassAddStudentsController,
          templateUrl:
            '/public/views/instructor/instructor_class_addRoster.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          locals: {
            roster: $scope.model.allRoster,
            classInfo: $scope.model.selectedClass
          },
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(
          function() {
            /*hide called*/
          },
          function() {
            /*cancel called*/
          }
        );
    }

    function copyClass() {
      if (!$scope.model.classes || $scope.model.classes.length === 0) {
        // If there are no classes, we create a new one
        createNewClass();
        return;
      }
      $mdDialog
        .show({
          controller: InstructorCopyClassController,
          templateUrl: '/public/views/instructor/instructor_class_copy.html',
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          locals: {
            allClasses: $scope.model.classes
          }
        })
        .then(
          function(e) {
            /*hide called*/
          },
          function() {
            /*cancel called*/
          }
        );
    }

    function InstructorClassAddMissionController(
      $scope,
      $mdDialog,
      missions,
      classInfo
    ) {
      var clonedMissions = JSON.parse(JSON.stringify(missions)); // clone missions
      // Remove missions already added to class
      if (classInfo.missions) {
        for (var i = 0; i < classInfo.missions.length; i++) {
          _.remove(clonedMissions, {
            id: classInfo.missions[i].id
          });
        }
      }

      $scope.title = 'Add Missions';
      $scope.missions = clonedMissions;

      $scope.cancel = function() {
        $mdDialog.hide();
      };

      var selectedMissionIds = [];
      $scope.selectedRowCallback = function(rows) {
        selectedMissionIds = [];
        for (var i = 0; i < rows.length; i++) {
          selectedMissionIds.push(rows[i]);
        }
      };

      $scope.submit = function() {
        // Also want to add missions already in class (since this is a UPDATE function)
        for (var i = 0; i < classInfo.missions.length; i++) {
          selectedMissionIds.push(classInfo.missions[i].id);
        }

        updateMissions(selectedMissionIds, function() {
          $mdDialog.hide();
        });
      };
    }

    function InstructorSelectCreateClassController($scope, $mdDialog) {
      $scope.cancel = function() {
        $mdDialog.hide();
      };

      $scope.copy = function() {
        $mdDialog.hide();
        copyClass();
      };

      $scope.new = function() {
        $mdDialog.hide();
        createNewClass();
      };
    }

    function InstructorCreateEditClassController($scope, $mdDialog, classInfo) {
      var isNewClass = !classInfo;
      $scope.title = 'Class Information';
      $scope.class = {
        name: isNewClass ? '' : classInfo.name,
        description: isNewClass ? '' : classInfo.description
      };

      $scope.cancel = function() {
        $mdDialog.hide();
      };

      $scope.submit = function() {
        $http({
          method: isNewClass ? 'POST' : 'PUT',
          url: isNewClass
            ? '/stats/instructors/classes/' + $routeParams.sid
            : '/stats/instructors/' +
              $routeParams.sid +
              '/classes/' +
              classInfo.id +
              '/updateInfo',
          data: {
            name: $scope.class.name,
            description: $scope.class.description
          }
        }).then(function(response) {
          $mdDialog.hide();

          // Reload classes
          getAllClasses(function() {
            if (isNewClass) selectClass(response.data.message._id);
            else selectClass(response.data.message.inserted._id);
          });
        });
      };
    }

    function InstructorCopyClassController($scope, $mdDialog, allClasses) {
      $scope.class = {
        name: '',
        description: '',
        copyClassId: allClasses[0].id,
        copyRosters: true,
        copyMissions: true,
        classes: allClasses
      };

      $scope.cancel = function() {
        $mdDialog.hide();
      };

      $scope.submit = function() {
        $http({
          method: 'POST',
          url: '/stats/instructors/' + $routeParams.sid + '/classes/copyClass',
          data: {
            name: $scope.class.name,
            description: $scope.class.description,
            copyClassId: $scope.class.copyClassId,
            copyRosters: $scope.class.copyRosters,
            copyMissions: $scope.class.copyMissions
          }
        }).then(function(response) {
          $mdDialog.hide();

          // Reload classes
          getAllClasses(function() {
            selectClass(response.data.message._id);
          });
        });
      };
    }

    function InstructorClassUploadRosterController(
      $scope,
      $mdDialog,
      Upload,
      classInfo
    ) {
      $scope.title = 'Upload Roster';
      $scope.files = undefined;
      $scope.finishDisabled = false;

      $scope.cancel = function() {
        $mdDialog.hide();
      };

      $scope.submit = function() {
        $scope.finishDisabled = true;
        var file = $scope.files;
        var fd = new FormData();
        fd.append('file', file);
        $http
          .put(
            '/stats/instructors/' +
              $routeParams.sid +
              '/classes/' +
              classInfo.id +
              '/uploadRoster',
            fd,
            {
              headers: { 'Content-Type': undefined }
            }
          )
          .success(function(response, r2, r3) {
            alert('File Uploaded!');
            $mdDialog.hide();
            selectClass(classInfo.id);
          })
          .error(function() {
            alert('An unexpected error occurred.');
            $mdDialog.hide();
          });
      };
    }

    function InstructorClassAddStudentsController(
      $scope,
      $mdDialog,
      roster,
      classInfo
    ) {
      var clonedRoster = JSON.parse(JSON.stringify(roster)); // clone roster
      // Remove roster already added to class clonded
      if (classInfo.roster) {
        for (var i = 0; i < classInfo.roster.length; i++) {
          _.remove(clonedRoster, {
            email: classInfo.roster[i].email
          });
        }
      }

      $scope.title = 'Add Roster';
      $scope.roster = clonedRoster;

      $scope.cancel = function() {
        $mdDialog.hide();
      };

      var selectedRosterIds = [];
      $scope.selectedRowCallback = function(rows) {
        selectedRosterIds = [];
        for (var i = 0; i < rows.length; i++) {
          selectedRosterIds.push(rows[i]);
        }
      };

      $scope.submit = function() {
        // Also want to add roster already in class (since this is a UPDATE function)
        for (var i = 0; i < classInfo.roster.length; i++) {
          selectedRosterIds.push(classInfo.roster[i].email);
        }

        updateRoster(selectedRosterIds, function() {
          $mdDialog.hide();
        });
      };
    }
  }
]);
