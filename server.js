var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var stats = require("./routes/stats");
var studentRoutes = require("./routes/studentRoutes.js");
var researcherRoutes = require("./routes/researcherRoutes.js");
var instructorRoutes = require("./routes/instructorRoutes.js");
var recommendationRoutes = require("./routes/recommendationRoutes");
var authRouter = require("./routes/auth");
var emailSender = require("./sagesendertest");
var multer = require("multer");
var AWS = require("aws-sdk");
var multerS3 = require("multer-s3");
AWS.config.loadFromPath("config/aws-config.json");
var s3 = new AWS.S3();
var mongoose = require("mongoose");
let dbConfig = require("./config/dbConfig.js");

var Course = require("./models/courseModel.js");

var socketService = require("./services/scratchSocketService");
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.DB);
//var student = new

var net = require("net");
var http = require("http");
var sockets = [];
var socketKeys = [];

function cleanUpSocket() {
  for (var socketIndex in sockets) {
    socket = sockets[socketIndex];
    try {
      socket.write("Socket Heartbeat");
    } catch (e) {
      console.log("clean up socket");
      sockets.splice(socketIndex, 1);
      socketKeys.splice(socketIndex, 1);
      console.log(sockets.length);
      console.log(sockets.length);
    }
  }
}
setInterval(cleanUpSocket, 3600000);

const policyServer = net
  .createServer(socket => {
    var sb = false;
    console.log("connected!");

    socket.on("error", err => {
      console.log("policy socket error");
      console.log(err);
    });

    socket.on("data", data => {
      console.log("Received: " + data);
      if (!sb) {
        sb = true;
        socket.end(
          '<?xml version="1.0"?><cross-domain-policy><site-control permitted-cross-domain-policies="master-only"/><allow-access-from domain="*" to-ports="*" /></cross-domain-policy>\0'
        );
      }
    });
  })
  .listen(8888);

