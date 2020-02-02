var express = require("express");
var authService = require("../services/authService");
var router = express.Router();
var userModel = require("../models/userModel");
var courseModel = require("../models/courseModel");
var assignmentModel = require("../models/assignmentModel.js");
var mongoose = require("mongoose");
var enrollmentCourseModel = require("../models/enrollmentCourseModel.js");
var learningPathModel = require("../models/learningPathModel.js");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var service = require("../services/service");
var curriculaItemModel = require("../models/curriculaItemModel.js");
var classModel = require("../models/classModel");
var commentTemplateModel = require("../models/commentTemplateModel");
var instructionModel = require("../models/instructionModel");
var badgedesModel = require("../models/badgedescriptionModel.js");
var CommentOfInstructionModel = require("../models/instructionCommentModel");
var JSON = require("JSON");

router.get("/students/coursesEnrolled/:sid", function(req, res) {
  authService.getUser(req, function(user) {
    var userId = user._id;
    var fullname = user.fullname;
    // console.log(userId);
    if (userId != -1) {
      userModel.findById(userId, function(err, user) {
        if (err) {
          console.log(err);
          return;
        }
        // console.log('user: ' + user);
        if (user.fullname == req.params.id) {
          var postId = req.params.id;
          var data = require("../staticData/" +
            req.params.id +
            "-student.json");
          res.send(JSON.stringify(data));
        } else {
          res
            .status(403)
            .send({ status: "failed", message: "Not authorized1." });
        }
      });
    } else {
      res.status(403).send({ status: "failed", message: "Not authorized2." });
    }
  });
});

router.get("/students/:id", function(req, res) {
  authService.getUser(req, function(user) {
    var userId = user._id;
    var fullname = user.fullname;
    // console.log(userId);
    if (userId != -1) {
      userModel.findById(userId, function(err, user) {
        if (err) {
          console.log(err);
          return;
        }
        // console.log('user: ' + user);
        if (user.fullname == req.params.id) {
          var postId = req.params.id;
          var data = require("../staticData/" +
            req.params.id +
            "-student.json");
          res.send(JSON.stringify(data));
        } else {
          res
            .status(403)
            .send({ status: "failed", message: "Not authorized1." });
        }
      });
    } else {
      res.status(403).send({ status: "failed", message: "Not authorized2." });
    }
  });
});

router.get("/instructors/:id", function(req, res) {
  authService.getUser(req, function(user) {
    var userId = user._id;
    var fullname = user.fullname;
    if (userId != -1) {
      userModel.findById(userId, function(err, user) {
        if (err) {
          console.log(err);
          return;
        }
        if (user.fullname == req.params.id) {
          var postId = req.params.id;
          var data = require("../staticData/" +
            req.params.id +
            "-instructor.json");
          //res.send(JSON.stringify(data));
        } else {
          res
            .status(403)
            .send({ status: "failed", message: "Not authorized." });
        }
      });
    } else {
      res.status(403).send({ status: "failed", message: "Not authorized." });
    }
  });
});

router.get("courses_home/:id", function(req, res) {
  var id = req.params.id;
  //console.log(id);
  courseModel
    .find({ instructorID: id })
    .lean()
    .limit(2)
    .exec()
    .then(function(response, error) {
      //TODO - handle error.

      let returnResponse = response.map(singleCourse => {
        singleCourse.courseID = singleCourse._id;
        return singleCourse;
      });

      res.status(200).send(returnResponse);
    });
});

router.get("/instructors/LP/:id", function(req, res) {
  var id = req.params.id;
  //console.log(id);
  learningPathModel
    .find({ creatorID: id })
    .lean()
    .exec()
    .then(function(response, error) {
      //TODO - handle error.

      let returnResponse = response.map(singleLP => {
        singleLP.LPID = singleLP._id;
        return singleLP;
      });

      res.status(200).send(returnResponse);
    });
});

router.get("/instructors/coursesby/:id", function(req, res) {
  var id = req.params.id;
  //console.log(id);

  courseModel
    .find({ instructorID: id })
    .lean()
    .exec()
    .then(function(response, error) {
      //TODO - handle error.
      console.log("this is the bug in course presenting page #########");
      console.log(response.data);
      let returnResponse = response.map(singleCourse => {
        singleCourse.courseID = singleCourse._id;
        return singleCourse;
      });

      console.log(returnResponse);
      res.status(200).send(returnResponse);
    });
});

router.get("/instructors/:id/LP/:LPid", function(req, res) {
  let id = req.params.id;
  let LPid = req.params.LPid;

  let allCoursesIDs = [];
  var allcourses;
  learningPathModel
    .find({ _id: LPid })
    .lean()
    .exec()
    .then((response, error) => {
      allcourses = response[0].courses;
      //console.log(allcourses[0]);
      //console.log(allcourses.length);
      for (course1 in allcourses) {
        //console.log(allcourses[course1]);
        allCoursesIDs.push(allcourses[course1].CourseID);
      }
      //console.log(allCoursesIDs);
      return courseModel
        .find({ _id: { $in: allCoursesIDs } })
        .lean()
        .exec();
    })
    .then((response, error) => {
      let returnResponse = response.map(singleCourse => {
        singleCourse.courseID = singleCourse._id;
        return singleCourse;
      });

      //console.log(returnResponse);

      res.status(200).send(returnResponse);
    });
});

