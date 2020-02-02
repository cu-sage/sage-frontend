angular
  .module("instructorApp")
  .controller("InstructorGameCreationController", [
    "$scope",
    "$window",
    "$http",
    "$routeParams",
    "$location",
    "$mdStepper",
    "$mdDialog",
    "loadingService",
    function(
      $scope,
      $window,
      $http,
      $routeParams,
      $location,
      $mdStepper,
      $mdDialog,
      loadingService
    ) {
      //$scope.course={};
      $scope.instructorId = $routeParams.sid;
      $scope.courseId = $routeParams.cid;

      $scope.initHide = true;
      $scope.defaultPathOfImg = "/public/images/logo.png";
      $scope.defaultImgWidth = 394;
      $scope.defaultImgHeight = 191;

      /* ========= CT Concept Control ======== */
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

      $scope.showSelected = function(sel, flag, nodes) {
        $scope.selectedNode = sel;
        // console.log(nodes);
        if (flag) {
          $scope.concepts.push(sel);
        } else {
          index = $scope.concepts.indexOf(sel);
          if (index > -1) {
            $scope.concepts.splice(index, 1);
          }
        }
        // console.log("========Select new Concepts ========" )
        // console.log($scope.concepts);
      };

      // get all CT concepts from database
      $http
        .get("/stats/instructors/" + $routeParams.sid + "/curricula_items")
        .then(function(response) {
          console.log(response);
          $scope.dataForTheTree = response.data;
        });

      /* ========= Move Feedback Control ======== */
      var moveFeedback = [];
      // TODO:(done)

      /* ========= Assignement Feedback Control ======== */
      var assignmentFeedback = [];
      // TODO:(done)
      // for (var i = 0; i < $scope.moveFeedbackInput.length; i++) {
      //     $scope.moveFeedback[i] ={moveFeedbackType: $scope.moveResult,moveFeedbackString:$scope.moveFeedbackInput[i]};
      // }
      //
      // for (let i = 0; i < $scope.assignmentFeedbackInput.length; i++) {
      //     $scope.assignmentFeedback[i] ={assignmentFeedbackType: $scope.assignmentResult,assignmentFeedbackString:$scope.assignmentFeedbackInput[i]};
      // }

      $scope.reset = function() {
        $scope.assignment = {};
        //$scope.course.desc="";
      };
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

      $http
        .get("/stats/instructors/" + $routeParams.sid + "/curricula_items")
        .then(function(response) {
          // console.log(response);
          console.log($routeParams.sid);
          console.log("=======");
          $scope.dataForTheTree = response.data;
          // $scope.dataForTheTree = [
          //     { "name" : "Joe", "age" : "21", "children" : [
          //             { "name" : "Smith", "age" : "42", "children" : [] },
          //             { "name" : "Gary", "age" : "21", "children" : [
          //                     { "name" : "Jenifer", "age" : "23", "children" : [
          //                             { "name" : "Dani", "age" : "32", "children" : [] },
          //                             { "name" : "Max", "age" : "34", "children" : [] }
          //                         ]}
          //                 ]}
          //         ]},
          //     { "name" : "Albert", "age" : "33", "children" : [] },
          //     { "name" : "Ron", "age" : "29", "children" : [] }
          // ];
          console.log(typeof $scope.dataForTheTree);
          console.log($scope.dataForTheTree);
        });

      $scope.reset = function() {
        $scope.LP = {};
        $scope.error = false;
      };

      $scope.showSelected = function(sel, flag, nodes) {
        $scope.selectedNode = sel;
        console.log(nodes);
        console.log("this is for testing");
        if (flag) {
          $scope.concepts.push(sel);
        } else {
          index = $scope.concepts.indexOf(sel);
          if (index > -1) {
            $scope.concepts.splice(index, 1);
          }
        }
      };

      //

      // $scope.submitForm = function (isValid) {
      //     console.log (this.error);
      //     newc = {
      //         coursename: $scope.LP.name,
      //         desc: $scope.LP.desc,
      //         features: [],
      //         ctconcepts: []
      //     };
      //     $http({
      //         method: 'POST',
      //         url: "/stats/instructors/createLP/" + $routeParams.sid,
      //         data: { 'LPname': $scope.LP.name, 'desc': $scope.LP.desc, 'features': $scope.LP.feat, 'ctconcepts': $scope.concepts },
      //     }).then(function successCallback(response) {
      //             console.log(response.status);
      //             console.log(response.data.message._id);
      //             if (response.status = 200) {
      //                 var c1id = response.data.message._id;
      //                 var i1id = $routeParams.sid;
      //                 var path = "/coursePage/" + i1id + "/LP/" + c1id;
      //                 console.log(path);
      //                 $location.path(path);
      //             }
      //         }, function errorCallback(response) {
      //             $scope.error = true;
      //             console.log($scope.error);
      //         }
      //
      //     );

      // };

      $scope.steps = [
        {
          heading: "",
          description: "",
          img: $scope.defaultPathOfImg,
          imgWidth: $scope.defaultImgWidth,
          imgHeight: $scope.defaultImgHeight
        }
      ];

      $scope.previewImg = {
        img: $scope.defaultPathOfImg,
        imgWidth: $scope.defaultImgWidth,
        imgHeight: $scope.defaultImgHeight
      };

      $scope.orders = "1 2 3 4".split(" ").map(function(order) {
        return { n: order };
      });

      $scope.gameType = "parsons,parsons (no feedback no palette),cvg"
        .split(",")
        .map(function(type) {
          return { n: type };
        });

      $scope.addSpecificStep = function(ev) {
        console.log(ev);
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog
          .prompt()
          .title(
            "Which step you want add? (At most " +
              (Number($scope.steps.length) + 1) +
              ")"
          )
          .targetEvent(ev)
          .ok("Confirm")
          .cancel("Cancel");

        $mdDialog.show(confirm).then(
          function(result) {
            //is number or not
            if (!isNaN(result) && angular.isNumber(+result)) {
              console.log(result + " is a number");
              var result = Number(result);
              if (
                result > Number($scope.steps.length) + 1 ||
                !Number.isInteger(result) ||
                result <= 0
              ) {
                //show error dialog
                $mdDialog.show(
                  $mdDialog
                    .alert()
                    .parent(
                      angular.element(document.querySelector("#popupContainer"))
                    )
                    .clickOutsideToClose(true)
                    .title("Alert")
                    .textContent("Cound not add step " + result)
                    .ok("Got it!")
                );
              } else {
                //add step
                var newStep = {
                  heading: "",
                  description: "",
                  img: "/public/images/logo.png",
                  imgWidth: "",
                  imgHeight: ""
                };
                $scope.steps.splice(result - 1, 0, newStep);

                //show dialog
                $mdDialog.show(
                  $mdDialog
                    .alert()
                    .parent(
                      angular.element(document.querySelector("#popupContainer"))
                    )
                    .clickOutsideToClose(true)
                    .title("Alert")
                    .textContent("Add Step Successfully")
                    .ok("Got it!")
                );
              }
            } else {
              console.log(result + " is not a number");
              //show error dialog
              $mdDialog.show(
                $mdDialog
                  .alert()
                  .parent(
                    angular.element(document.querySelector("#popupContainer"))
                  )
                  .clickOutsideToClose(true)
                  .title("Alert")
                  .textContent(result + " is not a number")
                  .ok("Got it!")
              );
            }
          },
          function() {}
        );
      };

      $scope.addStep = function() {
        var newStep = {
          heading: "",
          description: "",
          img: $scope.defaultPathOfImg,
          imgWidth: "",
          imgHeight: ""
        };
        $scope.steps.push(newStep);
      };

      $scope.imageUpload = function(event) {
        var files = event.target.files;
        console.log(event);
        var id = event.target.parentNode.children[0].id;
        if (id == "previewImg") {
          $scope.stepOrder = "-1";
        } else {
          $scope.stepOrder = id.split("img")[1] + "";
        }
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          var reader = new FileReader();
          reader.onload = $scope.imageIsLoaded;
          reader.readAsDataURL(file);
        }
      };

      $scope.imageIsLoaded = function(e) {
        console.log(e);
        $scope.$apply(function() {
          var i = new Image();
          var imgWidth;
          var imgHeight;
          //set width and height
          i.onload = function() {
            imgWidth = i.width;
            imgHeight = i.height;
            if ($scope.stepOrder == "-1") {
              $scope.previewImg.imgWidth = imgWidth;
              $scope.previewImg.imgHeight = imgHeight;
              console.log($scope.previewImg);
            } else {
              $scope.steps[$scope.stepOrder].imgWidth = imgWidth;
              $scope.steps[$scope.stepOrder].imgHeight = imgHeight;
              console.log($scope.steps[$scope.stepOrder]);
            }
          };
          if ($scope.stepOrder == "-1") {
            document.querySelector("#previewImg").src = e.target.result;
            $scope.previewImg.img = e.target.result;
          } else {
            $scope.steps[$scope.stepOrder].img = e.target.result;
          }
          i.src = e.target.result;
        });
      };

      $scope.previousStep = function() {
        var steppers = $mdStepper("preview-step");
        steppers.back();
      };

      $scope.nextStep = function() {
        var steppers = $mdStepper("preview-step");
        steppers.next();
      };

      $scope.preview = function() {
        $scope.initHide = false;
      };

      $scope.closePreviewArea = function() {
        $scope.initHide = true;
      };

      $scope.deleteStep = function(index) {
        console.log("Remove: " + index);
        $scope.steps.splice(index - 1, 1);
        console.log($scope.steps);
      };

      $scope.designGame = function() {
        $scope.assignment = {};
        newc = {
          order: $scope.assgn.order
        };
        console.log(newc);

        $http({
          method: "POST",
          url:
            "/stats/instructors/" +
            $routeParams.sid +
            "/course/" +
            $routeParams.cid +
            "/createAssignment/",
          data: newc
        }).then(function(response) {
          console.log(response);
          // $scope.aid=(response.data.message.testid);
          console.log($scope.aid);
          var i1id = $routeParams.sid;
          var c1id = $routeParams.cid;
          var path =
            "/coursePage/" +
            i1id +
            "/course/" +
            c1id +
            "/createAssignment/" +
            $scope.aid +
            "/design";
          console.log(path);
          $location.path(path);
          $location.search("type", $scope.assgn.gameType);
          $location.search("steps", $scope.steps);
        });
      };

      $scope.haveImgInSteps = function() {
        for (var i = 0; i < $scope.steps.length; i++) {
          if ($scope.steps[i].img == $scope.defaultPathOfImg) {
            return false;
          }
        }
        return true;
      };
      $scope.moveResult = "neutral";
      $scope.assignmentResult = "medium";
      $scope.submitForm = function() {
        console.log($scope.assgn.gameType);
        //default value

        for (let i = 0; i < $scope.moveFeedbackInput.length; i++) {
          moveFeedback[i] = {
            type: $scope.moveResult,
            content: $scope.moveFeedbackInput[i].comment
          };
        }
        console.log(moveFeedback);
        for (let i = 0; i < $scope.assignmentFeedbackInput.length; i++) {
          assignmentFeedback[i] = {
            type: $scope.assignmentResult,
            content: $scope.assignmentFeedbackInput[i].feedback
          };
        }
        console.log(assignmentFeedback);

        newAssignment = {
          name: $scope.assgn.name,
          order: $scope.assgn.order,
          courseId: $routeParams.cid,
          ctConcepts: $scope.concepts,
          moveFeedbacks: moveFeedback,
          assignmentFeedbacks: assignmentFeedback,
          creatorId: $routeParams.sid,
          type: $scope.assgn.gameType
        };

        // newc={
        //     assignmentName: $scope.assgn.name,
        //     order: $scope.assgn.order,
        //     type: $scope.assgn.gameType,

        // };
        console.log("DEBUG");
        console.log(newAssignment);

        //$scope.isLoading = true;
        loadingService.start();
        console.log(newAssignment);
        $http
          .post(
            "/stats/instructors/" +
              $routeParams.sid +
              "/course/" +
              $routeParams.cid +
              "/createAssignment/",
            newAssignment
          )
          .then(
            response => {
              console.log(response);
              console.log(response.data.message.assignmentID);
              $scope.aid = response.data.message.assignmentID;
              console.log("CREATED ASSIGNMENT ID: ");
              console.log($scope.aid);
              loadingService.stop();
              // $scope.createInstr();
              $window.alert("New Assignment Saved");
              const location =
                "#/coursePage/" +
                $routeParams.sid +
                "/course/" +
                $routeParams.cid +
                "/Assignment/" +
                $scope.assgn.order +
                "/id/" +
                $scope.aid +
                "/Game";
              window.location = location;
            },
            error => {
              loadingService.stop();
              $window.alert("Something Wrong: Try Again Later");
            }
          );

        // $http({
        //     method: 'POST',
        //     url: "/stats/instructors/"+$routeParams.sid+"/course/"+$routeParams.cid+"/createAssignment/",
        //     data: newAssignment,
        // }).then(function(response) {
        //         //console.log(response.status);
        //         //console.log(response.data.message);
        //         console.log(response);
        //         $scope.aid=(response.data.message.testid);
        //         console.log($scope.aid);
        //         $scope.createInstr();
        // });
      };

      $scope.getBase64Image = function(img, idx) {
        //idx==-1 meaning preview icon
        //otherwise it is the step's index
        var width;
        var height;
        if (idx == -1) {
          width = $scope.previewImg.imgWidth;
          height = $scope.previewImg.imgHeight;
        } else {
          width = $scope.steps[idx].imgWidth;
          height = $scope.steps[idx].imgHeight;
        }
        //console.log(width +" "+ height);
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
        var dataURL = canvas.toDataURL("image/" + ext);
        return dataURL;
      };

      $scope.createInstr = function() {
        //console.log($scope.steps.length);
        var length = $scope.steps.length;
        $scope.content = [];
        $scope.addStepContent(0, length);
      };

      $scope.addStepContent = function(i, length) {
        if (i < length) {
          //console.log($scope.steps[i].heading);
          //console.log($scope.steps[i].description);
          var currentImg = new Image();
          currentImg.src = $scope.steps[i].img;
          currentImg.onload = function() {
            //console.log($scope.getBase64Image(currentImg,i));
            $scope.newContent = {
              heading: $scope.steps[i].heading,
              other: [
                {
                  description: $scope.steps[i].description,
                  image: $scope.getBase64Image(currentImg, i)
                }
              ]
            };
            $scope.content.push($scope.newContent);
            //console.log($scope.newContent);
            $scope.addStepContent(i + 1, length);
          };
        }

        if (i == length) {
          $scope.addPreviewContent();
        }
      };

      $scope.addPreviewContent = function() {
        var previewImg = new Image();
        //console.log($scope.previewImg.img)
        previewImg.src = $scope.previewImg.img;
        //console.log($scope.assgn.gameType);
        previewImg.onload = function() {
          $scope.newInstr = {
            name: $scope.instr.name,
            content: JSON.stringify($scope.content),
            img: $scope.getBase64Image(previewImg, -1),
            role: "student",
            gameId: $scope.aid, // this is 0 for instructor instruction
            gameName: $scope.assgn.name
          };
          //console.log($scope.newInstr)
          $scope.postInstr();
        };
      };

      $scope.postInstr = function() {
        $http({
          method: "POST",
          url: "/stats/instructors/games/" + $scope.aid + "/createInstr/create",
          data: JSON.stringify($scope.newInstr)
        }).then(function(response) {
          //finish loading
          //$mdDialog.cancel();
          loadingService.stop();
          $scope.showConfirmationDialog();
          console.log(response.data);
          console.log(response.data.gameName);
        });
      };

      $scope.showConfirmationDialog = function() {
        $scope.alert = $mdDialog
          .alert()
          .parent(angular.element(document.querySelector("#popupContainer")))
          .clickOutsideToClose(true)
          .title("Alert")
          .textContent("Your instruction is saved")
          .ok("Got it!");

        $mdDialog.show($scope.alert);
        //.finally(function() {
        //    alert = undefined;
        //    $window.location.reload();
        //});
      };
      /////////////this is to add move feedback to the game level///////////////
      //this is to add and delete the assignment feedback for each game
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
      //////////////////////////////////////////////////////////////////
      ////////////this is to add and delete move feedback//////////////
      //////////////////////////////////////////////////////////////////
      $scope.moveFeedbackInput = []; // use the name in Line: 53-57
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
      $scope.pushInArray = function() {
        try {
          console.log($scope.users.comment);
          console.log($scope.users);
        } catch (error) {
          $scope.users = {};
          $scope.users.comment = "Warning: input null";
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
          $scope.users.comment = "Warning: input null";
        }
        let user = angular.copy($scope.users);
        $scope.moveFeedbackInput.push(user);
        let temp = $scope.moveFeedbackInput;
      };
      $scope.pushInArray3 = function() {
        $scope.users = null;
        console.log("user size" + $scope.moveFeedbackInput.length);
        $scope.moveFeedbackInput.pop();
        console.log("usersizeNew" + $scope.moveFeedbackInput.length);
        console.log($scope.moveFeedbackInput);
      };
      $scope.removeComment = function(i) {
        $scope.moveFeedbackInput.splice(i, 1);
      };
      //////////////////////////////////////////////////////////////////
    }
  ])
  .directive("customDraggable", function() {
    return {
      restrict: "A",
      link: function(scope, elem, attr, ctrl) {
        elem.draggable();
      }
    };
  });
