
angular.module('instructorApp')
  .controller('InstructorQuestManagementController', ['$scope', '$window', '$http', "$routeParams", "$location", "$route", "$mdStepper", "$mdDialog", "loadingService",
    function ($scope, $window, $http, $routeParams, $location, $route, $mdStepper, $mdDialog, loadingService) {
      // console.log("testing");
      // console.log($routeParams.sid);
      var instructorId = $routeParams.sid;
      var courseId = $routeParams.cid;


      $scope.orderSt = {};
      $scope.info = []
      $scope.assessments = [1, 2, 3, 4, 5];

      $scope.updateOrder = function () {
        var assignments = [];
        for (each_assignment in $scope.orderSt) {
          assignments.push({
            "assignmentID": each_assignment,
            "assignmentOrder": parseInt($scope.orderSt[each_assignment])
          });
        }
        console.log(assignments)
        $route.reload();

        $http({
          method: 'POST',
          url: "/stats/instructors/course/" + $scope.course.courseID + "/updateAssignmentOrder",
          data: { "assignments": assignments },
        }).then(function (response) {
          console.log(response.status);

          console.log(response.data);
          //var path = "/coursePage/"+$scope.instrid+"/LP/"+$scope.LPid;
          //console.log(path);
          $route.reload();
          ///coursePage/{{sid}}/LP/{{LP.LPID}}
        }
        );
      }

      $scope.createGame = function () {
        console.log("in createGame function " + $routeParams.cid, $scope.info)
        $location.path('http://google.com');
      };


      // DON'T USE THIS, use submitForm() instead

      $scope.updateQuest = function () {
        console.log("in updateQuest function " + $routeParams.cid, $scope.info)
        $http({
          method: 'POST',
          url: "/stats/instructors/updateCourse/" + $routeParams.cid,
          data: { 'coursename': $scope.course.courseName, 'desc': $scope.course.desc },
        }).then(function (response) {
          $route.reload();
        }
          , (err) => {
            console.log(err);
            $window.alert("Cannot save, try again later");
          });
      };

      $scope.removeAssignment = function (assign, assignment_id) {
        console.log("here " + assignment_id);
        var index = -1;
        for (var i in assign) {
          if (assign[i].assignmentID == assignment_id) {
            index = i;
            break;
          }
        }
        assign.splice(index, 1);
        $http({
          method: 'POST',
          url: "/stats/instructors/course/" + $routeParams.cid + "/assignment/" + assignment_id + "/remove",
          data: { "assignments": assign },
        }).then(function (response) {
          console.log(response.status);

          console.log(response.data);
          //var path = "/coursePage/"+$scope.instrid+"/LP/"+$scope.LPid;
          //console.log(path);
          $scope.removeInstruction(assignment_id)
          //$route.reload();
          ///coursePage/{{sid}}/LP/{{LP.LPID}}

        }

        );
      };

      $scope.removeInstruction = function (assignment_id) {
        console.log(assignment_id)
        $http({
          method: 'DELETE',
          url: "/stats/instructors/games/" + assignment_id + "/instruction",
        }).then(function (response) {
          console.log(response.status);
          console.log(response.data);
          $route.reload();
        }

        );
      }

      $scope.isActiveHw = function (hw_id) {
        return hw_id == $routeParams.hid;
      };
      loadingService.start();

      $http.get("/stats/instructors/" + $routeParams.sid + "/courses/" + $routeParams.cid)
        .then(function (response) {
          $scope.statuscode = response.status;
          $scope.statustext = response.statustext;
          $scope.course = response.data[0];
          console.log(response.data)
          console.log($scope.course)

          $scope.assign = response.data[0].assignments;

          //var temp = $scope.LP.courses;
          $scope.temp = $scope.assign.sort(function (a, b) {
            aOrder = parseInt(a.assignmentOrder);
            bOrder = parseInt(b.assignmentOrder);
            if (aOrder < bOrder) return -1;
            if (aOrder > bOrder) return 1;
            return 0;
          });

          var iterator = $scope.temp.entries();
          for (let e of iterator) {
            //console.log(e)
            $scope.orderSt[String(e[1].assignmentID)] = String(e[1].assignmentOrder);
          }

          //console.log($scope.assign);
          $scope.sid = $routeParams.sid;
          $scope.cid = $routeParams.cid;
          loadingService.stop();
        });

      // get game objective of games
      /* $http.get("/stats/instructors/" + $routeParams.sid + "/courses/" + $routeParams.cid)
           .then(function(response) {
               $scope.statuscode = response.status;
               $scope.statustext = response.statustext;
               $scope.course=response.data[0];

               $scope.assign = response.data[0].assignments;
               //console.log($scope.assign);
               $scope.sid = $routeParams.sid;
               $scope.cid = $routeParams.cid;

           });
*///THIS IS TO ADD FOCUS TO THIS PAGE

      $scope.concepts = [];
      $scope.treeOptions = {
        nodeChildren: "children",
        dirSelectable: true,
        injectClasses: {
          ul: "a1",
          li: "a2",
          liSelected: "a7",
          iExpanded: "a3",
          iCollapsed: "a4",
          iLeaf: "a5",
          label: "a6",
          labelSelected: "a8"
        }
      };


      // this is to get all CT concept items
      $http.get("/stats/instructors/" + $routeParams.sid + "/curricula_items")
        .then(function (response) {
          console.log("this is the data for the tree");
          console.log($routeParams.sid);
          $scope.dataForTheTree = response.data;
          console.log(typeof ($scope.dataForTheTree));
          console.log("================");
          console.log($scope.dataForTheTree);
          console.log("================");
          console.log("this the end for the tree data");

        }
        );

      $scope.reset = function () {
        $scope.LP = {};
        $scope.error = false;
      };

      $scope.showSelected = function (sel, flag, nodes) {
        $scope.selectedNode = sel;
        console.log(nodes);
        console.log("this is for testing");
        if (flag) {
          $scope.concepts.push(sel);
        } else {
          let index = $scope.concepts.indexOf(sel);
          if (index > -1) {
            $scope.concepts.splice(index, 1);
          }
        }
      };


      $scope.submitForm = function () {
        console.log(this.error);

        let updatedCourseInfo = {
          courseId: courseId,
          courseName: $scope.course.courseName,
          desc: $scope.course.desc,
          ctConcepts: $scope.concepts
        }

        $http.post("/stats/instructors/updateCourseInfo/" + instructorId, updatedCourseInfo)
          .then(function successCallback(response) {
            console.log($routeParams.sid);
            console.log(response.status);
            console.log("sage is very fun");
            alert("Saved!")

          }, function errorCallback(response) {
            console.log("get fails");
            console.log(response.status);
            alert("Something Wrong... Try Again Later!");
          });

      };

      $scope.CTConcepts = null;
      var parentCTConcepts = null;
      console.log($scope.aid);
      console.log($scope.cid);

      $http.get('/stats/games/' + $scope.aid + '/courses/' + $routeParams.cid + '/getparentctconcepts')
        .then((response) => {
          console.log("this is the focus from the parent level");
          parentCTConcepts = response.message;
          if (parentCTConcepts == undefined || parentCTConcepts == "undefined") {
            $scope.CTConcepts = "UNDEFINED";
          }
          console.log(" this is the response from he get parent cct concept");
          console.log(response.message);
          $scope.CTConcepts = "UNDEFINED";
        }, (err) => {
          // console.log("this is the error from the get the parent error");
          console.log(err);
          console.log("this is the end of the error from the get parent error ");
        });


      $scope.CTConcept = parentCTConcepts;
      $scope.dataForParenTree = parentCTConcepts;
      $scope.concepts = [];
      $scope.treeOptions = {
        nodeChildren: "children",
        dirSelectable: true,
        injectClasses: {
          ul: "a1",
          li: "a2",
          liSelected: "a7",
          iExpanded: "a3",
          iCollapsed: "a4",
          iLeaf: "a5",
          label: "a6",
          labelSelected: "a8"
        }
      };

      $http.get("/stats/instructors/" + $routeParams.sid + "/curricula_items")
        .then(function (response) {
          console.log("this is the data for the tree");
          console.log($routeParams.sid);
          $scope.dataForTheTree = response.data;
          console.log(typeof ($scope.dataForTheTree));
          console.log("================");
          console.log($scope.dataForTheTree);
          console.log("================");
          console.log("this the end for the tree data");

        }
        );

      $scope.reset = function () {
        $scope.LP = {};
        $scope.error = false;
      };

      $scope.showSelected = function (sel, flag, nodes) {
        $scope.selectedNode = sel;
        console.log(nodes);
        console.log("this is for testing");
        if (flag) {
          $scope.concepts.push(sel);
        } else {
          let index = $scope.concepts.indexOf(sel);
          if (index > -1) {
            $scope.concepts.splice(index, 1);
          }
        }
      };
      var dataFocus = null;

      $scope.submitForm = function () {
        console.log(this.error);
        dataFocus = {
          gameId: $scope.aid,
          instructorId: $scope.iid,
          ctConcepts: $scope.concepts
        };
        console.log(dataFocus);
        alert('saved!');
      }
      $scope.showFocus = false;
      $scope.showFocusModal = function () {
        $scope.showFocus = true;
        $('#focusModal').appendTo("body").modal('show');//useful
        if ($scope.class === "modal-backdrop fade in") {
          $scope.class = "modal fade in";
        }
      };
      //this is to show md-dialog
      $scope.updateAssignmentFeedback = function () {
        $mdDialog.show({
          locals: { level: "course", id: $routeParams.cid },
          controller: "InstructorUpdateAssignmentFeedbackController",
          templateUrl: "/public/views/instructor/instructor_updateAssignmentFeedback.html",
          // targetEvent: $event,
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true,
          hasBackDrop: true
        })
      };
      //add move feedback
      $scope.updateMoveFeedback = function () {
        $mdDialog.show({
          locals: { level: "course", id: $routeParams.cid },
          controller: "InstructorUpdateMoveFeedbackController",
          templateUrl: "/public/views/instructor/instructor_updateMoveFeedback.html",
          // targetEvent: $event,
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true,
          hasBackDrop: true
        })
      }

    }]);