router.get("/instructors/:id/LPinfo/:LPid", function(req, res) {
  let id = req.params.id;
  let LPid = req.params.LPid;

  //let allCoursesIDs = [];
  learningPathModel
    .find({ _id: { $in: [LPid] } })
    .lean()
    .exec()
    .then(function(response, error) {
      let returnResponse = response.map(singleLP => {
        singleLP.LPID = singleLP._id;
        return singleLP;
      });

      res.status(200).send(returnResponse);
    });
});

router.get("/instructors/:id/courses/:cid", function(req, res) {
  let id = req.params.id;
  let cid = req.params.cid;

  //let allCoursesIDs = [];
  courseModel
    .find({ _id: { $in: [cid] } })
    .lean()
    .exec()
    .then(function(response, error) {
      let returnResponse = response.map(singleCourse => {
        singleCourse.courseID = singleCourse._id;
        return singleCourse;
      });

      res.status(200).send(returnResponse);
    });
});

router.get("/researchers/:id", function(req, res) {
  authService.getUser(req, function(user) {
    var userId = user._id;
    var fullname = user.fullname;
    if (userId != -1) {
      userModel.findById(userId, function(err, user) {
        if (err) {
          console.log(err);
          return;
        }
        if (user.fullname == req.params.id) {
          var postId = req.params.id;
          var data = require("../staticData/" +
            req.params.id +
            "-instructor.json");
          res.send(JSON.stringify(data));
        } else {
          res
            .status(403)
            .send({ status: "failed", message: "Not authorized." });
        }
      });
    } else {
      res.status(403).send({ status: "failed", message: "Not authorized." });
    }
  });
});

router.get("/instructors/:id/courses/:cid/hw/:hid", function(req, res) {
  authService.getUser(req, function(user) {
    var userId = user._id;
    var fullname = user.fullname;

    if (userId != -1) {
      userModel.findById(userId, function(err, user) {
        if (err) {
          // console.log(err);
          callback(err);
          return;
        }
        if (user.fullname == req.params.id) {
          var postId = req.params.id;
          var instructor_data = require("../staticData/" +
            req.params.id +
            "-instructor.json");
          var response = [];
          var courses = instructor_data.courses;
          for (var course = 0; course < courses.length; course++) {
            //console.log(courses[course]);
            if (courses[course].id == req.params.cid) {
              // console.log(courses[course].id);
              var students = courses[course].students;

              for (var i = 0; i < students.length; i++) {
                var student_id = students[i];
                var student_data = require("../staticData/" +
                  student_id +
                  "-student.json");
                var build = {};
                build["name"] = student_data.name;
                build["id"] = student_data.id;
                for (var j = 0; j < student_data.number_of_courses; j++) {
                  if (student_data.courses[j].id == req.params.cid) {
                    build["score"] =
                      student_data.courses[j].individual[req.params.hid - 1];
                  }
                }

                response.push(build);
              }
            }
          }
          var average =
            instructor_data.courses[req.params.cid - 1].hw_averages[
              req.params.hid - 1
            ];
          res.send(JSON.stringify({ data: response, average: average }));
        } else {
          res
            .status(403)
            .send({ status: "failed", message: "Not authorized." });
        }
      });
    } else {
      res.status(403).send({ status: "failed", message: "Not authorized." });
    }
  });
});

// Class model routes

// get all classes belongs to a instructor
router.get("/instructors/:id/classes", function(req, res) {
  let instid = req.params.id;

  classModel
    .find({ isDeleted: false }, { instructorId: instid, name: "" })
    .lean()
    .exec()
    .then(function(response, error) {
      //console.log("here ",response)
      let returnResponse = response.map(function(singleClass) {
        //console.log("singleClass ", singleClass)
        var returnMe = [];
        var myClass = {
          classId: 1,
          className: "ss",
          missions: ["1", "2"]
        };
        //console.log("only reason ", singleClass.instructorId)
        if (instid == singleClass.instructorId) {
          myClass.classId = singleClass._id;
          myClass.className = singleClass.name;
          myClass.missions = singleClass.missions;
          returnMe.push(myClass);
        }
        return returnMe;
      });

      me = [];
      for (var i in returnResponse) {
        //console.log("me",returnResponse[i])
        if (
          !returnResponse[i] === undefined ||
          !returnResponse[i].length == 0
        ) {
          //console.log("what")
          me.push(returnResponse[i]);
        }
      }

      res.status(200).send(me);
    });
});

router.get("/instructors/:id/classes/:cid", function(req, res) {
  let instid = req.params.id;
  let classid = req.params.cid;

  classModel.findOne({ _id: classid }, function(err, response) {
    if (err) return res.status(200).send("cid not found");
    //.then(function(response, error) {
    res.status(200).send(response);

    //});
  });
});

