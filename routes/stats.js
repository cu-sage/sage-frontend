var express = require('express');
var authService = require('../services/authService');
var router = express.Router();
var userModel = require('../models/userModel');
var questModel = require('../models/questModel');
var gameModel = require('../models/gameModel.js');
var mongoose = require('mongoose');
var enrollmentCourseModel = require('../models/enrollmentCourseModel.js');
var learningPathModel = require('../models/learningPathModel.js');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var service = require('../services/service');
var curriculaItemModel = require('../models/curriculaItemModel.js');

router.get("/students/coursesEnrolled/:sid", function(req, res) {
    authService.getUser(req, function(user) {
        var userId = user._id;
        var fullname = user.fullname;
        // console.log(userId);
        if (userId != -1) {
            userModel.findById(userId, function (err, user) {
                if (err) {
                    console.log(err);
                    return;
                }
                // console.log('user: ' + user);
                if (user.fullname == req.params.id) {
                    var postId = req.params.id;
                    var data = require('../staticData/' + req.params.id + '-student.json');
                    res.send(JSON.stringify(data));
                } else {
                    res.status(403).send({'status': 'failed', 'message': 'Not authorized1.'});
                }
            });
        } else {
            res.status(403).send({'status': 'failed', 'message': 'Not authorized2.'});
        }
    });
});

router.get("/students/:id", function(req, res) {
    authService.getUser(req, function(user) {
        var userId = user._id;
        var fullname = user.fullname;
        // console.log(userId);
        if (userId != -1) {
            userModel.findById(userId, function (err, user) {
                if (err) {
                    console.log(err);
                    return;
                }
                // console.log('user: ' + user);
                if (user.fullname == req.params.id) {
                    var postId = req.params.id;
                    var data = require('../staticData/' + req.params.id + '-student.json');
                    res.send(JSON.stringify(data));
                } else {
                    res.status(403).send({'status': 'failed', 'message': 'Not authorized1.'});
                }
            });
        } else {
            res.status(403).send({'status': 'failed', 'message': 'Not authorized2.'});
        }
    });
});

router.get("/instructors/:id", function(req, res) {
    authService.getUser(req, function(user) {
        var userId = user._id;
        var fullname = user.fullname;
        if (userId != -1) {
            userModel.findById(userId, function (err, user) {
                if (err) {
                    console.log(err);
                    return;
                }
                if (user.fullname == req.params.id) {
                    var postId = req.params.id;
                    var data = require('../staticData/' + req.params.id + '-instructor.json');
                    res.send(JSON.stringify(data));
                } else {
                    res.status(403).send({'status': 'failed', 'message': 'Not authorized.'});
                }
            });
        } else {
            res.status(403).send({'status': 'failed', 'message': 'Not authorized.'});
        }
    });

});

router.get("/instructors/quests_home/:id", function(req, res) {
    var id = req.params.id;
    //console.log(id);

    questModel.find({instructorID:id}).lean().limit(2).exec()
    .then(function(response, error) {
        //TODO - handle error.

        let returnResponse = response.map ((singleQuest) => {
            singleQuest.questID = singleQuest._id;
        return singleQuest;
        });

        res.status(200).send(returnResponse);
    });


});

router.get("/instructors/LP/:id", function(req, res) {
    var id = req.params.id;
    //console.log(id);

    learningPathModel.find({creatorID:id}).lean().exec()
    .then(function(response, error) {
        //TODO - handle error.

        let returnResponse = response.map ((singleLP) => {
            singleLP.LPID = singleLP._id;
            return singleLP;
        });

        res.status(200).send(returnResponse);
    });

});

router.get("/instructors/questsby/:id", function(req, res) {
    var id = req.params.id;
    //console.log(id);

    questModel.find({instructorID:id}).lean().exec()
    .then(function(response, error) {
        //TODO - handle error.

        let returnResponse = response.map ((singleQuest) => {
            singleQuest.questID = singleQuest._id;
            return singleQuest;
        });

        res.status(200).send(returnResponse);
    });
});

router.get("/instructors/:id/LP/:LPid", function(req, res) {
    let id = req.params.id;
    let LPid = req.params.LPid;


    let allQuestsIDs = [];
    var allquests;
    learningPathModel.find({_id:LPid}).lean().exec()
    .then((response, error) => {

        allquests=response[0].courses;
        //console.log(allquests[0]);
        //console.log(allquests.length);
        for (quest1 in allquests){
            //console.log(allquests[quest1]);
            allQuestsIDs.push(allquests[quest1].QuestID);
        }
        //console.log(allQuestsIDs);
        return questModel.find({'_id': {'$in' : allQuestsIDs}}).lean().exec();

    }).then((response, error) => {

        let returnResponse = response.map ((singleQuest) => {
            singleQuest.questID = singleQuest._id;
            return singleQuest;
            //console.log(returnResponse);

            res.status(200).send(returnResponse);
        });
    });

});