const server = net
  .createServer(socket => {
    console.log("connected!");
    var aid;
    var sid;

    socket.on("error", err => {
      console.log(err);
    });
    socket.on("data", data => {
      console.log("Received: " + data.toString());
      console.log("is this right 2??");
      try {
        var json = JSON.parse(data);
        console.log(json);
        //console.log(json)
        //console.log(json['sb2File'])
        /*if(json['sb2File'])
        {
          //var file = new Buffer(JSON.stringify(json['sb2File']));
          //console.log(JSON.stringify(json['sb2File']))
          //console.log('the buf')
          //console.log(file.toJSON())
        }*/
        serviceSelection(json, data);
      } catch (e) {
        serviceSelection(json, data);
        console.log(e);
      }
    });

    socket.on("close", data => {
      if (
        aid !== null &&
        sid !== null &&
        typeof aid !== "undefined" &&
        typeof sid !== "undefined"
      ) {
        socketService.deleteStudentTempScores(aid, sid);
        console.log("temp score deleted. aid: ", aid, " sid: ", sid);
        sockets.splice(socketKeys.indexOf(aid + "-" + sid), 1);
        socketKeys.splice(socketKeys.indexOf(aid + "-" + sid), 1);
      }
      console.log("socket disconnection detected");
      console.log("socketLength: ", socketKeys.length);
      console.log(socketKeys.length);
      return;
    });

    function serviceSelection(json, data) {
      console.log("hi");
      console.log(data.toString());

      if (json["event"] === "SOCKET_SIGNATURE") {
        aid = json.assignmentID;
        sid = json.id;
        var key = json.assignmentID + "-" + json.id;
        socketService.scoreChanging(
          json.id,
          json.assignmentID,
          "objectiveID",
          json.timestamp,
          "0",
          "Welcome to the Parson's Puzzles!",
          false
        );
        if (socketKeys.indexOf(key) >= 0) {
          console.log("Overwrite previous socket");
          sockets[socketKeys.indexOf(key)] = socket;
        } else {
          socketKeys.push(key);
          sockets.push(socket);
        }
      }
      if (json["event"] === "UPDATE_POINT") {
        socketService.scoreChanging(
          json.studentID,
          json.assignmentID,
          json.objectiveID,
          json.timestamp,
          json.newPoint,
          json.feedback,
          json.isFinal,
          json.firstBlock,
          json.wrongBlock,
          json.correctBlock,
          json.colorFlag,
          json.updateFlag,
          json.meaningfulMoves,
          json.maxScoreForGame
        );
      }

      if (json["event"] === "SEND_FEEDBACK") {
        socketService.newFeedback(
          json.assignmentID,
          json.studentID,
          json.firstBlock,
          json.wrongBlock,
          json.correctBlock,
          json.feedback
        );
      }

      if (json["event"] === "SEND_INSTRUCTOR_FEEDBACK") {
        socketService.newFeedback(
          json.assignmentID,
          json.studentID,
          json.firstBlock,
          json.wrongBlock,
          json.correctBlock,
          json.feedback
        );
      }

      if (json["event"] === "SAVE_POINT_CONFIG") {
        socketService.savePointConfig(
          json.id,
          json.configName,
          json.pointConfig
        );
      }
      if (json["event"] === "CHECK_DUPLICATE_NAME") {
        let isDuplicate;
        socketService
          .checkDuplicateConfigName(json.id, json.configName)
          .then(res => {
            isDuplicate = res;
            data = {
              event: "CHECKDUPLICATE",
              isDuplicate: isDuplicate
            };
            // var key = json.assignmentID + "-" + json.id;
            var jsonString = JSON.stringify(data);
            console.log(jsonString);
            socket.write(jsonString);
          });
      }
      if (json["event"] === "FETCH_POINT_CONFIG") {
        let configNameList;
        socketService.fetchPointConfig().then(res => {
          data = {
            event: "RETURN_POINT_CONFIG",
            configList: JSON.stringify(res)
          };
          var jsonString = JSON.stringify(data);
          console.log("Point config list:", jsonString);
          socket.write(jsonString);
        });
      }
      if (json["event"] === "SUBMISSION") {
        console.log("Submission triggered");
        /*console.log(data.toString());
        console.log("hi")
        console.log(json.sb2File)*/

        socketService.submitStudentAnswer(
          json.startTime,
          json.score,
          json.hintUsage,
          json.remainingSeconds,
          json.submitMsg,
          json.endTime,
          json.meaningfulMoves,
          json.maxScoreForGame,
          json.blocks,
          json.studentID,
          json.assignmentID,
          json.objectiveID,
          json.selfExplanation,
          json.sb2File
        );

        // TODO: Commented for the bug when a student submit the answer
        //       Need to be modified this part

        // if (
        //   json.selfExplanation === null ||
        //   json.selfExplanation.length === 0
        // ) {
        //   var fakeData = {
        //     test: 'test'
        //   };
        //   const postData = JSON.stringify(fakeData);
        //   const path =
        //     '/student/courses/assessment/' +
        //     json.assignmentID +
        //     '/' +
        //     json.studentID +
        //     '/autosubmit';
        //   const options = {
        //     hostname: 'http://dev.cu-sage.org',
        //     path: path,
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/x-www-form-urlencoded',
        //       'Content-Length': Buffer.byteLength(postData)
        //     }
        //   };
        //   const req = http.request(options, res => {
        //     res.setEncoding('utf8');
        //     res.on('data', chunk => {
        //       console.log('BODY:', chunk);
        //     });
        //     res.on('end', () => {
        //       console.log('No more data in response.');
        //     });
        //   });
        //   req.write(postData);
        //   req.end();
        // }
      }
      if (json["event"] === "FRONTEND_SUBMITTED") {
        let selfExplanation = json.selfExplanation;
        data = {
          event: "SUBMISSION",
          selfExplanation: selfExplanation
        };
        var jsonString = JSON.stringify(data);
        var clientSocket =
          sockets[socketKeys.indexOf(json.assignmentID + "-" + json.id)];
        try {
          clientSocket.write(jsonString);
        } catch (e) {
          console.log(e);
        }
      }
      if (json["event"] === "FRONTEND_UPDATE_SUBMISSION") {
        let selfExplanation = json.selfExplanation;
        let aid = json.assignmentID;
        let sid = json.studentID;
        let studentSubmission = socketService.getStudentSubmission(sid, aid);
        studentSubmission["selfExplanation"] = selfExplanation;
        socketService.updateSubmission(studentSubmission);
      }
      if (json["event"] === "HINT_CLICKED") {
        data = {
          event: "HINTUSAGE"
        };
        var jsonString = JSON.stringify(data);
        console.log(jsonString, socketKeys);
        var clientSocket =
          sockets[socketKeys.indexOf(json.assignmentID + "-" + json.id)];
        try {
          clientSocket.write(jsonString);
        } catch (e) {
          console.log(e);
        }
      }
      if (json["event"] === "PEER_FEEDBACK_REQUESTED") {
        data = {
          event: "PEER_FEEDBACK_REQUESTED"
        };
        var jsonString = JSON.stringify(data);
        console.log(jsonString, socketKeys);
        var clientSocket =
          sockets[socketKeys.indexOf(json.assignmentID + "-" + json.studentID)];
        try {
          clientSocket.write(jsonString);
        } catch (e) {
          console.log(e);
        }
      }
      if (json["event"] === "UPDATE_GAME_SETTING") {
        socketService.updateGameSetting(
          json.assignmentID,
          json.id,
          json.time,
          json.question,
          json.hint,
          json.basic,
          json.developing,
          json.proficient,
          json.submitMsg
        );
      }
    }
  })
  .listen(8001);