/*router.get("/instructors/classes/:id", function(req, res) {
    authService.getUser(req, function(user) {
        var instructorId = user._id;
        var fullname = user.fullname;
        if (instructorId != -1) {
            classModel.findById(Id, function (err, user) {
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

});*/

// creating class
router.post("/instructors/classes/:id", function(req, res) {
  console.log("In stats routes create class");
  console.log(req.body);
  var InstrId = req.params.id;
  service.newclass(
    req.body.name,
    req.body.description,
    req.body.roster,
    req.body.missions,
    InstrId,
    function(json) {
      if (json.status === 409) {
        res.status(409).send({ message: json.message });
      } else if (json.status === 200) {
        res.status(200).send({ message: json.message });
      } else {
        res.status(404).send({ message: json.message });
      }
    }
  );
});

// update class to class isDeleted true
router.delete("/instructors/:iid/classes/:cid", function(req, res) {
  console.log("In stats delete class");
  //console.log(req.body);
  var class_id = req.params.cid;

  classModel.findOneAndUpdate(
    { _id: class_id },
    { $set: { isDeleted: true } },
    function(err, test_inserted) {
      if (err) return res.status(200).send("cid not found");
      //.then(function(response, error) {
      res.status(200).send(test_inserted);
    }
  );
  return;
});

// update class missions
router.put("/instructors/:iid/classes/:cid/updateMissions", function(req, res) {
  console.log("In stats routes update class missions");
  //console.log(req.body);
  var ClassId = req.params.cid;

  service.updateClassMissions(ClassId, req.body.missions, function(json) {
    if (json.status === 409) {
      res.status(409).send({ message: json.message });
    } else if (json.status === 200) {
      res.status(200).send({ message: json.message });
    } else {
      res.status(404).send({ message: json.message });
    }
  });
});

// update roster
router.put("/instructors/:iid/classes/:cid/updateRoster", function(req, res) {
  console.log("In stats routes update class roster");
  //console.log(req.body);
  var ClassId = req.params.cid;
  service.updateClassRoster(ClassId, req.body.roster, function(json) {
    if (json.status === 409) {
      res.status(409).send({ message: json.message });
    } else if (json.status === 200) {
      res.status(200).send({ message: json.message });
    } else {
      res.status(404).send({ message: json.message });
    }
  });
});

// copy class
router.post("/instructors/:iid/classes/copyClass", function(req, res) {
  //console.log("In stats copy class");
  //console.log(req.body);
  var instId = req.params.iid;
  service.copyClass(
    req.body.name,
    req.body.description,
    req.body.copyClassId,
    req.body.copyRosters,
    req.body.copyMissions,
    instId,
    function(json) {
      if (json.status === 409) {
        res.status(409).send({ message: json.message });
      } else if (json.status === 200) {
        res.status(200).send({ message: json.message });
      } else {
        res.status(404).send({ message: json.message });
      }
    }
  );
});

// update class information
router.put("/instructors/:iid/classes/:cid/updateInfo", function(req, res) {
  console.log("In stats routes update class roster");
  //console.log(req.body);
  var ClassId = req.params.cid;
  service.updateClassInformation(
    ClassId,
    req.body.name,
    req.body.description,
    function(json) {
      if (json.status === 409) {
        res.status(409).send({ message: json.message });
      } else if (json.status === 200) {
        res.status(200).send({ message: json.message });
      } else {
        res.status(404).send({ message: json.message });
      }
    }
  );
});

// upload roster
router.put("/instructors/:iid/classes/:cid/uploadRoster", function(req, res) {
  console.log("In stats routes update class roster");
  //console.log(req.body);
  var ClassId = req.params.cid;

  //var frmdta = new fs(req);
  // console.log(frmdta)

  req.on("data", function(chunk) {
    var bodydata = chunk.toString("utf8");
    console.log(bodydata);
    console.log(typeof bodydata);

    // get rid of unnecessary information
    var lines = bodydata.split("\n");
    lines.splice(0, 1);
    lines.splice(0, 1);
    lines.splice(0, 1);
    lines.splice(0, 1);
    lines.splice(lines.length - 1, 1);
    lines.splice(lines.length - 1, 1);

    // make into a single string
    var newtext = lines.join("\n");
    // replace all '\r' in strings
    newtext = newtext.replace(/\r/g, "");
    // remove extra spaces
    newtext = newtext.replace(/ /g, "");
    mydata = newtext.split("\n");
    for (var i = 0; i < mydata.length; i++) {
      mydata[i] = mydata[i].split(",");
    }

    // now we have an 2d array of firstname, lastname, email
    console.log(mydata);

    onlyemails = [];
    for (var i = 0; i < mydata.length; i++) {
      onlyemails.push(mydata[i][2]);
    }
    console.log("this is roster: ", onlyemails);
    service.updateClassRoster(ClassId, onlyemails, function(json) {
      if (json.status === 409) {
        res.status(409).send({ message: json.message });
      } else if (json.status === 200) {
        res.status(200).send({ message: json.message });
      } else {
        res.status(404).send({ message: json.message });
      }
    });
  });
  // var myRoster = req.body.roster;
  //  res.status(409).send({message: "function not set up yet. Thanks for the roster:"+myRoster})
  /*service.updateClassInformation(ClassId, req.body.name, req.body.description,
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
      });*/
});

