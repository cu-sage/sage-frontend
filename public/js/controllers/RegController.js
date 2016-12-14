angular.module('mainApp').
    controller('RegController', function($scope, $auth, $location) {

        $scope.signup = function() {
            if ($scope.signInAs) {
                $scope.role = 'student';
            } else {
                $scope.role = 'instructor';
            }
            var user = {
                email: $scope.email,
                password: $scope.password,
                fullname: $scope.fullname,
                role: $scope.role
            };

            $auth.signup(user).then(function(response) {
                $location.path('/login');
            }).catch(function(response) {
                $scope.errorMessage = {};
                angular.forEach(response.data.message,
                    function(message, field) {
                        $scope.signupForm[field].$setValidity('server', false);
                        $scope.errorMessage[field] =
                            response.data.message[field];
                    });
                console.log(response.data);
            });
        };

    });