app.use("/public", express.static(__dirname + "/public"));

app.use("/node_modules", express.static(__dirname + "/node_modules"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));

app.use("/stats", stats);

app.use("/student", studentRoutes);
app.use("/researcher", researcherRoutes);
app.use("/instructor", instructorRoutes);
app.use("/recommendations", recommendationRoutes);

app.get("/instructor/", function(req, res) {
  res.sendFile("instructor_index.html", {
    root: path.join(__dirname, "/public/views")
  });
});

app.get("/researcher/", function(req, res) {
  res.sendFile("researcher_index.html", {
    root: path.join(__dirname, "/public/views")
  });
});

app.get("/", function(req, res) {
  res.sendFile("index.html", {
    root: path.join(__dirname, "/public/views")
  });
});

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "sage-student-avatar",
    acl: "public-read",
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      cb(null, req.body.sid + "-student.jpg");
    }
  })
}).single("file");

app.post("/upload", jsonParser, function(req, res) {
  upload(req, res, function(err) {
    if (err) {
      res.json({ error_code: 1, err_desc: err });
      return;
    }
    res.json({ error_code: 0, err_desc: null });
  });
});

app.use("/auth", authRouter);
app.get("/sendEmail", jsonParser, function(req, res) {
  console.log(req.query);
  emailSender.sendInviteToClass(
    req.query.classid,
    req.query.emailaddress,
    function() {
      console.log(
        "Email Sent: Invitation to classid " +
          req.query.classid +
          " sent to " +
          req.query.emailaddress
      );
      res.send(
        "Email Sent: Invitation to classid " +
          req.query.classid +
          " sent to " +
          req.query.emailaddress
      );
    }
  );
});

var uploadVideo = multer({
  storage: multerS3({
    s3: s3,
    bucket: "sage-videos-2016",
    acl: "public-read",
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      cb(null, req.body.assignmentId + ".flv");
    }
  })
}).single("file");

app.post("/uploadVideo", jsonParser, function(req, res) {
  uploadVideo(req, res, function(err) {
    if (err) {
      res.json({ error_code: 1, err_desc: err });
      return;
    }
    res.json({ error_code: 0, err_desc: null });
  });
});

// Default port for local development is 3000
var listenPort = 3000;
if (
  process.env.hasOwnProperty("IISNODE_VERSION") &&
  process.env.hasOwnProperty("PORT")
) {
  listenPort = process.env.PORT;
}

app.listen(listenPort, function() {
  console.log(
    "Starting SAGE Affinity Space, process.env.NODE_ENV=" + process.env.NODE_ENV
  );
  console.log("SAGE Affinity Space listening on port " + listenPort + "!");
});