router.get("/instructors/:id/LPinfo/:LPid", function(req, res) {
    let id = req.params.id;
    let LPid = req.params.LPid;


    //let allQuestsIDs = [];
    learningPathModel.find({_id: { $in: [ LPid ] }}).lean().exec()
    .then(function(response, error) {

        let returnResponse = response.map ((singleLP) => {
            singleLP.LPID = singleLP._id;
            return singleLP;
        });
        res.status(200).send(returnResponse);
    });

});

router.get("/instructors/:id/quests/:cid", function(req, res) {
    let id = req.params.id;
    let cid = req.params.cid;


    //let allQuestsIDs = [];
    questModel.find({_id: { $in: [ cid ] }}).lean().exec()
    .then(function(response, error) {

        let returnResponse = response.map ((singleQuest) => {
            singleQuest.questID = singleQuest._id;
        return singleQuest;
        });

        res.status(200).send(returnResponse);
    });
});

router.get("/researchers/:id", function(req, res) {
    authService.getUser(req, function(user) {
        var userId = user._id;
        var fullname = user.fullname;
        if (userId != -1) {
            userModel.findById(userId, function (err, user) {
                if (err) {
                    console.log(err);
                    return;
                }
                if (user.fullname == req.params.id) {
                    var postId = req.params.id;
                    var data = require('../staticData/' + req.params.id + '-instructor.json');
                    res.send(JSON.stringify(data));
                } else {
                    res.status(403).send({'status': 'failed', 'message': 'Not authorized.'});
                }
            });
        } else {
            res.status(403).send({'status': 'failed', 'message': 'Not authorized.'});
        }
    });

});

router.get("/instructors/:id/quests/:cid/hw/:hid", function(req, res) {
    authService.getUser(req, function(user) {
        var userId = user._id;
        var fullname = user.fullname;
        // console.log(userId);
        if (userId != -1) {
            userModel.findById(userId, function (err, user) {
                if (err) {
                    // console.log(err);
                    callback(err);
                    return;
                }
                if (user.fullname == req.params.id) {
                    var postId = req.params.id;
                    var instructor_data = require('../staticData/' + req.params.id + '-instructor.json');
                    var response = [];
                    var quests = instructor_data.quests;
                    for (var quest = 0; quest < quests.length; quest++) {
                        //console.log(quests[quest]);
                        if (quests[quest].id == req.params.cid) {
                            // console.log(quests[quest].id);
                            var students = quests[quest].students;

                            for (var i = 0; i < students.length; i++) {
                                var student_id = students[i];
                                var student_data = require('../staticData/' + student_id + '-student.json');
                                var build = {};
                                build["name"] = student_data.name;
                                build["id"] = student_data.id;
                                for (var j = 0; j < student_data.number_of_courses; j++) {
                                    if (student_data.quests[j].id == req.params.cid) {
                                        build["score"] = student_data.quests[j].individual[req.params.hid - 1];
                                    }
                                }
                                response.push(build);

                            }
                        }
                    }
                    var average = instructor_data.quests[req.params.cid - 1].hw_averages[req.params.hid - 1];
                    res.send(JSON.stringify({data: response, average: average}));
                } else {
                    res.status(403).send({'status': 'failed', 'message': 'Not authorized.'});
                }
            });
        } else {
            res.status(403).send({'status': 'failed', 'message': 'Not authorized.'});
        }
    });

});

router.post("/instructors/createQuest/:id", function(req, res) {
    console.log("In stats routes");
    console.log(req.body);
    var InstrId = req.params.id;
    service.newquest(req.body.questname, req.body.desc, InstrId ,req.body.features , req.body.ctconcepts,
        function(json) {
            if (json.status === 409) {
                res.status(409).send({message: json.message});
            }
            else if (json.status === 200) {
                res.status(200).send({message: json.message});
            }
            else {
                res.status(404).send({message: json.message});
            }
        });
});

router.post("/instructors/createLP/:id", function(req, res) {
    console.log("In stats routes");
    console.log(req.body);
    var InstrId = req.params.id;
    service.newLP(req.body.LPname, req.body.desc, InstrId ,req.body.features , req.body.ctconcepts,
        function(json) {
            if (json.status === 409) {
                res.status(409).send({message: json.message});
            }
            else if (json.status === 200) {
                res.status(200).send({message: json.message});
            }
            else {
                res.status(404).send({message: json.message});
            }
        });
});

router.post("/instructors/:id/quest/:cid/createGame", function(req, res) {
    //console.log("In stats routes");
    console.log(req.body);
    var InstrId = req.params.id;
    var questid = req.params.cid;
    service.newassignment(req.body, InstrId ,questid,
        function(json) {
            if (json.status === 409) {
                res.status(409).send({message: json.message});
            }
            else if (json.status === 200) {
                res.status(200).send({message: json.message});
            }
            else {
                res.status(404).send({message: json.message});
            }
        });
});

