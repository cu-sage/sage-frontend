var service = angular.module('serviceFactory', []);

service.factory('service', function($http) {
    return {
        list: function(sid, aid, callback) {
            $http.get(
                'http://localhost:8080/students/'+sid+'/assessments/'+aid+'/results'
                ).success(callback);
        }
    };
});