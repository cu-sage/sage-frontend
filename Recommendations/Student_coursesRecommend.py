from __future__ import print_function

import boto3
import json

print('Loading function')


def respond(err, res=None):
    return {
        'statusCode': '400' if err else '200',
        'body': err.message if err else (res),
        'headers': {
            'Content-Type': 'application/json',
        },
    }


def similarity_score(person1, person2, dataset):
    # Returns ratio Euclidean distance score of person1 and person2

    both_viewed = {}  # To get both rated items by person1 and person2
    score = 0
    for item in dataset[person1]:
        if item in dataset[person2]:
            score += 1
    return score


def most_similar_users(person, number_of_users, dataset):
    # returns the number_of_users (similar persons) for a given specific person.
    scores = [(similarity_score(person, other_person), other_person) for other_person in dataset if
              other_person != person]

    # Sort the similar persons so that highest scores person will appear at the first
    scores.sort()
    scores.reverse()
    return scores[0:number_of_users]


def give_reco(person, dataset):
    # person=event['StudentID']
    # dataset=event['enrollments']
    totals = {}
    simSums = {}
    rankings_list = []
    for other in dataset:
        # don't compare me to myself
        if other == person:
            continue
        sim = similarity_score(person, other, dataset)
        # ignore scores of zero or lower
        if sim <= 0:
            continue
        for item in dataset[other]:

            # only score movies i haven't seen yet
            if item not in dataset[person] or dataset[person][item] == 0:
                # Similrity * score
                totals.setdefault(item, 0)
                totals[item] += sim
                # Create the normalized list

    rankings = [(total, item) for item, total in totals.items()]
    rankings.sort()
    rankings.reverse()
    # print rankings
    # returns the recommended items
    recommendataions_list = [recommend_item for score, recommend_item in rankings]
    fin = recommendataions_list[:2]
    result = []
    result.append(fin[0])
    result.append(fin[1])

    return result


def lambda_handler(event, context):
    '''Demonstrates a simple HTTP endpoint using API Gateway. You have full
    access to the request and response payload, including headers and
    status code.

    To scan a DynamoDB table, make a GET request with the TableName as a
    query string parameter. To put, update, or delete an item, make a POST,
    PUT, or DELETE request respectively, passing in the payload to the
    DynamoDB API as a JSON body.
    '''
    print("Received event: " + json.dumps(event, indent=2))

    operation = event['httpMethod']
    if operation == 'POST':
        print(event['body'])
        payload = (event['body'])
        person = event['StudentID']

        dataset = payload['enrollments']
        recom_res = give_reco(person, dataset)

        return respond(None, recom_res)
    else:
        return respond(ValueError('Unsupported method "{}"'.format(operation)))
