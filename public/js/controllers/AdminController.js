angular.module('instructorApp')
    .controller('AdminController', ['$scope', '$window', '$http', "$routeParams", "$location" ,"$mdStepper","$mdDialog",
    function($scope, $window, $http, $routeParams, $location, $mdStepper, $mdDialog) {
    	//$scope.course={};
        $scope.initHide = true;
    	$scope.reset=function(){
    		$scope.assignment={};
    		//$scope.course.desc="";
    	};

        $scope.steps = [{
            heading: '',
            description: '',
            img: '/public/images/logo.png',
            imgWidth: '',
            imgHeight : '' 
        }];


        $scope.previewImg = [{
            img: '/public/images/logo.png',
            imgWidth: '',
            imgHeight : '' 
        }];


        $scope.orders = ('1 2 3 4').split(' ').map(function(order) {
            return {n:order};
        });

        $scope.addStep=function(){
            var newStep = {
                heading: '',
                description: '',
                img: '/public/images/logo.png',
                imgWidth: '',
                imgHeight : ''
            }
            $scope.steps.push(newStep);
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

        $scope.designGame=function(){
            $scope.assignment={};
            newc={
            order: $scope.assgn.order,
        };
        console.log(newc);

        $http({
            method: 'POST',
            url: "/stats/instructors/"+$routeParams.sid+"/course/"+$routeParams.cid+"/createAssignment/",
            data: newc,
            }).then(function(response) {
                        //console.log(response.status);
                        //console.log(response.data.message);
                        $scope.aid=(response.data.message.testid);
                        console.log($scope.aid);
                        var i1id=$routeParams.sid;
                        var c1id=$routeParams.cid;
                        var path = "/coursePage/"+i1id+"/course/"+c1id+"/createAssignment/"+$scope.aid+"/design";
                        console.log(path);
                        $location.path(path);
                                }
            );
            //$scope.course.desc="";
        };

    	$scope.submitForm=function(){
    		newc={
                name: $scope.assgn.name,
                order: $scope.assgn.order,
                };

            $scope.isLoading = true;
            console.log(newc);

            //show loading dialog
            $scope.showLoadingDialog();

            $http({
                method: 'POST',
                url: "/stats/instructors/"+$routeParams.sid+"/course/"+$routeParams.cid+"/createAssignment/",
                data: newc,
                }).then(function(response) {
                    //console.log(response.status);
                    //console.log(response.data.message);
                    console.log(response);
                    $scope.aid=(response.data.message.testid);
                    console.log($scope.aid);
                    $scope.createInstr();
                });
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
                    //console.log($scope.getBase64Image(currentImg,i));
                    $scope.newContent = {
                        heading: $scope.steps[i].heading,
                        other: [{description: $scope.steps[i].description,
                        image: $scope.getBase64Image(currentImg,i)}] 
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
                $scope.newInstr = {
                    name: $scope.instr.name,
                    content: JSON.stringify($scope.content),
                    img: $scope.getBase64Image(previewImg,-1),
                    role: "student",
                    gameId: $scope.aid // this is 0 for instructor instruction
                }
                $scope.postInstr();
            }
        }

        $scope.postInstr = function(){
            $http({
                method: 'POST',
                url: "/stats/instructors/games/"+ $scope.aid + "/createInstr/create",
                data: JSON.stringify($scope.newInstr),
                }).then(function(response){
                    //finish loading
                    $mdDialog.cancel();
                    $scope.showConfirmationDialog();
            });
        }

        $scope.showLoadingDialog = function(){
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
        }

        $scope.showConfirmationDialog = function(){
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Alert')
                .textContent('Your instruction is saved')
                .ok('Got it!')
            );
        }
        
    }]).directive('customDraggable', function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attr, ctrl) {
            elem.draggable();
        }
    }});

