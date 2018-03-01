angular.module('instructorApp')
    .controller('InstructorCreateController', ['$scope', '$window', '$http', "$routeParams",
    function($scope, $window, $http, $routeParams) {
    	$scope.addContent=function(){
    		var contentEle = angular.element( document.querySelector( '.content' ) );
    		var contenthtml = document.querySelector( '.content' ).outerHTML;
			contentEle.append(contenthtml);     
        };
    }]);