angular.module('studentApp')
    .controller('StudentLearningPathController', function(Upload, $window, $location, $scope) {
        var path = $location.path().split('/');
        $scope.path = path[1];
        $scope.sid = path[2];
        console.log(path);

        $scope.lp = {
        	'pathID': 1,
        	'pathName' : 'Path 101',
        	'pathDescription' : 'This is a basic learning path.',
        	'courses' : [
	        	{courseID:1, courseName:'Looping'}, 
	            {courseID:2, courseName:'Recursion'}
            ]
        };
    });
