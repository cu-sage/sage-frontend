const _ = require('lodash');

const mockGamesDataAdapter = (function() {

  var allGames = {
    "100": {
      name: "Sequence Game Easy 1",
      description: '',
      ctConcepts: ["Problem Statements", "Instructions"],
      difficulty: 1
    },
    "101": {
      name: "Sequence Game Easy 2",
      description: '',
      ctConcepts: ["Problem Statements", "Instructions", "Recipes"],
      difficulty: 1
    },
    "102": {
      name: "Sequence Game Medium 1",
      description: '',
      ctConcepts: ["Problem Statements", "Instructions", "Recipes"],
      difficulty: 2
    },
    "103": {
      name: "Sequence Game Medium 2",
      description: '',
      ctConcepts: [
        "Problem Statements",
        "Instructions",
        "Recipes",
        "Algorithms"
      ],
      difficulty: 2
    },
    "104": {
      name: "Sequence Game Hard 1",
      description: '',
      ctConcepts: ["Problem Statements", "Instructions", "Recipes"],
      difficulty: 3
    },
    "105": {
      name: "Sequence Game Hard 2",
      description: '',
      ctConcepts: [
        "Problem Statements",
        "Instructions",
        "Recipes",
        "Algorithms"
      ],
      difficulty: 3
    }
  };

  function getAllGames() {
    return new Promise(function(resolve, reject) {
      resolve(allGames);
    });
  }

  function getGameByIds(idsArr) {
    return new Promise(function(resolve, reject) {
      var games = [];
      for (var i = 0; i < idsArr.length; i++) {
        games.push(allGames[idsArr[i]]);
      }
      resolve(games);
    });
  }

  function getAllGamesOfAllStudents() {
    var data = {
      "1": {
        "100": {
          abstractionProblemDecompositionCtScore: 3,
          parallelismCtScore: 3,
          logicalThinkingCtScore: 3,
          synchronizationCtScore: 3,
          flowControlCtScore: 3,
          userInteractivityCtScore: 3,
          dataRepresentationCtScore: 3,
          difficulty: 1
        },
        "102": {
          abstractionProblemDecompositionCtScore: 1,
          parallelismCtScore: 1,
          logicalThinkingCtScore: 1,
          synchronizationCtScore: 1,
          flowControlCtScore: 1,
          userInteractivityCtScore: 1,
          dataRepresentationCtScore: 1,
          difficulty: 2
        }
      },
      "2": {
        "100": {
          abstractionProblemDecompositionCtScore: 3,
          parallelismCtScore: 3,
          logicalThinkingCtScore: 3,
          synchronizationCtScore: 3,
          flowControlCtScore: 3,
          userInteractivityCtScore: 3,
          dataRepresentationCtScore: 3,
          difficulty: 1
        },
        "102": {
          abstractionProblemDecompositionCtScore: 3,
          parallelismCtScore: 3,
          logicalThinkingCtScore: 3,
          synchronizationCtScore: 3,
          flowControlCtScore: 3,
          userInteractivityCtScore: 3,
          dataRepresentationCtScore: 3,
          difficulty: 2
        }
      },
      "3": {
        "100": {
          abstractionProblemDecompositionCtScore: 3,
          parallelismCtScore: 3,
          logicalThinkingCtScore: 3,
          synchronizationCtScore: 3,
          flowControlCtScore: 3,
          userInteractivityCtScore: 3,
          dataRepresentationCtScore: 3,
          difficulty: 1
        },
        "101": {
          abstractionProblemDecompositionCtScore: 3,
          parallelismCtScore: 3,
          logicalThinkingCtScore: 3,
          synchronizationCtScore: 3,
          flowControlCtScore: 3,
          userInteractivityCtScore: 3,
          dataRepresentationCtScore: 3,
          difficulty: 1
        },
        "102": {
          abstractionProblemDecompositionCtScore: 3,
          parallelismCtScore: 3,
          logicalThinkingCtScore: 3,
          synchronizationCtScore: 3,
          flowControlCtScore: 3,
          userInteractivityCtScore: 3,
          dataRepresentationCtScore: 3,
          difficulty: 2
        },
        "104": {
          abstractionProblemDecompositionCtScore: 1,
          parallelismCtScore: 1,
          logicalThinkingCtScore: 1,
          synchronizationCtScore: 1,
          flowControlCtScore: 1,
          userInteractivityCtScore: 1,
          dataRepresentationCtScore: 1,
          difficulty: 1
        }
      },
      "4": {
        "100": {
          abstractionProblemDecompositionCtScore: 3,
          parallelismCtScore: 3,
          logicalThinkingCtScore: 3,
          synchronizationCtScore: 3,
          flowControlCtScore: 3,
          userInteractivityCtScore: 3,
          dataRepresentationCtScore: 3,
          difficulty: 1
        },
        "101": {
          abstractionProblemDecompositionCtScore: 3,
          parallelismCtScore: 3,
          logicalThinkingCtScore: 2,
          synchronizationCtScore: 3,
          flowControlCtScore: 2,
          userInteractivityCtScore: 3,
          dataRepresentationCtScore: 2,
          difficulty: 1
        },
        "102": {
          abstractionProblemDecompositionCtScore: 3,
          parallelismCtScore: 3,
          logicalThinkingCtScore: 2,
          synchronizationCtScore: 3,
          flowControlCtScore: 2,
          userInteractivityCtScore: 3,
          dataRepresentationCtScore: 2,
          difficulty: 2
        },
        "104": {
          abstractionProblemDecompositionCtScore: 3,
          parallelismCtScore: 3,
          logicalThinkingCtScore: 2,
          synchronizationCtScore: 3,
          flowControlCtScore: 2,
          userInteractivityCtScore: 3,
          dataRepresentationCtScore: 2,
          difficulty: 3
        }
      },
      "5": {
        "100": {
          abstractionProblemDecompositionCtScore: 3,
          parallelismCtScore: 3,
          logicalThinkingCtScore: 3,
          synchronizationCtScore: 3,
          flowControlCtScore: 3,
          userInteractivityCtScore: 3,
          dataRepresentationCtScore: 3,
          difficulty: 1
        },
        "101": {
          abstractionProblemDecompositionCtScore: 3,
          parallelismCtScore: 3,
          logicalThinkingCtScore: 3,
          synchronizationCtScore: 3,
          flowControlCtScore: 3,
          userInteractivityCtScore: 3,
          dataRepresentationCtScore: 3,
          difficulty: 1
        },
        "102": {
          abstractionProblemDecompositionCtScore: 3,
          parallelismCtScore: 1,
          logicalThinkingCtScore: 3,
          synchronizationCtScore: 1,
          flowControlCtScore: 3,
          userInteractivityCtScore: 3,
          dataRepresentationCtScore: 3,
          difficulty: 2
        },
        "103": {
          abstractionProblemDecompositionCtScore: 3,
          parallelismCtScore: 2,
          logicalThinkingCtScore: 3,
          synchronizationCtScore: 2,
          flowControlCtScore: 3,
          userInteractivityCtScore: 2,
          dataRepresentationCtScore: 3,
          difficulty: 2
        },
        "104": {
          abstractionProblemDecompositionCtScore: 2,
          parallelismCtScore: 2,
          logicalThinkingCtScore: 2,
          synchronizationCtScore: 2,
          flowControlCtScore: 2,
          userInteractivityCtScore: 2,
          dataRepresentationCtScore: 2,
          difficulty: 3
        },
        "105": {
          abstractionProblemDecompositionCtScore: 2,
          parallelismCtScore: 2,
          logicalThinkingCtScore: 2,
          synchronizationCtScore: 2,
          flowControlCtScore: 2,
          userInteractivityCtScore: 2,
          dataRepresentationCtScore: 2,
          difficulty: 3
        }
      },
      "6": {
        "100": {
          abstractionProblemDecompositionCtScore: 2,
          parallelismCtScore: 2,
          logicalThinkingCtScore: 2,
          synchronizationCtScore: 2,
          flowControlCtScore: 2,
          userInteractivityCtScore: 2,
          dataRepresentationCtScore: 2,
          difficulty: 1
        },
        "101": {
          abstractionProblemDecompositionCtScore: 2,
          parallelismCtScore: 2,
          logicalThinkingCtScore: 2,
          synchronizationCtScore: 2,
          flowControlCtScore: 2,
          userInteractivityCtScore: 2,
          dataRepresentationCtScore: 2,
          difficulty: 1
        },
        "102": {
          abstractionProblemDecompositionCtScore: 2,
          parallelismCtScore: 2,
          logicalThinkingCtScore: 2,
          synchronizationCtScore: 2,
          flowControlCtScore: 2,
          userInteractivityCtScore: 2,
          dataRepresentationCtScore: 2,
          difficulty: 2
        },
        "103": {
          abstractionProblemDecompositionCtScore: 2,
          parallelismCtScore: 2,
          logicalThinkingCtScore: 2,
          synchronizationCtScore: 2,
          flowControlCtScore: 2,
          userInteractivityCtScore: 2,
          dataRepresentationCtScore: 2,
          difficulty: 2
        },
        "104": {
          abstractionProblemDecompositionCtScore: 2,
          parallelismCtScore: 2,
          logicalThinkingCtScore: 2,
          synchronizationCtScore: 2,
          flowControlCtScore: 2,
          userInteractivityCtScore: 2,
          dataRepresentationCtScore: 2,
          difficulty: 3
        },
        "105": {
          abstractionProblemDecompositionCtScore: 2,
          parallelismCtScore: 2,
          logicalThinkingCtScore: 2,
          synchronizationCtScore: 3,
          flowControlCtScore: 2,
          userInteractivityCtScore: 2,
          dataRepresentationCtScore: 3,
          difficulty: 3
        }
      },
      "7": {
        "100": {
          abstractionProblemDecompositionCtScore: 2,
          parallelismCtScore: 2,
          logicalThinkingCtScore: 2,
          synchronizationCtScore: 2,
          flowControlCtScore: 2,
          userInteractivityCtScore: 2,
          dataRepresentationCtScore: 2,
          difficulty: 1
        },
        "101": {
          abstractionProblemDecompositionCtScore: 2,
          parallelismCtScore: 2,
          logicalThinkingCtScore: 2,
          synchronizationCtScore: 2,
          flowControlCtScore: 2,
          userInteractivityCtScore: 2,
          dataRepresentationCtScore: 2,
          difficulty: 1
        },
        "102": {
          abstractionProblemDecompositionCtScore: 2,
          parallelismCtScore: 2,
          logicalThinkingCtScore: 2,
          synchronizationCtScore: 2,
          flowControlCtScore: 2,
          userInteractivityCtScore: 2,
          dataRepresentationCtScore: 2,
          difficulty: 2
        }
      },
      "8": {
        "100": {
          abstractionProblemDecompositionCtScore: 2,
          parallelismCtScore: 2,
          logicalThinkingCtScore: 2,
          synchronizationCtScore: 2,
          flowControlCtScore: 2,
          userInteractivityCtScore: 2,
          dataRepresentationCtScore: 2,
          difficulty: 1
        },
        "101": {
          abstractionProblemDecompositionCtScore: 2,
          parallelismCtScore: 2,
          logicalThinkingCtScore: 2,
          synchronizationCtScore: 2,
          flowControlCtScore: 2,
          userInteractivityCtScore: 2,
          dataRepresentationCtScore: 2,
          difficulty: 1
        },
        "102": {
          abstractionProblemDecompositionCtScore: 3,
          parallelismCtScore: 3,
          logicalThinkingCtScore: 3,
          synchronizationCtScore: 3,
          flowControlCtScore: 3,
          userInteractivityCtScore: 3,
          dataRepresentationCtScore: 3,
          difficulty: 2
        }
      }
    };
    
    return new Promise(function(resolve, reject) {
      resolve(data);
    });
  }

  function getAllGamesInClass(classId) {
    var data = {
      "104": {
        difficulty: 1,
        flowControlCtScore: 1,
        synchronizationCtScore: 1,
        logicalThinkingCtScore: 1,
        abstractionProblemDecompositionCtScore: 1,
        dataRepresentationCtScore: 1,
        parallelismCtScore: 1,
        userInteractivityCtScore: 1
      },
      "100": {
        difficulty: 1,
        flowControlCtScore: 3,
        synchronizationCtScore: 3,
        logicalThinkingCtScore: 3,
        abstractionProblemDecompositionCtScore: 3,
        dataRepresentationCtScore: 3,
        parallelismCtScore: 3,
        userInteractivityCtScore: 3
      },
      "101": {
        difficulty: 1,
        flowControlCtScore: 3,
        synchronizationCtScore: 3,
        logicalThinkingCtScore: 3,
        abstractionProblemDecompositionCtScore: 3,
        dataRepresentationCtScore: 3,
        parallelismCtScore: 3,
        userInteractivityCtScore: 3
      },
      "102": {
        difficulty: 2,
        flowControlCtScore: 3,
        synchronizationCtScore: 3,
        logicalThinkingCtScore: 3,
        abstractionProblemDecompositionCtScore: 3,
        dataRepresentationCtScore: 3,
        parallelismCtScore: 3,
        userInteractivityCtScore: 3
      }
    };

    return new Promise(function(resolve, reject) {
      resolve(data);
    });
  }

  return {
    getAllGames,
    getAllGamesOfAllStudents,
    getAllGamesInClass,
    getGameByIds,
  }
})();

module.exports = mockGamesDataAdapter;