// get all students
router.get("/instructors/:iid/students", function(req, res) {
  console.log("In stats routes get students");
  //console.log(req.body);
  var instructorId = req.params.iid;
  userModel
    .find({ role: "student" })
    .lean()
    .exec()
    .then(function(response, error) {
      // console.log(response);
      res.status(200).send(response);
    });
});
/*    service.updateClassRoster(ClassId, req.body.roster,
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
});*/
// end class model routes

// get game/assignment type
router.get("/instructors/:id/course/:cid/assignment/:aid", function(req, res) {
  console.log("440");
  // let instid = req.params.id;
  let courseId = req.params.cid;
  let assignmentId = req.params.aid;

  assignmentModel.findById(assignmentId, function(err, existingCourse) {
    if (err) return res.status(200).send("course not found");
    var aType = existingCourse.type;
    res.status(200).send(aType);
  });

  // assignmentModel.findOne({ courseId: courseId }, function(
  //   err,
  //   existingCourse
  // ) {
  //   //console.log(existingCourse.assignments);
  //   // var assignmentFound = existingCourse.assignments.find(function(element) {
  //   //     return element.assignmentID == assignmentId;
  //   // });
  //   if (err) return res.status(200).send("course not found");
  //   var aType = existingCourse.type;
  //   console.log("typeeeeeeee!!!");
  //   console.log(aType);
  //   res.status(200).send(aType);
  // });
});
router.get("/students/assignment/:aid", function(req, res) {
  console.log("get type");
  let assignmentId = req.params.aid;
  assignmentModel.findById(assignmentId, function(err, existingCourse) {
    if (err) return res.status(200).send("course not found");
    var aType = existingCourse.type;
    res.status(200).send(aType);
  });
});

// instructions calls
// create instruction
router.post("/instructors/games/:id/createInstr/create", function(req, res) {
  //console.log("In stats routes create instruction");
  //console.log(req.body);
  console.log("creating instruction");
  // console.log(req.body);
  var gameId = req.params.id;
  var gameName = req.params.gameName;
  service.newinstruction(
    req.body.name,
    req.body.content,
    req.body.img,
    "student",
    gameId,
    gameName,
    function(json) {
      //console.log(json.gameId);
      //console.log(json.gameName);
      if (json.status === 409) {
        res.status(409).send({ message: json.message });
      } else if (json.status === 200) {
        res.status(200).send({ message: json.message });
        console.log("hi json!");
        console.log(json);
      } else {
        res.status(404).send({ message: json.message });
      }
    }
  );
});

// get instruction
router.get("/instructors/games/:gid/instructions", function(req, res) {
  // print when refresh game????????
  //console.log("hellohellohello",req);
  let gameid = req.params.gid;
  /*assignmentModel.findOne({'assignmentId':gameid}, function(err, response)
  {
      if(err) console.log(err)
      if(response) console.log(JSON.stringify(response))
      //console.log(response);
      //if (err) return res.status(200).send("gid not found");
      //console.log(response)
      //res.status(200).send(response);
  });*/
  instructionModel.findOne({ gameId: gameid }, function(err, response) {
    if (err) return res.status(200).send("gid not found");
    //console.log(response.gameName);
    res.status(200).send(response);
  });
});

router.post("/course/:id/updatectconcepts", function(req, res) {
  var courseId = req.params.id;

  service.updateCourseLevelCTConcepts(
    courseId,
    req.body.ctConcepts,
    response => {
      return res.status(response.status).send({ message: response.message });
    }
  );
});

router.post("/assignment/:id/updatectconcepts", function(req, res) {
  var assignmentId = req.params.id;
  service.updateAssignmentCTConcepts(
    assignmentId,
    req.body.ctConcepts,
    response => {
      return res.status(response.status).send({ message: response.message });
    }
  );
});

// This is to get game level CT concept from its parent Quest level
router.get("/games/:gid/courses/:cid/getparentctconcepts", (req, res) => {
  var values = {
    gameId: req.params.gid,
    courseId: req.params.cid
  };

  service.getParentQuestCTConcepts(values, response => {
    if (response.status === 200) {
      console.log(response);

      res.status(200).send({ message: response.message });
    } else {
      res.status(500).send({ message: response.message });
    }
  });
});

// delete instruction
router.delete("/instructors/games/:gid/instruction", function(req, res) {
  var Gameid = req.params.gid;
  console.log("Hi I am in delete");
  service.removeInstruction(Gameid, function(json) {
    if (json.status === 409) {
      res.status(409).send({ message: json.message });
    } else if (json.status === 200) {
      res.status(200).send({ message: json.message });
    } else {
      res.status(404).send({ message: json.message });
    }
  });
});

