# return the final score of each game in the classroom
def process(games, features_info):
    current_games = []
    result = {}
    for game in games:
        a = games[game]
        current_games.append(game)
        # Each ctConcept can have max score of 3
        total_score = 0
        for feature in features_info:
            f_info = features_info[feature]
            f_type = f_info['type']
            f_weight = f_info['weight']
            value = a[feature]
            if (f_type == 'array'):
                # This is an array
                max_possible_score = len(value) * f_info['maxValue']
                total_score += (sum(value)/max_possible_score)**f_weight
            elif (f_type == 'scalar'):
                # This is a scaler
                total_score += (value/f_info['maxValue'])*f_weight
            else:
                raise Exception('Unsupported Feature Type' + f_type)
        total_score = total_score / len(features_info)
        result[game] = total_score
    return result, current_games


def compute_mastery(all_games, class_games, class_final_score):
    mastery = {}
    for game in class_games:
        score = class_final_score[game]
        b = all_games.get(game)
        c = b['ctConcepts']
        for ct in c:
            if ct not in mastery or mastery.get(ct) < score:
                mastery[ct] = score
    return mastery


def give_reco(all_games, mastery, mode, current_games):
    next_games = {}
    improve_games = {}
    struggling = []
    reco_list = {}
    for game in all_games:
        b = all_games.get(game)
        c = b['ctConcepts']
        sim = 0
        for ct in c:
            if ct in mastery:
                if mastery.get(ct) <=1:
                    sim += 0.33
                    struggling.append(ct)
                elif mastery.get(ct) <= 2:
                    sim += 0.66
                else: 
                    sim += 1
        sim = sim/len(c)
        if sim < 0.9:
            next_games[game] = sim
    for game in all_games:
        a = all_games[game]
        b = a['ctConcepts']
        count = 0
        for ct in struggling:
            if ct in b:
                count += 1
        if count / len(b) >= 0.66:
            improve_games[game] = count / len(b)
    reco_list = combine_games(improve_games, next_games, mode)
    rankings = [(sim, game) for game, sim in reco_list.items()]
    rankings.sort()
    rankings.reverse()
    reco = [game for sim, game in rankings]
    reco = list(set([x for x in reco if x not in current_games]))
    return reco[:3]


def combine_games(improve_games, next_games, mode):
    reco_list = {}
    if(mode == 'practise'):
        # Practise Mode: improve game: 0.6, next game: 0.4
        improve_weight = 0.6
        next_weight = 0.4
    elif(mode == 'learn'):
        # Learn Mode: improve game: 0.4, next game: 0.6
        improve_weight = 0.4
        next_weight = 0.6
    for game in improve_games:
        value = improve_games.get(game)
        value = value*improve_weight
        reco_list[game] = value
    for game in next_games:
        value = next_games.get(game)
        value = value*next_weight
        reco_list[game] = value
    return reco_list


def execute_handler(body, context):
    features_info = body['featuresInfo']
    classroom = body['classroom']
    games = body['allGames']
    mode = body['mode']

    class_final_score, current_games = process(classroom, features_info)
    mastery = compute_mastery(games, classroom, class_final_score)
    reco_list = give_reco(games, mastery, mode, current_games)
    return reco_list
