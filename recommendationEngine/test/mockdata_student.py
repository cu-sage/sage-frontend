# TODO: Cirricula Items dynamic (don't coulple it)
# Different cirriculums, order enforced or not
# Generate ranking between next-game algorithm and imporved-game algorithm

features_info = {
    'difficulty': {
        'weight': .3,
        'type': 'scalar',
        'maxValue': 3,
    },
    'abstractionProblemDecompositionCtScore': {
        'weight': .1,
        'type': 'scalar',
        'maxValue': 3,
    },
    'parallelismCtScore': {
        'weight': .1,
        'type': 'scalar',
        'maxValue': 3,
    },
    'logicalThinkingCtScore': {
        'weight': .1,
        'type': 'scalar',
        'maxValue': 3,
    },
    'synchronizationCtScore': {
        'weight': .1,
        'type': 'scalar',
        'maxValue': 3,
    },
    'flowControlCtScore': {
        'weight': .1,
        'type': 'scalar',
        'maxValue': 3,
    },
    'userInteractivityCtScore': {
        'weight': .1,
        'type': 'scalar',
        'maxValue': 3,
    },
    'dataRepresentationCtScore': {
        'weight': .1,
        'type': 'scalar',
        'maxValue': 3,
    },
}

all_games = {
    100: {
        'name': 'Sequence Game Easy 1',
        'ctConcepts': ['Problem Statements', 'Instructions'],
        'difficulty': 1,
    },
    101: {
        'name': 'Sequence Game Easy 2',
        'ctConcepts': ['Problem Statements', 'Instructions', 'Recipes'],
        'difficulty': 1
    },
    102: {
        'name': 'Sequence Game Medium 1',
        'ctConcepts': ['Problem Statements', 'Instructions', 'Recipes'],
        'difficulty': 2
    },
    103: {
        'name': 'Sequence Game Medium 2',
        'ctConcepts': ['Problem Statements', 'Instructions', 'Recipes', 'Algorithms'],
        'difficulty': 2
    },
    104: {
        'name': 'Sequence Game Hard 1',
        'ctConcepts': ['Problem Statements', 'Instructions', 'Recipes'],
        'difficulty': 3
    },
    105: {
        'name': 'Sequence Game Hard 2',
        'ctConcepts': ['Problem Statements', 'Instructions', 'Recipes', 'Algorithms'],
        'difficulty': 3
    }
}

