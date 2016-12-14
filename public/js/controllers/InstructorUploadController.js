angular.module('instructorApp')
    .controller('InstructorUploadController', function(Upload, $window, $location, $scope) {
        var path = $location.path().split('/');
        $scope.path = path[1];
        $scope.sid = path[2];
        var vm = this;
        vm.submit = function(){ //function to call on form submit
            if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
                vm.upload(vm.file); //call upload function
            }
        };

        vm.upload = function (file) {
            // console.log("assignment id is "+$scope.assignmentId);
            Upload.upload({
                url: '/uploadVideo', //webAPI exposed to upload the file
                data:{assignmentId:$scope.assignmentId, file:file} //order matters
            }).then(function (resp) { //upload function returns a promise
                if(resp.data.error_code === 0){ //validate success
                    // $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                    $location.path("/overview/"+ $scope.sid);
                } else {
                    console.log(resp);
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                $window.alert('Error status: ' + resp.status);
            }, function (evt) {
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
        };
    });