// update instruction
router.put("/instructors/games/:gid/instruction/:iid", function(req, res) {
  console.log("In update instruction stats ");
  console.log(req.body.content);
  var InstructionId = req.params.iid;
  service.updateInstruction(
    InstructionId,
    req.body.name,
    req.body.content,
    req.body.img,
    function(json) {
      if (json.status === 409) {
        res.status(409).send({ message: json.message });
      } else if (json.status === 200) {
        res.status(200).send({ message: json.message });
      } else {
        res.status(404).send({ message: json.message });
      }
    }
  );
});

// end instructions call

router.post("/instructors/createCourse/:id", function(req, res) {
  console.log("In stats routes");
  console.log(req.body);

  courseModel
    .findOne({ courseName: req.body.courseName })
    .exec(function(err, existingCourse) {
      if (existingCourse) {
        console.log(req.body.courseName);
      } else {
        // console.log("new");
        // var newCourse = new courseModel({
        //     "courseName" : req.body.courseName,
        //     "desc" : desc,
        //     "instructorID" : req.body.instructorID,
        //     "assignments": req.body.assignements,
        //     "features" : req.body.features,
        //     "ctConcepts": req.body.ctConcepts,
        //     "assignmentFeedbacks": req.body.assignmentFeedbacks,
        //     "moveFeedbacks": req.body.moveFeedbacks
        // })
        service.newcourse(req.body, function(json) {
          if (json.status === 409) {
            res.status(409).send({ message: json.message });
          } else if (json.status === 200) {
            res.status(200).send({ message: json.message });
          } else {
            res.status(404).send({ message: json.message });
          }
        });
      }
    });

  // service.newcourse(req.body,
  //     function(json) {
  //         if (json.status === 409) {
  //             res.status(409).send({message: json.message});
  //         }
  //         else if (json.status === 200) {
  //             res.status(200).send({message: json.message});
  //         }
  //         else {
  //             res.status(404).send({message: json.message});
  //         }
  //     });
});

router.post("/instructors/createBadges", function(req, res) {
  console.log("In stats routes");
  console.log(req.body);
  service.newbadge(
    req.body.B_name,
    req.body.B_desc,
    req.body.B_img,
    req.body.B_issuer,
    function(json) {
      if (json.status === 409) {
        res.status(409).send({ message: json.message });
      } else if (json.status === 200) {
        res.status(200).send({ message: json.message });
      } else {
        res.status(404).send({ message: json.message });
      }
    }
  );
});

router.post("/instructors/createLP/:id", function(req, res) {
  // console.log("In stats routes");
  // console.log(req.body);
  var InstrId = req.params.id;
  service.newLP(
    req.body.LPname,
    req.body.desc,
    InstrId,
    req.body.features,
    req.body.ctconcepts,
    function(json) {
      if (json.status === 409) {
        res.status(409).send({ message: json.message });
      } else if (json.status === 200) {
        res.status(200).send({ message: json.message });
      } else {
        res.status(404).send({ message: json.message });
      }
    }
  );
});

/**
 * Update Course Info: courseName, course description, CT Concepts:
 */
router.post("/instructors/updateCourseInfo/:cid", function(req, res) {
  console.log(req);

  service.updateCourseInfo(req.body, response => {
    if (response.status === 200) {
      res.status(200).send({ message: response.message });
    } else {
      res.status(500).send({ message: response.message });
    }
  });
});

//CREATE LP FOR EACH GAME
router.post("/instructors/createLPGameLevel/:id", function(req, res) {
  console.log("-----this is the start of each game and corresponding focus");
  console.log(req.body);
  service.newLPGameLevel(
    req.body.gameId,
    req.body.instructorId,
    req.body.ctConcepts,
    function(json) {
      if (json.status === 409) {
        res.status(409).send({ message: json.message });
      } else if (json.status === 200) {
        res.status(200).send({ message: json.message });
      } else {
        res.status(404).send({ message: json.message });
      }
    }
  );
});

// get focus area of LP
// router.get("/instructors/:iid/createLPGameLevel/getfocus/:aid", function(req, res) {

// })

// create game
router.post("/instructors/:id/course/:cid/createAssignment", function(
  req,
  res
) {
  // console.log("DEBUG: ===== in router");
  console.log("hahahaha");

  service.createAssignment(req.body, json => {
    if (json.status === 200) {
      res.status(200).send({ message: json.message });
    } else {
      res.status(404).send({ message: json.message });
    }
  });
});

// router.post("/instructors/:id/course/:cid/createAssignment", function(req, res) {
//     console.log("In stats routes create assignemnt");
//     console.log(req.body);
//     var InstrId = req.params.id;
//     var courseid = req.params.cid;
//     service.newassignment(req.body, InstrId ,courseid,
//         function(json) {
//             if (json.status === 409) {
//                 res.status(409).send({message: json.message});
//             }
//             else if (json.status === 200) {
//                 res.status(200).send({message: json.message});
//             }
//             else {
//                 res.status(404).send({message: json.message});
//             }
//         });
// });

