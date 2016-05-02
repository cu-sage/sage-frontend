var service = angular.module('serviceFactory', []);

service.factory('service', function($http) {
    return {
        list: function(sid, aid, callback) {
            $http.get(
                'http://sage-2ik12mb0.cloudapp.net:8081/students/'+sid+'/assessments/'+aid+'/results'
                ).success(callback);
        }
    };
});
