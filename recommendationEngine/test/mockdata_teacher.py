import json
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

games_in_classroom = {
	100: { # score is the average score of all the students in the classroom
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
}

mode = 'practise'

reco_type = 'teacher'

mock_args = {
    'body': {
        'recommendation_type': reco_type,
        'allGames': all_games,
        'featuresInfo': features_info,
        'classroom': games_in_classroom,
        'mode': mode
    }
}

print(json.dumps(mock_args))