router.post("/instructors/:id/LP/:LPid/addCourse/:cid", function(req, res) {
  //console.log("In stats routes");
  console.log(req.body);
  var InstrId = req.params.id;
  var LPid = req.params.LPid;
  service.addCoursetoLP(req.body.order, req.params.cid, LPid, function(json) {
    if (json.status === 409) {
      res.status(409).send({ message: json.message });
    } else if (json.status === 200) {
      res.status(200).send({ message: json.message });
    } else {
      res.status(404).send({ message: json.message });
    }
  });
});

// remove asssignment/game
router.post("/instructors/course/:cid/assignment/:aid/remove", function(
  req,
  res
) {
  var courseId = req.params.cid;
  var assignmentId = req.params.aid;

  service.removeAssignment(courseId, assignmentId, function(json) {
    if (json.status === 409) {
      res.status(409).send({ message: json.message });
    } else if (json.status === 200) {
      res.status(200).send({ message: json.message });
    } else {
      res.status(404).send({ message: json.message });
    }
  });
});

router.post("/instructors/updateCourse/:cid", function(req, res) {
  //console.log("In stats routes");
  console.log(req.body);

  var Courseid = req.params.cid;
  service.updateCourse(req.body.coursename, req.body.desc, Courseid, function(
    json
  ) {
    if (json.status === 409) {
      res.status(409).send({ message: json.message });
    } else if (json.status === 200) {
      res.status(200).send({ message: json.message });
    } else {
      res.status(404).send({ message: json.message });
    }
  });
});

router.post("/instructors/:id/LP/:LPid/updateCourseOrder", function(req, res) {
  //console.log("In stats routes");
  console.log(req.body);
  var InstrId = req.params.id;
  var LPid = req.params.LPid;
  service.updateCourseOrderInLP(req.body.courses, LPid, function(json) {
    if (json.status === 409) {
      res.status(409).send({ message: json.message });
    } else if (json.status === 200) {
      res.status(200).send({ message: json.message });
    } else {
      res.status(404).send({ message: json.message });
    }
  });
});

router.post("/instructors/course/:cid/updateAssignmentOrder", function(
  req,
  res
) {
  //console.log("In stats routes");
  console.log(req.body);
  //var InstrId = req.params.id;
  //var LPid = req.params.LPid;
  var courseid = req.params.cid;
  console.log("going into update assignment stat");
  service.updateAssignmentOrderInQuest(req.body.assignments, courseid, function(
    json
  ) {
    if (json.status === 409) {
      res.status(409).send({ message: json.message });
    } else if (json.status === 200) {
      res.status(200).send({ message: json.message });
    } else {
      res.status(404).send({ message: json.message });
    }
  });
});

router.get("/instructors/:id/curricula_items", function(req, res) {
  curriculaItemModel
    .find({})
    .lean()
    .exec()
    .then(function(response, error) {
      console.log(response);
      res.status(200).send(response);
    });
});

router.get("/instructors/:id/missions", function(req, res) {
  learningPathModel
    .find({})
    .lean()
    .exec()
    .then(function(response, error) {
      // console.log("=== test what the response of mission looks like");
      // console.log(response);
      res.status(200).send(response);
    });
});
router.get("/instructors/:id/feedbacks", function(req, res) {
  commentTemplateModel.find({}, function(err, response) {
    if (err) {
      res.status(500).send({ error, err });
    } else {
      console.log("this is the response from the mondb");
      console.log(response); //.type['wrong']);
      res.send(response); //.type['wrong']);
    }
  });
});

router.get("/instructors/:id/quests", function(req, res) {
  courseModel
    .find({})
    .lean()
    .exec()
    .then(function(response, error) {
      //console.log(response);
      res.status(200).send(response);
    });
});

router.get("/instructors/:id/games", function(req, res) {
  assignmentModel
    .find({})
    .lean()
    .exec()
    .then(function(response, error) {
      console.log(response);
      res.status(200).send(response);
    });
});
//this is the route to create templates
router.post("/instructors/:id/createTemplate", function(req, res) {
  console.log(req.body);
  let gameId = req.body.gameId;
  let instructorId = req.body.instructorId;
  let type = req.body.type;
  let newTemplate = new commentTemplateModel({
    gameId: gameId,
    instructorId: instructorId,
    type: type
  });
  newTemplate.save(function(err, response) {
    if (err) {
      res.status(500).send({ message: err });
    } else {
      res.send({ status: 200, message: response });
    }
  });
});
router.post("/instructors/:id/getTemplate", function(req, res) {
  console.log(req.body);
  let type = req.body.type;
  commentTemplateModel.find({}, function(err, response) {
    if (err) {
      res.status(500).send({ error, err });
    } else {
      console.log("this is the response from the mondb");
      console.log(response[0].type[type]);
      res.send(response[0].type[type]);
    }
  });
});

