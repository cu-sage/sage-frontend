var service = angular.module('serviceFactory', []);

service.factory('service', function($http) {
    return {
        list: function(sid, callback) {
            $http.get(
                'localhost:3001/students' + sid
            ).success(callback);
        }
    };
});
