angular.module('researcherApp')
    .controller('ResearcherInstructionController', ['$scope', '$window', '$http', "$routeParams", "$location" ,"$mdStepper","$mdDialog",'loadingService',
    function($scope, $window, $http, $routeParams, $location, $mdStepper,$mdDialog,loadingService) {
        $scope.initHide = true;
        $scope.isCreated = false;
        $scope.steps = [];
        $scope.defaultPathOfImg = '/public/images/logo.png'
        $scope.defaultImgWidth = 394
        $scope.defaultImgHeight = 191
        $scope.previewImg = {
            img: $scope.defaultPathOfImg,
            imgWidth: $scope.defaultImgWidth,
            imgHeight : $scope.defaultImgHeight
        };

        //gameid=0 -> parsons; gameid=1 ->cvg
        $scope.gameId = 0;
        $scope.gameType = ('parsons cvg').split(' ').map(function(type){
            return {n:type};
        });

        $scope.game = "parsons";
        $scope.addSpecificStep  = function(ev) {
            console.log(ev);
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.prompt()
              .title('Which step you want add? (At most ' + (Number($scope.steps.length)+1) + ')')
              .targetEvent(ev)
              .ok('Confirm')
              .cancel('Cancel');

            $mdDialog.show(confirm).then(function(result) {
                //is number or not
                if (!isNaN(result) && angular.isNumber(+result)) {
                    console.log(result +" is a number");
                    var result = Number(result)
                    if(result > (Number($scope.steps.length)+1) || !Number.isInteger(result) || result <= 0){
                        //show error dialog
                        $mdDialog.show(
                          $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Alert')
                            .textContent('Cound not add step ' + result)
                            .ok('Got it!')
                        );
                    } else{
                        //add step
                        var newStep = {
                            heading: '',
                            description: '',
                            img: '/public/images/logo.png',
                            imgWidth: '',
                            imgHeight : ''
                        }
                        $scope.steps.splice(result-1, 0, newStep);

                        //show dialog
                        $mdDialog.show(
                          $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Alert')
                            .textContent('Add Step Successfully')
                            .ok('Got it!')
                        );
                    }
                } else{
                    console.log(result +" is not a number");
                    //show error dialog
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Alert')
                            .textContent(result +' is not a number')
                            .ok('Got it!')
                    );
                }
            }, function() {
            });
        };

        ///instructors/games/:gid/instructions
        //0 for parsons, 1 for cvg
        $scope.loading = function(){
            loadingService.start();
            $http.get("/stats/instructors/games/" + $scope.gameId + "/instructions")
            .then(function(response){

                if(response.data === ""){
                    //no instruction in db
                    $scope.isCreated = false;
                    $scope.previewImg = {
                        img: '/public/images/logo.png',
                        imgWidth: '',
                        imgHeight : '' 
                    };

                    $scope.steps = [{
                        heading: '',
                        description: '',
                        img: '/public/images/logo.png',
                        imgWidth: '',
                        imgHeight : '' 
                    }];
                    //document.querySelector("#previewImg").src = $scope.previewImg.img;

                } else{
                    $scope.isCreated = true;
                    var stepContent = response.data.content;
                    console.log(response);
                    $scope.iid = response.data._id
                    console.log($scope.iid)
                    for(var i = 0 ;i < stepContent.length ; i++){
                        var heading = stepContent[i].heading;
                        var description = stepContent[i].other[0].description;
                        var img = stepContent[i].other[0].image;
                        var step = {
                            heading: heading,
                            description: description,
                            img: img,
                            imgWidth: '',
                            imgHeight : '' 
                        };
                        $scope.steps.push(step);
                    }

                    $scope.previewImg = {
                        img: response.data.img,
                        imgWidth: '',
                        imgHeight : ''
                    };
                    //document.querySelector("#previewImg").src = response.data.img;
                }
                loadingService.stop();
            });
        }
        $scope.loading();       

        $scope.changeGameType = function(){
            $scope.gameId= ($scope.gameId + 1 ) % 2;
            console.l
            $scope.steps = [];
            $scope.previewImg = [];
            $scope.loading();
        }

        $scope.addStep=function(){
            var newStep = {
                heading: '',
                description: '',
                img: '/public/images/logo.png',
                imgWidth: '',
                imgHeight : ''
            }
            $scope.steps.push(newStep);

            //show dialog
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Alert')
                .textContent('Add Step Successfully')
                .ok('Got it!')
            );

        };

        $scope.imageUpload = function(event){
            var files = event.target.files; 
            console.log(event);
            var id = event.target.parentNode.children[0].id;
            if(id == "previewImg"){
                $scope.stepOrder = "-1";
            } else{
                $scope.stepOrder = id.split("img")[1]+"";
            }
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();
                reader.onload = $scope.imageIsLoaded; 
                reader.readAsDataURL(file);
             }
        }

        $scope.imageIsLoaded = function(e){
            console.log(e);
            $scope.$apply(function() {
                var i = new Image(); 
                var imgWidth;
                var imgHeight;
                //set width and height
                i.onload = function(){
                    imgWidth = i.width;
                    imgHeight = i.height;                  
                    if($scope.stepOrder == "-1"){
                        $scope.previewImg.imgWidth = imgWidth;
                        $scope.previewImg.imgHeight = imgHeight;
                        console.log($scope.previewImg);
                    } else{
                        $scope.steps[$scope.stepOrder].imgWidth = imgWidth;
                        $scope.steps[$scope.stepOrder].imgHeight = imgHeight;
                        console.log($scope.steps[$scope.stepOrder]);
                    }  
                };
                if($scope.stepOrder == "-1"){
                    document.querySelector("#previewImg").src = e.target.result;
                    $scope.previewImg.img = e.target.result;
                }else{
                    $scope.steps[$scope.stepOrder].img = e.target.result;
                } 
                i.src =  e.target.result; 
            });
        }

        $scope.previousStep = function () {
            var steppers = $mdStepper('preview-step');
            steppers.back();
        };

        $scope.nextStep = function () {
            var steppers = $mdStepper('preview-step');
            steppers.next();
        };

        $scope.preview = function(){
            $scope.initHide = false;
        }

        $scope.closePreviewArea = function(){
            $scope.initHide = true;
        }

        $scope.save = function(){
            //show loading dialog
            loadingService.start();
            $scope.createInstr();
        }

        $scope.update = function(){
            loadingService.start();
            $scope.updateInstr();
        }

        $scope.deleteStep = function(index){
            console.log("Remove: " + index);
            $scope.steps.splice(index-1, 1);
            console.log($scope.steps)
        }


        $scope.updateInstr = function(){
            console.log($scope.steps.length);
            var length = $scope.steps.length;
            if($scope.game == 'parsons'){
                $scope.gameId = 0;
            } else{
                $scope.gameId = 1;
            }
            console.log($scope.gameId);
            $scope.content= [];
            $scope.addStepContent(0,length);
        }

        $scope.getBase64Image = function(img, idx){
            //idx==-1 meaning preview icon
            //otherwise it is the step's index
            var width;
            var height;
            if(idx==-1){
                width = $scope.previewImg.imgWidth
                height = $scope.previewImg.imgHeight;
            } else{
                width = $scope.steps[idx].imgWidth;
                height = $scope.steps[idx].imgHeight;
            }
            console.log(width +" "+ height);
            var canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
            var dataURL = canvas.toDataURL("image/"+ext);
            return dataURL;
        }

        $scope.createInstr = function(){
            console.log($scope.steps.length);
            var length = $scope.steps.length;
            $scope.content= [];
            $scope.addStepContent(0,length);
        }

        $scope.addStepContent = function(i, length){
            if(i < length){
                console.log($scope.steps[i].heading);
                console.log($scope.steps[i].description);
                var currentImg = new Image();
                currentImg.src = $scope.steps[i].img;          
                currentImg.onload = function(){
                    if($scope.isCreated == true){
                        if($scope.steps[i].imgWidth==''){
                            $scope.newContent = {
                                heading: $scope.steps[i].heading,
                                other: [{description: $scope.steps[i].description,
                                image: currentImg.src}] 
                            }
                        }else{
                            $scope.newContent = {
                                heading: $scope.steps[i].heading,
                                other: [{description: $scope.steps[i].description,
                                image: $scope.getBase64Image(currentImg,i)}] 
                            }
                        }
                    } else{
                        $scope.newContent = {
                            heading: $scope.steps[i].heading,
                            other: [{description: $scope.steps[i].description,
                            image: $scope.getBase64Image(currentImg,i)}] 
                        }
                    }
                    $scope.content.push($scope.newContent);
                    $scope.addStepContent(i+1,length); 
                }
            }

            if(i==length){
                $scope.addPreviewContent();
            }
        }

        $scope.addPreviewContent = function(){
            var previewImg = new Image();
            previewImg.src = $scope.previewImg.img;
            previewImg.onload = function(){
                if($scope.isCreated == true){
                    if($scope.previewImg.imgWidth==''){
                        console.log("218")
                        $scope.newInstr = {
                            name: "instructor",
                            content: JSON.stringify($scope.content),
                            img: previewImg.src,
                            role: "student",
                            gameId: $scope.gameId // this is 0 for instructor instruction
                        }
                    }else{
                        $scope.newInstr = {
                            name: "instructor",
                            content: JSON.stringify($scope.content),
                            img: $scope.getBase64Image(previewImg,-1),
                            role: "student",
                            gameId: $scope.gameId // this is 0 for instructor instruction
                        }
                    }
                } else{
                    $scope.newInstr = {
                        name: "instructors",
                        content: JSON.stringify($scope.content),
                        img: $scope.getBase64Image(previewImg,-1),
                        role: "student",
                        gameId: $scope.gameId // this is 0 for instructor instruction
                    }
                }
                $scope.postInstr();
            }
        }

        $scope.postInstr = function(){
            if($scope.isCreated == true){
                $http({
                method: 'PUT',
                url: "/stats/instructors/games/"+ $scope.gameId + "/instruction/" + $scope.iid,
                data: JSON.stringify($scope.newInstr),
                }).then(function(response){
                    //finish loading
                    // console.log(response);
                    loadingService.stop();
                    //$scope.showConfirmationDialog();

                });
            } else{
                $http({
                    method: 'POST',
                    url: "/stats/instructors/games/"+ $scope.gameId + "/createInstr/create",
                    data: JSON.stringify($scope.newInstr),
                    }).then(function(response){
                        //finish loading
                        //$mdDialog.cancel();
                        loadingService.stop();
                        $scope.showConfirmationDialog();
                });                
            }

        }

        $scope.showConfirmationDialog = function(){
            $scope.alert = $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Alert')
                .textContent('Your instruction is saved')
                .ok('Got it!')

            $mdDialog
                .show($scope.alert)
                .finally(function() {
                    alert = undefined;
                    $window.location.reload();
                });
        }

        
    }]).directive('customDraggable', function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attr, ctrl) {
            elem.draggable();
        }
    }});