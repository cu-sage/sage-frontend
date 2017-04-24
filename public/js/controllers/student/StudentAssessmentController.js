angular.module('studentApp')
    .controller('StudentAssessmentController', function(Upload, $window, $location, $scope) {
        var path = $location.path().split('/');
        $scope.path = path[1];
        $scope.sid = path[2];
        console.log(path);
        var results = [
                    {
                        "description": "Block type sensing should be present",
                        "pass": true,
                        "actions": [
                            {
                            "type": 'action_say',
                            "command": "good job"
                            }

                        ]
                    },
                    {
                        "description": "Sprite 'Ball' should be present",
                        "pass": false,
                        "actions": [
                            {
                                "type": 'action_say',
                                "command": "keep working on it"
                            }

                        ]
                    },
                    {
                        "description": "Sprite 'Goal' should be present",
                        "pass": true,
                        "actions": [
                            {
                                "type": 'action_say',
                                "command": "nicely done"
                            }

                        ]
                    },
                    {
                        "description": "Sprite 'Goal' should be present",
                        "pass": true,
                        "actions": [
                            {
                                "type": 'action_say',
                                "command": "nicely done"
                            }

                        ]
                    }

                ];
        $scope.results = results;
    });
