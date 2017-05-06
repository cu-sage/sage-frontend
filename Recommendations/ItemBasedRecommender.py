def createItemList(dataset):
    listOfCourses=[]
    for person in dataset:
        for item in dataset[person]:
            if item in listOfCourses:
                continue
            else:
                listOfCourses.append(item)

    return listOfCourses

def similarityItem(item1,item2,dataset):
    score=0
    for person1 in dataset:
        if item1 in dataset[person1] and item2 in dataset[person1]:
            score +=1

    return score

def my_handler(event, context):

    person=event['StudentID']
    dataset=event['enrollments']
    totals = {}
    simSums = {}
    rankings_list = []
    courses=createItemList(dataset)
    for item in courses:
        if item in dataset[person]:
            continue
        for item2 in dataset[person]:
            totals.setdefault(item, 0)
            totals[item]+=similarityItem(item,item2,dataset)


    rankings = [(total, item) for item, total in totals.items()]
    rankings.sort()
    rankings.reverse()
    print rankings
    # returns the recommended items
    recommendataions_list = [recommend_item for score, recommend_item in rankings]
    fin = recommendataions_list[:2]

    return {
        'reco1' : fin[0],
        'reco2' : fin[1]
    }

aglist = {'StudentID' : 7 , 'enrollments' : {
        1: {'Inheritance Concepts': 5.0,
                            'Applications of inheritance': 5.0,
                            'Inheritance and Polymorphism': 5.0,
                            'Algorithmic thinking': 5.0,
                            'Concepts of abstraction': 5.0,
                            'Applying algorithms': 5.0},
            2: {'Inheritance Concepts': 5.0,
                             'Applications of inheritance': 5.0,
                            'Inheritance and Polymorphism': 5.0,
                             'Algorithmic thinking': 5.0,
                            'Applying algorithms': 5.0,
                            'Concepts of abstraction': 5.0},

            3: {'Inheritance Concepts': 5.0,
                                'Applications of inheritance': 5.0,
                                'Algorithmic thinking': 5.0
                                 },
            4: {'Applications of inheritance': 5.0,
                            'Inheritance and Polymorphism': 5.0,
                            'Applying algorithms': 5.0,
                            'Algorithmic thinking': 5.0,
                            'Concepts of abstraction': 5.0},
            5: {'Inheritance Concepts': 5.0,
                            'Applications of inheritance': 5.0,
                            'Inheritance and Polymorphism': 5.0,
                            'Algorithmic thinking': 5.0,
                            'Applying algorithms': 5.0,
                            'Concepts of abstraction': 5.0},
            6: {'Inheritance Concepts': 5.0,
                            'Applications of inheritance': 5.0,
                            'Applying algorithms': 5.0,
                            'Algorithmic thinking': 5.0,
                            'Concepts of abstraction':5.0},
            7: {'Applications of inheritance':5.0,
                    'Algorithmic thinking':5.0}}}
res= my_handler(aglist,1)
print res
