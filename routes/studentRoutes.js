var express = require('express');
var router = express.Router();
var path = require('path');
var userModel = require('../models/userModel');
var courseModel = require('../models/courseModel');
var assignmentModel = require('../models/assignmentModel.js');
var enrollmentCourseModel = require('../models/enrollmentCourseModel.js');
var externalURLs = require ('../config/externalURLs.js');
var fetch =  require ('node-fetch');



function prepareHashedEnrollments (object) {

    let hashedEnrollments = {};
    object.map ((singleEnrollment) => {
        if ( hashedEnrollments.hasOwnProperty(singleEnrollment.studentID) ) {
            hashedEnrollments[singleEnrollment.studentID][singleEnrollment.courseID] = 5
        } else {
            hashedEnrollments[singleEnrollment.studentID] = {}
            hashedEnrollments[singleEnrollment.studentID][singleEnrollment.courseID] = 5
        }
    });

    return hashedEnrollments;


}


function preparePayloadForRecommenderEngine (hashedEnrollments, studentID) {
    return  {
        "httpMethod" : "POST",
        "StudentID": studentID,
        "body" : {
            "enrollments" : hashedEnrollments
        }
    };
}

router.get("/", function(req, res) {
    res.sendFile("student_index.html", {
        root: path.join(__dirname, '../public/views')
    });
});

router.get('/recommendedCourses/student/:sid', function(req, res) {

    //getting random two courses.
    let studentID = req.params.sid;

    enrollmentCourseModel.find().lean().exec()
    .then(function(response, error) {
        
        let hashedEnrollments = prepareHashedEnrollments (response);
        let payloadForRecommenderEngine = preparePayloadForRecommenderEngine (hashedEnrollments,studentID)
        return fetch (externalURLs.RECOMMENDATION_SERVER + 'Recommend', {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify (payloadForRecommenderEngine)
        })
        //TODO - handle error.

        
    })
    .then ((responseFromRecommenderEngine) => {
        return responseFromRecommenderEngine.json();
    })
    .then((json) => {

        return courseModel.find({
            "_id" : {
                '$in' : json.body
            }
        }).lean().exec();
        
    })
    .then((courses) => {
        let returnResponse = courses.map ((singleCourse) => {
            singleCourse.courseID = singleCourse._id;
            return singleCourse;
        });

        res.status(200).send(returnResponse)
    });

});

router.get('/recentCourses/student/:sid', function(req, res) {

    //getting random courses for now - NEEDS TO BE IMPLEMENTED

    courseModel.find().lean().exec()
    .then(function(response, error) {
        //TODO - handle error.

        let returnResponse = response.map ((singleCourse) => {
            singleCourse.courseID = singleCourse._id;
            return singleCourse;
        });

        res.status(200).send(returnResponse);
    });

});


router.post ('/enroll/:cid/student/:sid', function (req, res) {

    let {cid,sid} = req.params;
    //TODO fill the assignments array with data before saving.
    
    enrollmentCourseModel.create({studentID : sid, courseID : cid, assignments : []})
    .then((response) => {
        if (response) {
            res.send(response);
        }
    }).catch((error) => {
        res.status(500).send({error: error});
    });

});


router.get ('/coursesEnrolled/student/:sid', function (req, res) {

    let sid = req.params.sid;

    let allCoursesEnrolledIDs = [];
    enrollmentCourseModel.find({studentID:sid}).lean().exec()
    .then((response, error) => {

        response.map((singleEnrollment) => {
            allCoursesEnrolledIDs.push(singleEnrollment.courseID);

        });

        return courseModel.find({'_id': {'$in' : allCoursesEnrolledIDs}}).lean().exec();

    }).then((response, error) => {

        let returnResponse = response.map ((singleCourse) => {
            singleCourse.courseID = singleCourse._id;
            return singleCourse;
        });

        res.status(200).send(returnResponse);

    }).catch((error) => {

        res.status(500).send({error:error});
    });



});