router.post("/instructors/:id/LP/:LPid/addCourse/:cid", function(req, res) {
    //console.log("In stats routes");
    console.log(req.body);
    var InstrId = req.params.id;
    var LPid = req.params.LPid;
    service.addCoursetoLP(req.body.order, req.params.cid, LPid,
        function(json) {
            if (json.status === 409) {
                res.status(409).send({message: json.message});
            }
            else if (json.status === 200) {
                res.status(200).send({message: json.message});
            }
            else {
                res.status(404).send({message: json.message});
            }
        });
});

router.post("/instructors/Quest/:cid/game/:aid", function(req,res){
    console.log(req.body);
    var Questid = req.params.cid;
    var Gameid = req.params.aid;
    var assignments = req.body.assignments;
    service.removeAssignment(Questid, assignments,
        function(json) {
            if (json.status === 409) {
                res.status(409).send({message: json.message});
            }
            else if (json.status === 200) {
                res.status(200).send({message: json.message});
            }
            else {
                res.status(404).send({message: json.message});
            }
        });
});

router.post("/instructors/updateQuest/:cid", function(req, res) {
    //console.log("In stats routes");
    console.log(req.body);
    var Questid = req.params.cid;
    service.updateCourse(req.body.questname, req.body.desc , Questid,
        function(json) {
            if (json.status === 409) {
                res.status(409).send({message: json.message});
            }
            else if (json.status === 200) {
                res.status(200).send({message: json.message});
            }
            else {
                res.status(404).send({message: json.message});
            }
        });
});

router.post("/instructors/:id/LP/:LPid/updateCourseOrder", function(req, res) {
    //console.log("In stats routes");
    console.log(req.body);
    var InstrId = req.params.id;
    var LPid = req.params.LPid;
    service.updateCourseOrderInLP(req.body.courses, LPid,
        function(json) {
            if (json.status === 409) {
                res.status(409).send({message: json.message});
            }
            else if (json.status === 200) {
                res.status(200).send({message: json.message});
            }
            else {
                res.status(404).send({message: json.message});
            }
        });
});

router.post("/instructors/quest/:cid/updateGameOrder", function(req, res) {
    //console.log("In stats routes");
    console.log(req.body);
    //var InstrId = req.params.id;
    //var LPid = req.params.LPid;
    var questid = req.params.cid;
    console.log("going into update game stat");
    service.updateAssignmentOrderInQuest(req.body.assignments, questid,
        function(json) {
            if (json.status === 409) {
                res.status(409).send({message: json.message});
            }
            else if (json.status === 200) {
                res.status(200).send({message: json.message});
            }
            else {
                res.status(404).send({message: json.message});
            }
        });
});

router.get("/instructors/:id/curricula_items", function(req, res) {


    curriculaItemModel.find({}).lean().exec()
    .then(function(response, error) {
        console.log(response);
        res.status(200).send(response);

    });

});

router.get("/instructors/:id/missions", function(req, res) {
    learningPathModel.find({}).lean().exec()
    .then(function(response, error) {
        console.log(response);
        res.status(200).send(response);

    });

});

router.get("/instructors/:id/quests", function(req, res) {

    questModel.find({}).lean().exec()
    .then(function(response, error) {
        console.log(response);
        res.status(200).send(response);

    });

});

router.get("/instructors/:id/games", function(req, res) {


    gameModel.find({}).lean().exec()
    .then(function(response, error) {
        console.log(response);
        res.status(200).send(response);

    });

});

router.get("/instructors/:id/quests/:Mid", function(req, res) {

    let missionId = req.params.Mid;

    learningPathModel.findById(missionId).lean().exec()
    .then(function(mission) {
        var quests = mission['quests'];

        var questIds = [];

        for(let i in quests) {
            questIds.push(mongoose.Types.ObjectId(quests[i]['QuestID']));
        }
        console.log(questIds)

        return questModel.find({ '_id' : { $in : questIds} }).lean().exec();

    })
    .then(function(quests) {
        console.log(quests)
        res.status(200).send(quests);
    })
    .catch(function(err) {
        console.log(err);
    });


});

router.get("/instructors/:id/games/:Qid", function(req, res) {

    let questId = req.params.Qid;

    questModel.findById(questId).lean().exec()
    .then(function(quest) {
        var games = quest['games'];

        var gameIds = [];

        for(let i in games) {
            gameIds.push(mongoose.Types.ObjectId(games[i]['gameID']));
        }
        //console.log(gameIds)

        return gameModel.find({ '_id' : { $in : gameIds} }).lean().exec();

    })
    .then(function(games) {
        console.log(games)
        res.status(200).send(games);
    })
    .catch(function(err) {
        console.log(err);
    });
});

module.exports = router;