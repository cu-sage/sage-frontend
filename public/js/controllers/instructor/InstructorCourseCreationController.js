angular
  .module("instructorApp")
  .controller("InstructorCourseCreationController", [
    "$scope",
    "$window",
    "$http",
    "$routeParams",
    "$location",
    function($scope, $window, $http, $routeParams, $location) {
      //$scope.course={};
      $scope.badge = {};
      $scope.instructorID = $routeParams.sid;

      $scope.reset = function() {
        $scope.course = {};
        $scope.badge = {};

        //$scope.course.desc="";
      };

      var featureslist = [];

      $scope.orderSt = {};
      $scope.temp = [];

      // $scope.newc={
      // 	coursename: $scope.course.name,
      // 	body : $scope.course.desc,
      // 	features:featureslist,
      // 	ctconcepts:[]
      // };
      $scope.concepts = [];
      // $scope.concepts = {
      //         "concepts" : [
      //             {
      //                 "name" : "A",
      //                 "topics" : ["a","b"]
      //             },
      //             {
      //                 "name" : "B",
      //                 "topics" : ["c","d"]
      //             }
      //         ]
      //     }
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

      $scope.showSelected = function(sel, flag, nodes) {
        $scope.selectedNode = sel;
        console.log(nodes);
        if (flag) {
          $scope.concepts.push(sel);
        } else {
          index = $scope.concepts.indexOf(sel);
          if (index > -1) {
            $scope.concepts.splice(index, 1);
          }
        }
        console.log($scope.concepts);
      };

      $http
        .get("/stats/instructors/" + $routeParams.sid + "/curricula_items")
        .then(function(response) {
          console.log(response);
          $scope.dataForTheTree = response.data;
        });

      $scope.b_create = function() {
        $http({
          method: "POST",
          url: "/stats/instructors/createBadges",
          data: {
            B_name: $scope.badge.name,
            B_desc: $scope.badge.desc,
            B_img: $scope.badge.img,
            B_issuer: $scope.badge.issuer
          }
        }).then(function(response) {
          console.log(response.status);

          console.log(response.data.message._id);
          if ((response.status = 200)) {
            var c1id = response.data.message._id;
            var i1id = $routeParams.sid;
          }
        });

        var new_path = "/librarires/" + $routeParams.sid + "/badges";
        $location.path(new_path);
      };

      $scope.showUpdateAssFeedbackModal = function() {
        $("#UpdateAssFeedbackModal")
          .appendTo("body")
          .modal("show"); //useful
        if ($scope.class === "modal-backdrop fade in") {
          $scope.class = "modal fade in";
        }
      };
      $scope.showUpdateMoveFeedbackModal = function() {
        $("#UpdateMoveFeedbackModal")
          .appendTo("body")
          .modal("show"); //useful
        if ($scope.class === "modal-backdrop fade in") {
          $scope.class = "modal fade in";
        }
      };

      var moveFeedbacks = [];
      var assignmentFeedbacks = [];
      $scope.submitAssignmentFeedback = function() {
        featurelist = [];
        ctconceptslist = [];

        console.log("in cntrlr");
        console.log($location.path());

        // TIAN: COMPLETE THIS TWO LOOPS
        for (let i = 0; i < $scope.moveFeedbackInput.length; i++) {
          moveFeedbacks[i] = {
            type: $scope.moveResult,
            content: $scope.moveFeedbackInput[i].comment
          };
        }
        console.log("this is move feedback");
        console.log(moveFeedbacks);
        for (let i = 0; i < $scope.assignmentFeedbackInput.length; i++) {
          assignmentFeedbacks[i] = {
            type: $scope.assignmentResult,
            content: $scope.assignmentFeedbackInput[i].feedback
          };
        }
        console.log(assignmentFeedbacks);
        let featureOfBadge = {
          B_name: $scope.badge.name,
          B_desc: $scope.badge.desc,
          B_img: $scope.badge.img,
          B_issuer: $scope.badge.issuer
        };
        // FILL ALL THIS VARS,  with $scope value
        var newCourse = {
          courseName: $scope.course.name, //replace this
          desc: null, // replace this
          instructorID: $scope.instructorID,
          assignments: [],
          features: [], // replace this
          ctConcepts: $scope.concepts, // replace this
          assignmentFeedbacks: assignmentFeedbacks,
          moveFeedbacks: moveFeedbacks
        };

        console.log(newCourse);

        $http({
          method: "POST",
          url: "/stats/instructors/createCourse/" + $routeParams.sid,
          data: newCourse
        }).then(
          function(response) {
            // <<<<<<< Updated upstream
            //                     console.log(response.status);
            //
            //                     console.log(response.data.message._id);
            //                     if (response.status=200){
            //                         var c1id=response.data.message._id;
            //                         var i1id=$routeParams.sid;
            //                         var path = "/coursePage/"+i1id+"/course/"+c1id+"/createAssignment";
            //                         console.log(path);
            //                         $location.path(path);
            //                         //"#/coursePage/{{sid}}/LP/{{LP.LPID}}"
            //                         //"#/coursePage/{{sid}}/course/{{cid}}/createAssignment"
            //                     }
            //
            //                     }
            // =======
            console.log("when create new quest");
            console.log(response.status);
            console.log(response.data.message._id);
            if ((response.status = 200)) {
              var c1id = response.data.message._id;
              var i1id = $routeParams.sid;
              var path =
                "/coursePage/" + i1id + "/course/" + c1id + "/createAssignment";
              console.log(path);
              $location.path(path);
            }
          }

          // >>>>>>> Stashed changes
        );
      };

      ///this is to add the assginment feedback
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
        $scope.assignmentFeedbackInput.splice(i, 1);
      };
      //this is to control the move feedback
      $scope.moveFeedbackInput = [];
      $scope.enterMoveFeedback = function(keyEvent) {
        if (keyEvent.which === 13) {
          try {
            console.log($scope.users.comment);
            console.log($scope.users);
          } catch (error) {
            $scope.users = {};
            $scope.users.comment = "Warning: input null";
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
          $scope.users.comment = "Warning: input null";
        }
        let user = angular.copy($scope.users);
        $scope.moveFeedbackInput.push(user);
      };
      $scope.removeComment = function(i) {
        $scope.moveFeedbackInput.splice(i, 1);
      };
    }
  ]);