// Deprecated, DO NOT UST this data model
router.post("/instructors/:id/createfeedback", function(req, res) {
  console.log("this is the route for inserting records of comment in mongoDB");
  console.log(req.body);
  var gameId = req.body.gameId;
  var instructorId = req.body.instructorId;
  var comment = req.body.comment;
  var moveResult = req.body.moveResult;
  var newComment = new CommentOfInstructionModel({
    gameId: gameId,
    instructorId: instructorId,
    comment: comment,
    moveResult: moveResult
  });
  console.log("this is what the comment looks like", newComment);
  newComment.save(function(err, fromNewcommentDb) {
    if (!err) {
      console.log(fromNewcommentDb);
      console.log({ status: 200, message: fromNewcommentDb });
      res.status(200).send({ status: 200, message: fromNewcommentDb });
    } else {
      res.status(500).send({ error: err });
    }
  });
});

// pz2244
// instructors use this to fetch original feedback
router.post("/instructors/:id/fetchclassfeedback", (req, res) => {
  service.fetchMoveFeedbackClass(req.body.classId, response => {
    if (response.status === 200) {
      res.status(200).send({ message: response.message });
    } else {
      res.status(500).send({ message: response.message });
    }
  });
});

// pz2244
// instructors use this to update feedback, return all existing feedbacks
router.post("/instructors/:id/updateclassfeedback", (req, res) => {
  console.log("stats update" + req.body.moveFeedback);
  var newFeedback = {
    classId: req.body.classId,
    moveFeedback: req.body.moveFeedback
  };

  service.updateMoveFeedbackClass(newFeedback, response => {
    if (response.status === 200) {
      res.status(200).send({ message: response.message });
    } else {
      res.status(500).send({ message: response.message });
    }
  });
});

// pz2244
router.post("/instructors/:id/deleteclassfeedback", (req, res) => {
  console.log("stats delete" + req.body.moveFeedback);
  var newFeedback = {
    classId: req.body.classId,
    moveFeedback: req.body.moveFeedback
  };

  classModel.findOneAndUpdate(
    { _id: newFeedback.classId },
    { $set: { moveFeedback: newFeedback.moveFeedback } },
    { new: true },
    (err, newentity) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(newentity);
    }
  );
});

// router for getting good comments from DB
router.get("/courses/:id/getGoodComment", function(req, res) {
  var gameId = req.params.id;
  CommentOfInstructionModel.find({ gameId: gameId, moveResult: "pass" })
    .exec()
    .then(function(response, error) {
      var results = {};

      if (typeof response.length == "undefined") {
        results["length"] = 0;
        results["comments"] = [];
      }

      results["length"] = response.length;
      results["comments"] = [];
      for (var i = 0; i < response.length; i++) {
        results["comments"].push(response[i]["comment"]);
      }
      res.status(200).send(results);
    })
    .catch(function(error) {
      console.log(error);
      res.status(500).send({ error: error });
    });
});

// router for getting bad comments from DB
router.get("/courses/:id/getBadComment", function(req, res) {
  var gameId = req.params.id;
  CommentOfInstructionModel.find({ gameId: gameId, moveResult: "fail" })
    .exec()
    .then(function(response, error) {
      var results = {};

      if (typeof response.length == "undefined") {
        results["length"] = 0;
        results["comments"] = [];
      }

      results["length"] = response.length;
      results["comments"] = [];
      for (var i = 0; i < response.length; i++) {
        results["comments"].push(response[i]["comment"]);
      }
      res.status(200).send(results);
    })
    .catch(function(error) {
      console.log(error);
      res.status(500).send({ error: error });
    });
});

router.get("/instructors/:id/badges", function(req, res) {
  badgedesModel
    .find({})
    .lean()
    .exec()
    .then(function(response, error) {
      console.log(response);
      res.status(200).send(response);
    });
});

router.get("/instructors/:id/quests/:Mid", function(req, res) {
  let missionId = req.params.Mid;

  learningPathModel
    .findById(missionId)
    .lean()
    .exec()
    .then(function(mission) {
      var courses = mission["courses"];

      var courseIds = [];

      for (let i in courses) {
        courseIds.push(mongoose.Types.ObjectId(courses[i]["CourseID"]));
      }
      console.log(courseIds);

      return courseModel
        .find({ _id: { $in: courseIds } })
        .lean()
        .exec();
    })
    .then(function(quests) {
      console.log(quests);
      res.status(200).send(quests);
    })
    .catch(function(err) {
      console.log(err);
    });
});

router.get("/instructors/:id/games/:Qid", function(req, res) {
  console.log("quests");
  let questId = req.params.Qid;

  courseModel
    .findById(questId)
    .lean()
    .exec()
    .then(function(quest) {
      var assignments = quest["assignments"];

      var assignmentIds = [];

      for (let i in assignments) {
        assignmentIds.push(
          mongoose.Types.ObjectId(assignments[i]["assignmentID"])
        );
      }
      //console.log(assignmentIds)

      return assignmentModel
        .find({ _id: { $in: assignmentIds } })
        .lean()
        .exec();
    })
    .then(function(games) {
      console.log(games);
      res.status(200).send(games);
    })
    .catch(function(err) {
      console.log(err);
    });
});

