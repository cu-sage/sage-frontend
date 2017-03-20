angular.module('studentApp')
    .controller('StudentSingleCourseController', function(Upload, $window, $location, $scope) {
        var path = $location.path().split('/');
        $scope.courseID = path[2];
        $scope.sid = path[3];
        console.log(path);

        //get the results from server.
        $scope.course = {

        	courseID : 1,
        	courseName: 'Learning Recursion',
        	courseDescription: 'This course helps you learn the basics of Recursion.',
        	'courseLevelStatsForStudent' : {

        	},
        	'resources' : [
        		{'resourceID': 1, 'resourceName': 'Resource 1', link:"https://www.youtube.com/watch?v=Mv9NEXX1VHc"},
        		{'resourceID': 2, 'resourceName': 'Resource 2', link:"https://www.youtube.com/watch?v=Mv9NEXX1VHc"},
        		{'resourceID': 3, 'resourceName': 'Resource 3', link:"https://www.youtube.com/watch?v=Mv9NEXX1VHc"},
        		{'resourceID': 4, 'resourceName': 'Resource 4', link:"https://www.youtube.com/watch?v=Mv9NEXX1VHc"}
        	],
        	'assessments' : [
        		{assessmentID: 1, assessmentName: 'Basic', status: 'COMPLETED'},
        		{assessmentID: 2, assessmentName: 'Intermediate', status: 'PENDING'},
        		{assessmentID: 3, assessmentName: 'Advance', status: 'PENDING'},
        		{assessmentID: 4, assessmentName: 'Expert', status: 'PENDING'},
        	]

        };




    });
