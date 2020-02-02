angular
  .module("instructorApp")
  .controller("MockGameRecommendationsController", function(
    Upload,
    $window,
    $location,
    $scope,
    $http
  ) {
    $http.get("/recommendations/getAllData").then(function(response) {
      if (response.status != "200") {
        $window.location.href = "/public/views/error.html";
      } else {
        var allGames = convertObjToArray(response.data.allGames);
        var allStudentsGames = convertObjToArray(response.data.allStudentsGames);
        for (var i = 0; i < allStudentsGames.length; i++) {
            allStudentsGames[i][1] = convertObjToArray(allStudentsGames[0][1]);
        }
        
        $scope.originalGames = response.data.allGames;
        $scope.allGames = allGames;
        $scope.allStudentsGames = allStudentsGames;
        $scope.gamesInClass = response.data.gamesInClass;
      }
    });

    function convertObjToArray(obj) {
      return Object.keys(obj).map(function(key) {
        return [Number(key), obj[key]];
      });
    }
  });