//need correct url here
router.get("/instructors/:id/course/:cid/Assignment/:aid", function(req, res) {
  console.log("obj ed");
  let assignmentId = req.params.aid;
  console.log(assignmentId);
  //assignmentModel.findById(assignmentId).lean().exec()
  assignmentModel
    .find({})
    .lean()
    .exec()
    .then(function(assignment) {
      var assessments = assignment["assessments"];
      console.log(assessments);
      res.status(200).send(assesssments);
    });
});

// get an assignment object
router.get("/assignment/:id", function(req, res) {
  var id = req.params.id;
  assignmentModel
    .findOne({ _id: id })
    .lean()
    .exec((err, assignemnt) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(200).send(assignemnt);
    });
});

// get an course object
router.get("/course/:id", function(req, res) {
  var id = req.params.id;
  console.log("FETCHING COURSE");
  courseModel
    .findOne({ _id: id })
    .lean()
    .exec((err, course) => {
      if (err) {
        return res.status(500).send(err);
      }
      console.log(course);
      res.status(200).send(course);
    });
});

// make a specific route for getting assignment feedbacks
router.get("/:level/:id/getassignmentfeedbacks", function(req, res) {
  var level = req.params.level;
  var id = req.params.id;

  if (level === "assignment") {
    model = assignmentModel;
  } else {
    model = courseModel;
  }

  model
    .findOne({ _id: id })
    .exec()
    .then(
      response => {
        if (!response.assignmentFeedbacks) {
          return res.status(200).send({ assignmentFeedbacks: [] });
        } else {
          return res.status(200).send(response.assignmentFeedbacks);
        }
      },
      err => {
        console.log("EEEEEEEE");
        console.log(err);
        return res.status(500).send(err);
      }
    );
});

router.get("/:level/:id/getmovefeedbacks", function(req, res) {
  var level = req.params.level;
  var id = req.params.id;

  if (level === "assignment") {
    service.getAssignmentMoveFeedbackClass(id, response => {
      if (response.status === 200) {
        res.status(200).send({ message: response.message });
      } else {
        res.status(500).send({ message: response.message });
      }
    });
  } else {
    model = courseModel;
    // TODO: just copy the assignment part
  }
});

router.post("/course/:id/addassignmentfeedbacks", function(req, res) {
  var id = req.params.id;

  courseModel.findOneAndUpdate(
    { _id: id },
    { $push: { assignmentFeedbacks: { $each: req.body.feedbacks } } },
    { new: true },
    (err, course) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      console.log("Success");
      res.status(200).send(course);
    }
  );
});

router.post("/assignment/:id/addassignmentfeedbacks", function(req, res) {
  var id = req.params.id;
  console.log(req.params);
  console.log(req.body.feedbacks);
  assignmentModel.findOneAndUpdate(
    { _id: id },
    { $push: { assignmentFeedbacks: { $each: req.body.feedbacks } } },
    { new: true },
    (err, assignment) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(200).send(assignment);
    }
  );
});

router.post("/:level/:id/addmovefeedbacks", function(req, res) {
  var level = req.params.level;
  var id = req.params.id;
  console.log("add move feedback req: " + req.body);
  var newFeedback = {
    moveFeedbacks: req.body.feedbacks,
    id: id
  };

  if (level === "assignment") {
    service.addAssignmentMoveFeedbackClass(newFeedback, response => {
      if (response.status === 200) {
        res.status(200).send({ message: response.message });
      } else {
        res.status(500).send({ message: response.message });
      }
    });
  } else {
    model = courseModel;
    // TODO: just copy the assignment part
  }
});

// the route for updateing assignment feedbacks
router.post("/:level/:id/deleteassignmentfeedbacks", function(req, res) {
  var level = req.params.level;
  var id = req.params.id;
  var model = null;

  if (level === "assignment") {
    model = assignmentModel;
  } else {
    model = courseModel;
  }

  model.findOneAndUpdate(
    { _id: id },
    { $set: { assignmentFeedbacks: req.body.feedbacks } },
    { new: true },
    (err, newentity) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(200).send(newentity);
    }
  );
});

router.post("/:level/:id/deletemovefeedbacks", function(req, res) {
  var level = req.params.level;
  var id = req.params.id;
  var model;

  if (level === "assignment") {
    model = assignmentModel;
  } else {
    model = courseModel;
  }

  model.findOneAndUpdate(
    { _id: id },
    { $set: { moveFeedbacks: req.body.feedbacks } },
    { new: true },
    (err, newentity) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(newentity);
    }
  );
});

//
// router.get("/steven_static", function(req, res) {
//
//     var data = require('../staticData/steven-quests');
//     res.send(JSON.stringify(data));
//
// });
//
// router.get("/metrics_static", function(req, res) {
//
//     var data = require('../staticData/metrics-static');
//     res.send(JSON.stringify(data));
//
// });

module.exports = router;
