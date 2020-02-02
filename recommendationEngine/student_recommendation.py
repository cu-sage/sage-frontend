import math

def computer_similar_students(current_student, features_info, dataset):
    sim_students = {}
    # Iterate through all students and find similarities
    for student in dataset:
        sim_students.setdefault(student, 0)
        sim_students[student] += compute_similar_students(
            current_student, student, features_info, dataset)
    return sim_students

def compute_similar_students(current_student, other_student, features_info, dataset):
    current_student_games = dataset[current_student]
    other_student_games = dataset[other_student]
    common_games = []
    score1 = []
    score2 = []

    # Find common games between both students
    for game in current_student_games:
        if game in other_student_games:
            common_games.append(game)

    average_score1, final_score1 = process(current_student_games, features_info)
    average_score2, final_score2 = process(other_student_games, features_info)

    for game in common_games:
        score1.append(final_score1[game]-average_score1)
        score2.append(final_score2[game]-average_score2)
        
    a = 0
    b = 0
    c = 0
    for i in range(len(score1)):
        a += score1[i]*score2[i]
        b += score1[i]*score1[i]
        c += score2[i]*score2[i]
    if b == 0 or c == 0:
        return 0
    return a/(math.sqrt(b)*math.sqrt(c))


def process(games, features_info):
    result = {}
    average = 0
    for game in games:
        a = games[game]
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
        average += total_score
    return average/len(games), result

# item-based recommendatation (multi-criteria)
def give_reco(fin_students, current_student, dataset, games, features_info, mode):
    current_games = dataset[current_student]
    game_candidates = []
    for student in fin_students:
        for game in dataset[student]:
            if game not in current_games:
                game_candidates.append(game)
    a, final_score = process(current_games, features_info)
    mastery = {}
    next_games = {}
    struggling = []
    # compute the mastery of each ctconcepts
    for game in current_games:
        score = final_score[game]
        b = games.get(game)
        c = b['ctConcepts']
        for ct in c:
            if ct not in mastery or mastery.get(ct) < score:
                mastery[ct] = score
    # compute the similarity of games in game candidates
    # if one ctconcept in a given game <=1, the similarity plus 0.33
    for game in game_candidates:
        b = games.get(game)
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
    # Struglling algorithm
    improve_games = {}
    for game in games:
        a = games[game]
        b = a['ctConcepts']
        count = 0
        for ct in struggling:
            if ct in b:
                count += 1
        if count/len(b) >= 0.66:
            improve_games[game] = count/len(b)
    reco_list = combine_games(improve_games, next_games, mode)
    rankings = [(sim, game) for game, sim in reco_list.items()]
    rankings.sort()
    rankings.reverse()
    reco = [game for sim, game in rankings]
    reco = list(set([x for x in reco if x not in current_games]))
    return reco[3:]

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
    current_student = body['studentID']
    dataset = body['enrollments']
    features_info = body['featuresInfo']
    games = body['allGames']
    mode = body['mode']

    sim_students = computer_similar_students(current_student, features_info, dataset)
    
    rankings = [(sim, student) for student, sim in sim_students.items()]
    rankings.sort()
    rankings.reverse()
    # find the similar students
    similar_students = [student for sim, student in rankings]
    print(similar_students)
    fin_students = similar_students[:3]
    recommendataions_list = give_reco(fin_students, current_student, dataset, games, features_info, mode)
    print(recommendataions_list)
    return recommendataions_list
    