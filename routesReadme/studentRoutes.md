# Student Routes

- ### `GET /student/recommendedCourses/student/:sid`
    Returns the recommended courses for a specified student.
    ### Response - 200 OK
    ```
    [
        {
            "courseName": "",
            "desc": "",
            "instructorID": "",
            "courseID": ""
        },
        {..}
        ]
    ```

- ### `GET /student/recentCourses/student/:sid`
    Returns the recent courses for a specified student.
    ### Response - 200 OK
    ```
    [
        {
            "courseName": "",
            "desc": "",
            "instructorID": "",
            "courseID": ""
        },
        {..}
        ]
    ```

- ### `POST /student/enroll/:cid/student/:sid`
    Enrolls a student to a specified course.
    ### Request Body
    (None)
    ### Response - 200 OK
    ```
    {
        "studentID": "",
        "courseID": "",
        "_id": ""
    }
    ```
- ### `GET /student/coursesEnrolled/student/:sid`
    Returns all the courses enrolled by the student.
    ### Response - 200 OK
    ```
    [
        {
            "courseID": ""
            "courseName": "",
            "desc": "",
            "instructorID": "",
            "ctConcepts": [],
            "features": [],
            "assignments": [
                {
                    "assignmentOrder": "",
                    "assignmentID": ""
                }, 
                {..}
            ],

        },
        {..}
    ]
    ```
- ### `GET /student/course/:cid/student/:sid`
    Returns information of a particular course with respect to a particular student. Information like enrolled or not, leaderboard, assignment progresses etc.
    ### Response - 200 OK
    ```
    {
        "courseName": "",
        "desc": "",
        "instructorID": "",
        "ctConcepts": [],
        "features": [],
        "assignments": [{
            "assignmentName": "",
            "assignmentID": "",
            "results": {
                "Abstraction": "",
                "Parallelization": "",
                "Logic": "",
                "Synchronization": "",
                "FlowControl": "",
                "UserInteractivity": "",
                "DataRepresentation": ""
            }
        }, {
            
        }, {
            
        }],
        "courseID": "",
        "isEnrolled": true/false
    }
    ```