router.get ('/course/:cid/leaderboard', function (req, res) {
    let {cid} = req.params;
    let studentScoreHash = {};

    Promise.all ([getCourseObject(cid), getAllEnrollments(cid)])
    .then ((allData) => {
        let courseObject = allData[0];
        let enrollments = allData[1];
        let allStudentIDs = getAllStudentIDsFromEnrollment (enrollments);
        let allAssigmentIDs = getAllAssignmentIdsFromCourseObject (courseObject);
        
        return {allAssigmentIDs, allStudentIDs};


    })
    .then ((response) => {
        let {allStudentIDs, allAssigmentIDs} = response;

        let fetches = allAssigmentIDs.map ((singleAssignmentID) => {

            return fetchProgressObjectsForParticularAssignmentID(singleAssignmentID, allStudentIDs);
        });



        return Promise.all(fetches);

    })
    .then((responses) => {

        let allJsons = responses.map ((singleResponse) => {
            return singleResponse.json();
        });
        return Promise.all(allJsons)
    })
    .then((allJSONS)=> {
        let allProgresses = []
        allJSONS.map((singleAssignmentProgresses) => {
            
            singleAssignmentProgresses.map (singleStudentProgress => {

                allProgresses.push( singleStudentProgress );
            });
        });


        return allProgresses;

    })
    .then ((allProgresses) => {
        let studentHash = {};

        allProgresses.map ((singleProgress) => {

            if ( studentHash.hasOwnProperty( singleProgress.studentID) ) {

                studentHash[singleProgress.studentID] += getScore(singleProgress.results);
            } else {
                studentHash[singleProgress.studentID] = getScore(singleProgress.results);
            }

        });

        return studentHash;
    })
    .then ((studentHash) => {
        var studentIDs = [];
        studentScoreHash = studentHash;
        for (var k in studentHash) studentIDs.push(k);

        return userModel.find ({_id : studentIDs}).lean().exec();
        
    })
    .then ((students) => {
        let responseToBeSent = students.map ((singleStudent) => {
            singleStudent.points = studentScoreHash[singleStudent._id];
            return singleStudent;
        });
        res.send(responseToBeSent);
    })
    .catch ((err) => {
        console.log(err);
        res.status (500).send(err);
    });

});


router.get ('/course/:cid/student/:sid', function (req, res) {

    let cid = req.params.cid;
    let sid = req.params.sid;

    //TODO put the progress of the sid in the object - Enrollment done. Do assignment progress now.
    let course = {};
    let assignmentsHash = {};
    let allAssigmentIDs = [];

    courseModel.findOne({'_id' : cid}).lean().exec()
    .then((response, error) => {
        //res.send(response);
        course = response;
        course.courseID = course._id;
        if (course) {

            allAssigmentIDs = course.assignments.map((singleAssignment) => {
                assignmentsHash[singleAssignment.assignmentID] = singleAssignment;
                return singleAssignment.assignmentID;
            });

            return assignmentModel.find({'_id': {'$in' : allAssigmentIDs}}).lean().exec();

        } else { 

            //TODO - handle error
        }
        

    }).then((response, error) => {
        response.map((singleAssignment) =>{

            assignmentsHash[singleAssignment._id] = Object.assign({}, singleAssignment, {assignmentID : singleAssignment._id});

        });
        
        course.assignments = []

        for (key in assignmentsHash) {
            course.assignments.push(assignmentsHash[key])
        }

        return enrollmentCourseModel.findOne({"studentID" : sid , "courseID" : cid}).lean().exec()

    }).then((response, error) => {
        course.isEnrolled = (response) ? true : false;

        if (course.isEnrolled) {

            let callingURL = externalURLs.NODE_SERVER + 'progress/student/' + sid + '?assignmentIDs=' + allAssigmentIDs.join(',');
            console.log(callingURL);
            return fetch(callingURL , {
                headers : {
                    'Content-type' : 'application/json'
                }
            });

        }
        
        
        
    }).then((responseNode) => {
        if (responseNode) {

            return responseNode.json();
        }
        
        
    }).then ((nodeJSON) => {
        if (nodeJSON) {
            nodeJSONHash = {}
            if (nodeJSON) {
                
                nodeJSON.map ((singleAssignment) => {
                    nodeJSONHash[singleAssignment.assignmentID] = singleAssignment;
                });

            }
            

            course.assignments.map ((singleAssignment) => {
                singleAssignment.results = {};
                singleAssignment.results = nodeJSONHash[singleAssignment.assignmentID] &&  nodeJSONHash[singleAssignment.assignmentID].results;
            });

        }

        
        res.send(course);
    })
    .catch ((error) => {
        console.log(error);
        res.status(500).send({error:error});
    })

});

let getCourseObject = (cid) => {
        return courseModel.findOne ({_id : cid});
};

let getAllEnrollments = (cid) => {
        return enrollmentCourseModel.find ({courseID : cid});
};

let getAllStudentIDsFromEnrollment = (enrollments) => {
    return enrollments.map ((singleEnrollment) => {
            return singleEnrollment.studentID;
    });

};
let getAllAssignmentIdsFromCourseObject = (courseObject) => {
    let allAssigments = courseObject.assignments; 
    return allAssigments.map ((singleAssignment) => {
        return singleAssignment.assignmentID;
    });
};

let fetchProgressObjectsForParticularAssignmentID = (assignmentID, studentIDs) => {

    return fetch(externalURLs.NODE_SERVER + 'progress/assignment/' + assignmentID + '?studentIDs=' + studentIDs.join(','));

};
let getScore = (resultsObject) => {
    let score = 0;
    for (key in resultsObject) {
        score += resultsObject[key]
    }
    return score;

};
module.exports = router;