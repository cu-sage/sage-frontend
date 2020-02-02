angular
  .module("instructorApp")
  .controller("InstructorInstructionsController", [
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
      $scope.initHide = true;
      var path = $location.path().split("/");

      $scope.assgn = {
        aid: path[path.length - 2]
      };
      $scope.aid = $scope.assgn.aid;
      $scope.instr = {
        name: ""
      };

      //for instruction
      $scope.steps = [];
      $scope.previewImg = [];

      /*$scope.showLoadingDialog = function(){
            $mdDialog.show({
                template: '<md-dialog id="plz_wait" style="background-color:transparent;box-shadow:none">' +
                            '<div layout="row" layout-sm="column" layout-align="center center" aria-label="wait">' +
                                '<md-progress-circular md-mode="indeterminate" ></md-progress-circular>' +
                            '</div>' +
                         '</md-dialog>',
                parent: angular.element(document.body),
                clickOutsideToClose:false,
                fullscreen: false
            })
        }*/

      loadingService.start();
      //$scope.showLoadingDialog()

      ///instructors/games/:gid/instructions
      $http
        // .get("/stats/instructors/games/" + $scope.aid + "/instructions")
        .get("/stats/instructors/games/0/instructions")
        .then(function(response) {
          console.log(response.data);
          $scope.assgn.name = response.data.gameName;
          var stepContent = response.data.content;
          //console.log(response);
          $scope.iid = response.data._id;
          //console.log($scope.iid)
          console.log("aid is " + $scope.aid);
          if (stepContent) {
            for (var i = 0; i < stepContent.length; i++) {
              var heading = stepContent[i].heading;
              var description = stepContent[i].other[0].description;
              var img = stepContent[i].other[0].image;
              var step = {
                heading: heading,
                description: description,
                img: img,
                imgWidth: "",
                imgHeight: ""
              };
              $scope.steps.push(step);
            }
          }

          $scope.previewImg = {
            img: response.data.img,
            imgWidth: "",
            imgHeight: ""
          };
          //$scope.previewImg.push(preview);
          //document.querySelector("#previewImg").src = response.data.img;
          $scope.instr.name = response.data.name;
          $mdDialog.cancel();
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
          img: "/public/images/logo.png",
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

      $scope.deleteStep = function(index) {
        console.log("Remove: " + index);
        $scope.steps.splice(index - 1, 1);
        console.log($scope.steps);
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

      $scope.update = function() {
        $scope.isLoading = true;

        //show loading dialog
        //$scope.showLoadingDialog();
        loadingService.start();
        $scope.updateInstr();
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
        console.log(width + " " + height);
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
        var dataURL = canvas.toDataURL("image/" + ext);
        return dataURL;
      };

      $scope.updateInstr = function() {
        console.log($scope.steps.length);
        var length = $scope.steps.length;
        $scope.content = [];
        $scope.addStepContent(0, length);
      };

      $scope.addStepContent = function(i, length) {
        if (i < length) {
          console.log($scope.steps[i].heading);
          console.log($scope.steps[i].description);
          var currentImg = new Image();
          currentImg.src = $scope.steps[i].img;
          // console.log(currentImg.src)
          currentImg.onload = function() {
            console.log($scope.steps[i].imgWidth);
            if ($scope.steps[i].imgWidth == "") {
              $scope.newContent = {
                heading: $scope.steps[i].heading,
                other: [
                  {
                    description: $scope.steps[i].description,
                    image: currentImg.src
                  }
                ]
              };
            } else {
              $scope.newContent = {
                heading: $scope.steps[i].heading,
                other: [
                  {
                    description: $scope.steps[i].description,
                    image: $scope.getBase64Image(currentImg, i)
                  }
                ]
              };
            }
            $scope.content.push($scope.newContent);
            $scope.addStepContent(i + 1, length);
          };
        }
        console.log("205");
        if (i == length) {
          console.log($scope.content);
          $scope.addPreviewContent();
        }
      };

      $scope.addPreviewContent = function() {
        console.log($scope.previewImg);
        var previewImg = new Image();
        previewImg.src = $scope.previewImg.img;
        previewImg.onload = function() {
          if ($scope.previewImg.imgWidth == "") {
            console.log("218");
            $scope.newInstr = {
              name: $scope.instr.name,
              content: JSON.stringify($scope.content),
              img: previewImg.src,
              role: "student",
              gameId: $scope.aid, // this is 0 for instructor instruction
              gameName: $scope.assgn.name
            };
          } else {
            $scope.newInstr = {
              name: $scope.instr.name,
              content: JSON.stringify($scope.content),
              img: $scope.getBase64Image(previewImg, -1),
              role: "student",
              gameId: $scope.aid, // this is 0 for instructor instruction
              gameName: $scope.assgn.name
            };
          }
          //console.log($scope.newInstr);
          $scope.postInstr();
        };
      };

      $scope.postInstr = function() {
        console.log(
          "/stats/instructors/games/" +
            $scope.aid +
            "/instruction/" +
            $scope.iid
        );
        $http({
          method: "PUT",
          url:
            "/stats/instructors/games/" +
            $scope.aid +
            "/instruction/" +
            $scope.iid,
          data: JSON.stringify($scope.newInstr)
        }).then(function(response) {
          //finish loading
          //$mdDialog.cancel();
          loadingService.stop();
          $scope.showConfirmationDialog();
        });
      };

      // $scope.deleteInstr = function(step) {
      //   console.log(
      //     "/stats/instructors/games/delete/" +
      //       $scope.aid +
      //       "/instruction/" +
      //       $scope.iid
      //   );
      //   $http({
      //     method: "POST",
      //     url:
      //       "/stats/instructors/games/delete/" +
      //       $scope.aid +
      //       "/instruction/" +
      //       $scope.iid,
      //     data: JSON.stringify({ step: step })
      //   }).then(function(response) {
      //     //finish loading
      //     //$mdDialog.cancel();
      //     loadingService.stop();
      //     $scope.showConfirmationDialog();
      //   });
      // };

      $scope.showConfirmationDialog = function() {
        $scope.alert = $mdDialog
          .alert()
          .parent(angular.element(document.querySelector("#popupContainer")))
          .clickOutsideToClose(true)
          .title("Alert")
          .textContent("Your instruction is saved")
          .ok("Got it!");

        $mdDialog.show($scope.alert).finally(function() {
          alert = undefined;
          $window.location.reload();
        });
      };
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
