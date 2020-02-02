angular.module('instructorApp')
    .controller('InstructorStudentsMetricsController', ['$scope', '$window', '$http', "$routeParams", "$location" ,
        function($scope, $window, $http, $routeParams, $location) {

            var selectedMissionsToDelete = [];
    var selectedRosterToDelete = [];
    $scope.model = {
      selectedClassId: null,
      classes: null,
      missions: null,
      allRoster: null,
      selectedClass: null,
      deleteMissionsEnabled: false,
      deleteRosterEnabled: false,
    };

    $scope.classSelect = function(e) {
      if ($scope.model.selectedClassId === "addClass") {
        createClassModal(e);
      } else {
        selectClass($scope.model.selectedClassId);
      }
    };

    $scope.addClassClicked = function(e) {
      createClassModal(e);
    }

    $scope.deleteClassClicked = function(e) {
      if (!$scope.model.selectedClass)
        alert("Please select a class to delete.");

      deleteClass($scope.model.selectedClass);
    }

    $scope.editClassClicked = function(e) {
      if (!$scope.model.selectedClass)
        alert("Please select a class to edit.");

      editClass($scope.model.selectedClass, e);
    }

    $scope.deleteRosterClicked = function(e) {
      if (!confirm("Are you sure you want to remove these students?"))
        return;

        var allStudents = $scope.model.selectedClass.roster;
        for (var i = 0; i < selectedRosterToDelete.length; i++) {
          _.remove(allStudents, {
            email: selectedRosterToDelete[i]
          });
        }
        allStudents = allStudents.map(function(r) {return r.email;})
        updateRoster(allStudents, null);
    }

    $scope.deleteMissionsClicked = function(e) {
      if (!confirm("Are you sure you want to remove these missions?"))
        return;
      
      var allMissions = $scope.model.selectedClass.missions;
      for (var i = 0; i < selectedMissionsToDelete.length; i++) {
        _.remove(allMissions, {
          id: selectedMissionsToDelete[i]
        });
      }
      allMissions = allMissions.map(function(mission) {return mission.id;})
      updateMissions(allMissions, null);
    }

    $scope.addMissionToClass = function(env) {
      addMissionToClass(env);
    }

    $scope.missionSelectionChanged = function(rows) {
      selectedMissionsToDelete = rows;
      $scope.model.deleteMissionsEnabled = rows.length > 0;
      $scope.$apply();
    }

    $scope.rosterSelectionChanged = function(rows) {
      selectedRosterToDelete = rows;
      $scope.model.deleteRosterEnabled = rows.length > 0;
      $scope.$apply();
    }

    $scope.importRosterClicked = function(e) {
      uploadRosterToClassModal($scope.model.selectedClass, e);
    }

    $scope.addRosterClicked = function(e) {
        console.log("what happened?");
      addRosterToClassModal($scope.model.selectClass, e);
    }

    getAllClasses();
    getAllMissions();
    getAllRoster();

    function getAllMissions()
    {
      $http.get("/stats/instructors/" + $routeParams.sid + '/missions')
        .then(function(response) {
          var missions = [];
          for (var i = 0; i < response.data.length; i++) {
            missions[i] = {
              id: response.data[i]._id,
              name: response.data[i].LPName,
              description: response.data[i].desc,
            };
          }

          $scope.model.missions = missions;
        });
    }

    function getAllRoster() {
      $http.get("/stats/instructors/" + $routeParams.sid + '/students')
        .then(function(response) {
          var roster = [];
          for (var i = 0; i < response.data.length; i++) {
            roster[i] = {
              id: response.data[i]._id,
              name: response.data[i].fullname,
              email: response.data[i].email,
            };
          }

          $scope.model.allRoster = roster;
        });
    }

    function getAllClasses(callback)
    {
      $scope.model.selectedClass = undefined;

      $http.get("/stats/instructors/" + $routeParams.sid + '/classes')
        .then(function(response) {
          var classes = [];
          for (var i = 0; i < response.data.length; i++) {
            classes[i] = {
              id: response.data[i][0].classId,
              name: response.data[i][0].className,
            };
          }
          
          if (!$scope.model.classes) {
            selectClass(classes[0].id);
          }

          $scope.model.classes = classes;

          if (typeof callback === 'function')
            callback();
        });
    }

    function getMissionById(id) {
      if (!$scope.model.missions)
        throw new Error("Missions have not been loaded.");

      for (var i = 0; i < $scope.model.missions.length; i++) {
        if ($scope.model.missions[i].id == id) {
          return $scope.model.missions[i];
        }
      } 

      throw new Error("Mission by Id {" + id + "} does not exist.");
    }

    function getRosterById(id) {
      if (!$scope.model.allRoster)
        throw new Error("Roster have not been loaded.");

      for (var i = 0; i < $scope.model.allRoster.length; i++) {
        if ($scope.model.allRoster[i].id == id) {
          return $scope.model.allRoster[i];
        }
      } 

      throw new Error("Roster by Id {" + id + "} does not exist.");
    }

    function selectClass(id)
    {
      $scope.model.selectedClassId = id;
      $http.get("/stats/instructors/" + $routeParams.sid + '/classes/' + id)
        .then(function(response) {
          var classInfo = {
            id: response.data._id,
            instructorId: response.data.instructorId,
            name: response.data.name,
            description: response.data.description,
            roster: response.data.roster,
            missions: response.data.missions,
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
    }

    function createClassModal(ev) {
      // Appending dialog to document.body to cover sidenav
      $mdDialog
        .show({
          controller: InstructorSelectCreateClassController,
          templateUrl: "/public/views/instructor/instructor_class_selectCreation.html",
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
        })
        .then(
          function() { /*hide called*/ },
          function() { /*cancel called*/ }
        );
    }
    
    function addMissionToClass(ev) {
      $mdDialog
        .show({
          controller: InstructorClassAddMissionController,
          templateUrl: "/public/views/instructor/instructor_class_addMission.html",
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          locals: {
            missions: $scope.model.missions,
            classInfo: $scope.model.selectedClass,
          },
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(
          function() { /*hide called*/ },
          function() { /*cancel called*/ }
        );
    }

    function createNewClass() {
      $mdDialog
        .show({
          controller: InstructorCreateEditClassController,
          templateUrl: "/public/views/instructor/instructor_createEditClass.html",
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          locals: {
            classInfo: undefined,
          },
        })
        .then(
          function(e) { /*hide called*/ },
          function() { /*cancel called*/ }
        );
    }

    function editClass(classInfo, domTarget) {
      $mdDialog
        .show({
          controller: InstructorCreateEditClassController,
          templateUrl: "/public/views/instructor/instructor_createEditClass.html",
          parent: angular.element(document.body),
          targetEvent: domTarget,
          clickOutsideToClose: true,
          locals: {
            classInfo: classInfo,
          },
        })
        .then(
          function() { /*hide called*/ },
          function() { /*cancel called*/ }
        );
    }

    function deleteClass(classInfo) {
      if (!confirm("Are you sure you want to delete this class?")) {
        return;
      }

      $http({
        method: "DELETE",
        url: "/stats/instructors/" + $routeParams.sid + "/classes/" + $scope.model.selectedClassId,
      }).then(function(response) {
        $scope.model.classes = null;
        $scope.model.selectedClass = null;
        $scope.model.selectedClassId = null;
        getAllClasses();
      });
    }

    function updateMissions(missions, callback) {
      $http({
        method: "PUT",
        url: "/stats/instructors/" + $routeParams.sid + "/classes/" + $scope.model.selectedClassId + "/updateMissions",
        data: {
          missions: missions,
        }
      }).then(function(response) {
        if (callback) callback();
        selectClass($scope.model.selectedClassId);
      });
    }

    function updateRoster(roster, callback) {
      $http({
        method: "PUT",
        url: "/stats/instructors/" + $routeParams.sid + "/classes/" + $scope.model.selectedClassId + "/updateRoster",
        data: {
          roster: roster,
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
          templateUrl: "/public/views/instructor/instructor_class_uploadRoster.html",
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          locals: {
            Upload: Upload,
            classInfo: classInfo,
          },
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(
          function() { /*hide called*/ },
          function() { /*cancel called*/ }
        );
    }

    function addRosterToClassModal(classInfo, ev) {
      $mdDialog
        .show({
          controller: InstructorClassAddStudentsController,
          templateUrl: "/public/views/instructor/instructor_class_addRoster.html",
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          locals: {
            roster: $scope.model.allRoster,
            classInfo: $scope.model.selectedClass,
          },
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(
          function() { /*hide called*/ },
          function() { /*cancel called*/ }
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
          templateUrl: "/public/views/instructor/instructor_class_copy.html",
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          locals: {
            allClasses: $scope.model.classes
          }
        })
        .then(
          function(e) { /*hide called*/ },
          function() { /*cancel called*/ }
        );
    }

    function InstructorClassAddMissionController($scope, $mdDialog, missions, classInfo) {
      
      var clonedMissions = JSON.parse(JSON.stringify(missions)); // clone missions
      // Remove missions already added to class
      if (classInfo.missions) {
        for (var i = 0; i < classInfo.missions.length; i++) {
          _.remove(clonedMissions, {
            id: classInfo.missions[i].id
          });
        }
      }
      
      $scope.title = "Add Missions";
      $scope.missions = clonedMissions;

      $scope.cancel = function() {
        $mdDialog.hide();
      };

      var selectedMissionIds = [];
      $scope.selectedRowCallback = function(rows){
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
      $scope.title = "Class Information";
      $scope.class = {
        name: isNewClass ? "" : classInfo.name,
        description: isNewClass ? "" : classInfo.description,
      };

      $scope.cancel = function() {
        $mdDialog.hide();
      };

      $scope.submit = function() {
        $http({
          method: isNewClass ? "POST" : "PUT",
          url: isNewClass 
                ? "/stats/instructors/classes/" + $routeParams.sid 
                : "/stats/instructors/" + $routeParams.sid + "/classes/" + classInfo.id + "/updateInfo",
          data: {
            name: $scope.class.name,
            description: $scope.class.description,
          }
        }).then(function(response) {

          $mdDialog.hide();
          
          // Reload classes
          getAllClasses(function() {
            if (isNewClass)
              selectClass(response.data.message._id);
            else
              selectClass(response.data.message.inserted._id);
          })
        });
      };
    }

    function InstructorCopyClassController($scope, $mdDialog, allClasses) {
      $scope.class = {
        name: "",
        description: "",
        copyClassId: allClasses[0].id,
        copyRosters: true,
        copyMissions: true,
        classes: allClasses,
      };

      $scope.cancel = function() {
        $mdDialog.hide();
      };

      $scope.submit = function() {
        $http({
          method: "POST",
          url: "/stats/instructors/" + $routeParams.sid + "/classes/copyClass",
          data: {
            name: $scope.class.name,
            description: $scope.class.description,
            copyClassId: $scope.class.copyClassId,
            copyRosters: $scope.class.copyRosters,
            copyMissions: $scope.class.copyMissions,
          }
        }).then(function(response) {

          $mdDialog.hide();

          // Reload classes
          getAllClasses(function() {
            selectClass(response.data.message._id);
          })
        });
      };
    }

    function InstructorClassUploadRosterController($scope, $mdDialog, Upload, classInfo) {
      $scope.title = "Upload Roster";
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
        $http.put('/stats/instructors/'+$routeParams.sid+'/classes/'+classInfo.id+'/uploadRoster', fd, {
            headers: {'Content-Type': undefined}
        })
        .success(function(response, r2, r3) {
          alert('File Uploaded!');
          $mdDialog.hide();
          selectClass(classInfo.id);
        })
        .error(function(){
          alert('An unexpected error occurred.');
          $mdDialog.hide();
        });
      };
    }

    function InstructorClassAddStudentsController($scope, $mdDialog, roster, classInfo) {
      
      var clonedRoster = JSON.parse(JSON.stringify(roster)); // clone roster
      // Remove roster already added to class
      if (classInfo.roster) {
        for (var i = 0; i < classInfo.roster.length; i++) {
          _.remove(clonedRoster, {
            email: classInfo.roster[i].email
          });
        }
      }
      
      $scope.title = "Add Roster";
      $scope.roster = clonedRoster;

      $scope.cancel = function() {
        $mdDialog.hide();
      };

      var selectedRosterIds = [];
      $scope.selectedRowCallback = function(rows){
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

            $scope.test = "students";

            var path = $location.path().split('/');
            $scope.path = path[1];
            $scope.sid = path[3];

            var sid = path[3];


            function missionCT_cal(enrolled_data){

                var tmp_res = [0, 0, 0, 0, 0, 0, 0];
                var num_games = 0;

                for (var i = 0; i < enrolled_data.length; i++) {

                    for (var j = 0; j < enrolled_data[i].games.length; j++) {
                        num_games += 1;
                        var g_ct_tmp = enrolled_data[i].games[j].g_ct;
                        for (var k = 0; k < g_ct_tmp.length; k++) {
                            tmp_res[k] += g_ct_tmp[k];
                        }
                    }
                }
                for (var k = 0; k < g_ct_tmp.length; k++) {
                    tmp_res[k] /= num_games;
                }

                return tmp_res;
            }


            function aggregateCT(raw_data){

                for(var i = 0; i<raw_data.length;i++){
                    for(var j=0; j<raw_data[i].enrolled.length;j++){
                        raw_data[i].enrolled[j].missionCT = missionCT_cal(raw_data[i].enrolled[j].missionCT);
                    }
                }
                return raw_data;
            }


            $http.get("studentmetrics/"+ sid)
                .then(function (response) {
                    if (response.status == '403') {
                        $window.location.href = '/public/views/error.html';
                    } else {
                        console.log(response);

                        $scope.raw_data_students = response.data;

                        var data_students = aggregateCT($scope.raw_data_students);
                        var data_students_chart = data2chart_s(data_students);
                        $scope.chart = prepareChart_Ins (data_students_chart);



                    }
                });


            function data2chart_s(data_students){
                var title = "Students CT score";
                var series_data = [];
                for(var i = 0; i < data_students.length; i++){
                    series_data[i] = {};
                    series_data[i].name = data_students[i].studentName;
                    series_data[i].data = [0,0,0,0,0,0,0];
                    for (var j = 0; j<data_students[i].enrolled.length;j++){
                        for (var k = 0; k<series_data[i].data.length; k++){
                            series_data[i].data[k] += data_students[i].enrolled[j].missionCT[k];
                        }
                    }
                    for (var k = 0; k<series_data[i].data.length; k++){
                        series_data[i].data[k] /= data_students[i].enrolled.length;
                    }
                }
                var res = {
                    "title":title,
                    "series_data":series_data
                }
                return res;
            }

            function prepareChart_Ins  (metrics_data_ins) {

                var series_data = metrics_data_ins.series_data;

                chart ={
                    chart: {
                        polar: true,
                        type: 'line'
                        // width: 300
                    },

                    title: {
                        text: metrics_data_ins.title,
                        x: -70
                    },

                    pane: {
                        size: '80%'
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


                    series: series_data
                };
                return chart;

            }

        }]);
