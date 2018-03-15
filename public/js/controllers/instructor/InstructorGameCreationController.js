angular.module('instructorApp')
    .controller('InstructorGameCreationController', ['$scope', '$window', '$http', "$routeParams", "$location" ,
    function($scope, $window, $http, $routeParams, $location) {
    	//$scope.course={};

    	$scope.reset=function(){
    		$scope.assignment={};
    		//$scope.course.desc="";
    	};

        $scope.steps = [{
            heading: '',
            description: '',
            img: '' 
        }];


        $scope.orders = ('1 2 3 4').split(' ').map(function(order) {
            return {n:order};
        });

        $scope.addStep=function(){
            var newStep = {
                heading: '',
                description: '',
                img: '' 
            }
            $scope.steps.push(newStep);
        };

        $scope.imageUpload = function(event){
            var files = event.target.files; 
            console.log(event);
            $scope.stepID = event.target.parentNode.children[0].id;
            console.log($scope.stepID);
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();
                reader.onload = $scope.imageIsLoaded; 
                reader.readAsDataURL(file);
             }
        }

        $scope.imageIsLoaded = function(e){
            $scope.$apply(function() {
                if($scope.stepID.indexOf("previewImg") !== -1){
                    document.querySelector("#previewImg").src = e.target.result;
                } else{
                   var stepImgEle = document.querySelector("#"+ $scope.stepID);
                   stepImgEle.src = e.target.result;
                }
            });
        }

        $scope.preview = function(){
            $scope.currentStep = 0;
            var targetElement = angular.element(document.querySelector(".previewInstr"));            
            var afterElement = "<p>" + $scope.instr.name +"</p></br>";
            var nextButton = "<button class='" +"btn btn-lg'" + "ng-click='" +"nextStep()'" +"value='" +"next'" +">Next</button>"
            var heading = "<p>" + document.querySelectorAll(".heading")[$scope.currentStep].value + "</p>";
            var description = "<p>" + document.querySelectorAll(".description")[$scope.currentStep].value + "</p>";
            var img = "<img src='" +  document.querySelectorAll(".stepImg")[$scope.currentStep].src + "' class='" +"img-rounded'" + "height='100' width='100'>";
            afterElement += nextButton;
            afterElement += heading;
            afterElement += description;
            afterElement += img;
            console.log(afterElement);
            targetElement.html(afterElement);
        }

        $scope.nextStep = function(){
            console.log($scope.currentStep);
            $scope.currentStep++;
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
		                        }
            );
    	 };
        }]);