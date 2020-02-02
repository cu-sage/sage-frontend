### THIS IS THE ACTUAL LAMBDA FUNCTION. FOR TESTING, PLEASE USE test_program.py. ###
import json
import student_recommendation
import teacher_recommendation

def execute_handler(event, context):
    try:
        body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        
        recommendataions_list = []
        if body['recommendation_type'] == 'student':
            recommendataions_list = student_recommendation.execute_handler(body, context)
        elif body['recommendation_type'] == 'teacher':
            recommendataions_list = teacher_recommendation.execute_handler(body, context)
        else:
            raise Exception(
                "Only teacher and student recommendation suppored. Unsupported [recommendation_type].")

        ### DO NOT MODIFY RESPONSE; REQUIRED BY AWS LAMBDA FUNCTIONS ###
        return respond(None, recommendataions_list)
    except Exception as e:
        ### DO NOT MODIFY RESPONSE; REQUIRED BY AWS LAMBDA FUNCTIONS ###
        return respond(e, None)


def respond(err, res=None):
    ### DO NOT MODIFY RESPONSE; REQUIRED BY AWS LAMBDA FUNCTIONS ###
    return {
        "isBase64Encoded": 'false',
        'statusCode': '400' if err else '200',
        'body': err if err else json.dumps(res),
        'headers': {
            'Content-Type': 'application/json',
        },
    }