enrollments = {
    # Epect Game 102 recommended
    1: { # Student Id
        100: { # Game ID (above)
            'abstractionProblemDecompositionCtScore': 3,
            'parallelismCtScore': 3,
            'logicalThinkingCtScore': 3,
            'synchronizationCtScore': 3,
            'flowControlCtScore': 3,
            'userInteractivityCtScore': 3,
            'dataRepresentationCtScore': 3,
            'difficulty': 1
        },
        102: {
            'abstractionProblemDecompositionCtScore': 1,
            'parallelismCtScore': 1,
            'logicalThinkingCtScore': 1,
            'synchronizationCtScore': 1,
            'flowControlCtScore': 1,
            'userInteractivityCtScore': 1,
            'dataRepresentationCtScore': 1,
            'difficulty': 2
        }
    },
    # Expect game 103 and 104 recommended
    2: {
        100: { # Game ID (above)
            'abstractionProblemDecompositionCtScore': 3,
            'parallelismCtScore': 3,
            'logicalThinkingCtScore': 3,
            'synchronizationCtScore': 3,
            'flowControlCtScore': 3,
            'userInteractivityCtScore': 3,
            'dataRepresentationCtScore': 3,
            'difficulty': 1
        },
        102: {
            'abstractionProblemDecompositionCtScore': 3,
            'parallelismCtScore': 3,
            'logicalThinkingCtScore': 3,
            'synchronizationCtScore': 3,
            'flowControlCtScore': 3,
            'userInteractivityCtScore': 3,
            'dataRepresentationCtScore': 3,
            'difficulty': 2,
        }
    },
    # Recommend 103 and 105
    3: {
        100: { # Game ID (above)
            'abstractionProblemDecompositionCtScore': 3,
            'parallelismCtScore': 3,
            'logicalThinkingCtScore': 3,
            'synchronizationCtScore': 3,
            'flowControlCtScore': 3,
            'userInteractivityCtScore': 3,
            'dataRepresentationCtScore': 3,
            'difficulty': 1
        },
        101: {
            'abstractionProblemDecompositionCtScore': 3,
            'parallelismCtScore': 3,
            'logicalThinkingCtScore': 3,
            'synchronizationCtScore': 3,
            'flowControlCtScore': 3,
            'userInteractivityCtScore': 3,
            'dataRepresentationCtScore': 3,
            'difficulty': 1,
        },
        102: {
            'abstractionProblemDecompositionCtScore': 3,
            'parallelismCtScore': 3,
            'logicalThinkingCtScore': 3,
            'synchronizationCtScore': 3,
            'flowControlCtScore': 3,
            'userInteractivityCtScore': 3,
            'dataRepresentationCtScore': 3,
            'difficulty': 2,
        },
        104: {
            'abstractionProblemDecompositionCtScore': 1,
            'parallelismCtScore': 1,
            'logicalThinkingCtScore': 1,
            'synchronizationCtScore': 1,
            'flowControlCtScore': 1,
            'userInteractivityCtScore': 1,
            'dataRepresentationCtScore': 1,
            'difficulty': 1,
        }
    },
    # 105 recommended (not not required)
    4: {
        100: { # Game ID (above)
            'abstractionProblemDecompositionCtScore': 3,
            'parallelismCtScore': 3,
            'logicalThinkingCtScore': 3,
            'synchronizationCtScore': 3,
            'flowControlCtScore': 3,
            'userInteractivityCtScore': 3,
            'dataRepresentationCtScore': 3,
            'difficulty': 1
        },
        101: {
            'abstractionProblemDecompositionCtScore': 3,
            'parallelismCtScore': 3,
            'logicalThinkingCtScore': 2,
            'synchronizationCtScore': 3,
            'flowControlCtScore': 2,
            'userInteractivityCtScore': 3,
            'dataRepresentationCtScore': 2,
            'difficulty': 1,
        },
        102: {
            'abstractionProblemDecompositionCtScore': 3,
            'parallelismCtScore': 3,
            'logicalThinkingCtScore': 2,
            'synchronizationCtScore': 3,
            'flowControlCtScore': 2,
            'userInteractivityCtScore': 3,
            'dataRepresentationCtScore': 2,
            'difficulty': 2,
        },
        104: {
            'abstractionProblemDecompositionCtScore': 3,
            'parallelismCtScore': 3,
            'logicalThinkingCtScore': 2,
            'synchronizationCtScore': 3,
            'flowControlCtScore': 2,
            'userInteractivityCtScore': 3,
            'dataRepresentationCtScore': 2,
            'difficulty': 3,
        }
    },
    # No recommendations
    5: {
        100: { # Game ID (above)
            'abstractionProblemDecompositionCtScore': 3,
            'parallelismCtScore': 3,
            'logicalThinkingCtScore': 3,
            'synchronizationCtScore': 3,
            'flowControlCtScore': 3,
            'userInteractivityCtScore': 3,
            'dataRepresentationCtScore': 3,
            'difficulty': 1
        },
        101: {
            'abstractionProblemDecompositionCtScore': 3,
            'parallelismCtScore': 3,
            'logicalThinkingCtScore': 3,
            'synchronizationCtScore': 3,
            'flowControlCtScore': 3,
            'userInteractivityCtScore': 3,
            'dataRepresentationCtScore': 3,
            'difficulty': 1,
        },
        102: {
            'abstractionProblemDecompositionCtScore': 3,
            'parallelismCtScore': 1,
            'logicalThinkingCtScore': 3,
            'synchronizationCtScore': 1,
            'flowControlCtScore': 3,
            'userInteractivityCtScore': 3,
            'dataRepresentationCtScore': 3,
            'difficulty': 2,
        },
        103: {
            'abstractionProblemDecompositionCtScore': 3,
            'parallelismCtScore': 2,
            'logicalThinkingCtScore': 3,
            'synchronizationCtScore': 2,
            'flowControlCtScore': 3,
            'userInteractivityCtScore': 2,
            'dataRepresentationCtScore': 3,
            'difficulty': 2,
        },
        104: {
            'abstractionProblemDecompositionCtScore': 2,
            'parallelismCtScore': 2,
            'logicalThinkingCtScore': 2,
            'synchronizationCtScore': 2,
            'flowControlCtScore': 2,
            'userInteractivityCtScore': 2,
            'dataRepresentationCtScore': 2,
            'difficulty': 3,
        },
        105: {
            'abstractionProblemDecompositionCtScore': 2,
            'parallelismCtScore': 2,
            'logicalThinkingCtScore': 2,
            'synchronizationCtScore': 2,
            'flowControlCtScore': 2,
            'userInteractivityCtScore': 2,
            'dataRepresentationCtScore': 2,
            'difficulty': 3,
        }
    },
    # No recommendations
    6: {
        100: { # Game ID (above)
            'abstractionProblemDecompositionCtScore': 2,
            'parallelismCtScore': 2,
            'logicalThinkingCtScore': 2,
            'synchronizationCtScore': 2,
            'flowControlCtScore': 2,
            'userInteractivityCtScore': 2,
            'dataRepresentationCtScore': 2,
            'difficulty': 1
        },
        101: {
            'abstractionProblemDecompositionCtScore': 2,
            'parallelismCtScore': 2,
            'logicalThinkingCtScore': 2,
            'synchronizationCtScore': 2,
            'flowControlCtScore': 2,
            'userInteractivityCtScore': 2,
            'dataRepresentationCtScore': 2,
            'difficulty': 1,
        },
        102: {
            'abstractionProblemDecompositionCtScore': 2,
            'parallelismCtScore': 2,
            'logicalThinkingCtScore': 2,
            'synchronizationCtScore': 2,
            'flowControlCtScore': 2,
            'userInteractivityCtScore': 2,
            'dataRepresentationCtScore': 2,
            'difficulty': 2,
        },
        103: {
            'abstractionProblemDecompositionCtScore': 2,
            'parallelismCtScore': 2,
            'logicalThinkingCtScore': 2,
            'synchronizationCtScore': 2,
            'flowControlCtScore': 2,
            'userInteractivityCtScore': 2,
            'dataRepresentationCtScore': 2,
            'difficulty': 2,
        },
        104: {
            'abstractionProblemDecompositionCtScore': 2,
            'parallelismCtScore': 2,
            'logicalThinkingCtScore': 2,
            'synchronizationCtScore': 2,
            'flowControlCtScore': 2,
            'userInteractivityCtScore': 2,
            'dataRepresentationCtScore': 2,
            'difficulty': 3,
        },
        105: {
            'abstractionProblemDecompositionCtScore': 2,
            'parallelismCtScore': 2,
            'logicalThinkingCtScore': 2,
            'synchronizationCtScore': 3,
            'flowControlCtScore': 2,
            'userInteractivityCtScore': 2,
            'dataRepresentationCtScore': 3,
            'difficulty': 3,
        }
    },
    # Recommend 103 (improvement) and 104/105 next
    7: {
        100: { # Game ID (above)
            'abstractionProblemDecompositionCtScore': 2,
            'parallelismCtScore': 2,
            'logicalThinkingCtScore': 2,
            'synchronizationCtScore': 2,
            'flowControlCtScore': 2,
            'userInteractivityCtScore': 2,
            'dataRepresentationCtScore': 2,
            'difficulty': 1
        },
        101: {
            'abstractionProblemDecompositionCtScore': 2,
            'parallelismCtScore': 2,
            'logicalThinkingCtScore': 2,
            'synchronizationCtScore': 2,
            'flowControlCtScore': 2,
            'userInteractivityCtScore': 2,
            'dataRepresentationCtScore': 2,
            'difficulty': 1,
        },
        102: {
            'abstractionProblemDecompositionCtScore': 2,
            'parallelismCtScore': 2,
            'logicalThinkingCtScore': 2,
            'synchronizationCtScore': 2,
            'flowControlCtScore': 2,
            'userInteractivityCtScore': 2,
            'dataRepresentationCtScore': 2,
            'difficulty': 2,
        },
    },
    # Recommend 104/105 next
    8: {
        100: { # Game ID (above)
            'abstractionProblemDecompositionCtScore': 2,
            'parallelismCtScore': 2,
            'logicalThinkingCtScore': 2,
            'synchronizationCtScore': 2,
            'flowControlCtScore': 2,
            'userInteractivityCtScore': 2,
            'dataRepresentationCtScore': 2,
            'difficulty': 1
        },
        101: {
            'abstractionProblemDecompositionCtScore': 2,
            'parallelismCtScore': 2,
            'logicalThinkingCtScore': 2,
            'synchronizationCtScore': 2,
            'flowControlCtScore': 2,
            'userInteractivityCtScore': 2,
            'dataRepresentationCtScore': 2,
            'difficulty': 1,
        },
        102: {
            'abstractionProblemDecompositionCtScore': 3,
            'parallelismCtScore': 3,
            'logicalThinkingCtScore': 3,
            'synchronizationCtScore': 3,
            'flowControlCtScore': 3,
            'userInteractivityCtScore': 3,
            'dataRepresentationCtScore': 3,
            'difficulty': 2,
        },
    },
}

mode = 'practise'

reco_type = 'student'

mock_args = {
    'body': {
        'recommendation_type': reco_type,
        'studentID': 2,
        'allGames': all_games,
        'featuresInfo': features_info,
        'enrollments': enrollments,
        'mode': mode
    }
}
