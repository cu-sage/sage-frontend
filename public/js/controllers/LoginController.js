angular.module('mainApp').controller('LoginController',
    function($scope, $window, $location, $rootScope, $auth) {

        $scope.emailLogin = function() {
            $auth.login({email: $scope.email, password: $scope.password}).
                then(function(response) {
                    $window.localStorage.currentUser =
                        JSON.stringify(response.data.user);
                    $rootScope.currentUser =
                        JSON.parse($window.localStorage.currentUser);
                    // console.log($rootScope.currentUser);

                    // $location.path = '/';
                    if (response.data.user.role === 'student') {
                        $window.location.href = '/student/#/home/'+ response.data.user._id;
                    } else {
                        $window.location.href = '/instructor/#/overview/' + response.data.user._id;
                    }
                }).catch(function(response) {
                $scope.errorMessage = {};
                angular.forEach(response.data.message,
                    function(message, field) {
                        $scope.loginForm[field].$setValidity('server', false);
                        $scope.errorMessage[field] =
                            response.data.message[field];
                    });
            });
        };

    });
