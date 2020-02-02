angular.module('instructorApp')
    .directive('scratch', function() {
        return {
            restrict: 'E',
            scope: {
                movie: '@'
            },
            link: function(scope, element) {
                if (scope.movie && scope.movie != '') {
                    var object = '<object style="position: absolute" width="99%" height="800px">' +
                        '<param name="movie" width="100%" height="100%" value="' + scope.movie + '" />' +
                        '</object>';
                    element.replaceWith(object);
                }
            }
        };
    })
    .controller('InstructorGamesController', ['$scope', '$window', '$http', "$routeParams", "$location" ,"$mdStepper", "$mdDialog", "loadingService", 
    function($scope, $window, $http, $routeParams,$location,$mdStepper, $mdDialog, loadingService) {
        $scope.iid = $routeParams.sid;
        $scope.aid = $routeParams.aid;
        $scope.cid = $routeParams.cid;

        $scope.gameType = 'parsons'
        $scope.baseUrl = window.location.protocol + "//" + window.location.hostname + ":8081";
        $scope.buttonText = "Send Comment";
        $scope.movie = { 
            name: 'movie',
            url: '/public/sampleSWF/scratch.swf?sid=' + $scope.iid + '&assignmentID=' + $scope.aid + '&mode=DESIGN'+'&backend=' + $scope.baseUrl + '&type=' + $scope.gameType
          };

        var showUpKey = localStorage.getItem("showUpKey");
        if(showUpKey == null){
            $scope.initHide = false;
            $scope.showUpHide = false;
        } else{
            var object = JSON.parse(localStorage.getItem("showUpKey"));
            var currentTime = new Date().getTime();
            console.log(currentTime - object.timestamp);
            if(currentTime - object.timestamp < 600){
                $scope.initHide = true;
                $scope.showUpHide = true;
            } else{
                $scope.initHide = false;
                $scope.showUpHide = false;
            }
        }


        $http.get("/stats/instructors/"+$routeParams.sid+"/games")
        .then(function(response) {
	        $scope.games=response.data;
	        console.log($scope.games);
	        //console.log($scope.missions[0].LPName);
                        
        });
        
        $scope.steps = [];
        $scope.previewImg = [];


        $scope.loadAssignmentType = function(){
            ///instructors/:id/course/:cid/assignment/:aid
            loadingService.start();
            $http.get("/stats/instructors/" + $routeParams.sid + "/course/" + $routeParams.cid +"/assignment/" + $routeParams.aid)
                .then(function(response) {
                    console.log("a type is: ")
                    $scope.gameType = response.data;
                    $scope.loadInstruction();
            });
        }

        $scope.loadInstruction = function(){
            ///instructors/games/:gid/instructions
            //0 for instructors parsons 1 for cvg
            // console.log("game type is: " + $scope.);
            console.log($scope.gameType);
            if($scope.gameType === 'cvg'){
                $scope.gameId = 1;
            } else{
                $scope.gameId = 0;
            }
            $http.get("/stats/instructors/games/" + $scope.gameId + "/instructions")
                .then(function(response){

                    if(response.data === ""){
                        //no instruction in db
                        $scope.isCreated = false;
                        $scope.previewImg = [{
                            img: '/public/images/logo.png',
                            imgWidth: '',
                            imgHeight : '' 
                        }];

                        $scope.steps = [{
                            heading: '',
                            description: '',
                            img: '/public/images/logo.png',
                            imgWidth: '',
                            imgHeight : '' 
                        }];
                    } else{
                        $scope.isCreated = true;
                        var stepContent = response.data.content;
                        console.log("zhutou", response);
                        $scope.iid = response.data._id
                        console.log($scope.iid)
                        for(var i = 0 ;i < stepContent.length ; i++){
                            var heading = stepContent[i].heading;
                            var description = stepContent[i].other[0].description;
                            var img = stepContent[i].other[0].image;
                            var step = {
                                heading: heading,
                                description: description,
                                img: img,
                                imgWidth: '',
                                imgHeight : '' 
                            };
                            $scope.steps.push(step);
                        }

                        $scope.previewImg = {
                            img: response.data.img,
                            imgWidth: '',
                            imgHeight : ''
                        };
                        //document.querySelector("#previewImg").src = response.data.img;
                    }
                    loadingService.stop();
            });
        }
        $scope.loadAssignmentType();
        ///////////////////////start the instructor comment part//////////////////////////////////////////
        /////////////////////is route is written in stats file ///////////////////////////////////////////
        //this is to add the input(comments) to the array and send comments all at once
        $scope.moveFeedbackInput = [];
        $scope.enterMoveFeedback = function(keyEvent) {
            if (keyEvent.which === 13) {
                try {
                    console.log($scope.users.comment);
                    console.log($scope.users);
                } catch (error) {
                    $scope.users = {};
                    $scope.users.comment = "Warning: input null";
                }
                let user = angular.copy($scope.users);
                $scope.moveFeedbackInput.push(user);
                $scope.users = null;
            }
        };
        $scope.pushInArray = function() {
            try {
               console.log($scope.users.comment);
               console.log($scope.users);
            } catch (error) {
                $scope.users = {};
                $scope.users.comment = "Warning: input null";
            }
            var user = angular.copy($scope.users);
            $scope.moveFeedbackInput.push(user);
            $scope.users = null;
        };
        //this three function is to add add confirm and delete operations to each input box
        $scope.pushInArray2 = function() {
            try {
                console.log($scope.users.comment);
                console.log($scope.users);
            } catch (error) {
                $scope.users = {};
                $scope.users.comment = "Warning: input null";
            }
            let user = angular.copy($scope.users);
            $scope.moveFeedbackInput.push(user);
        };
        $scope.pushInArray3 = function() {
            $scope.users = null;
            $scope.moveFeedbackInput.pop();
            console.log($scope.moveFeedbackInput);
        };

        //this function is to show up the modal for instructor to fill in
        $scope.doMoveFeedbackModal = function() {
            $scope.commentResult = false;
            $scope.buttonText = "Send Comment";
            $('#commentModal').appendTo("body").modal('show');//useful
            if ($scope.class === "modal-backdrop fade in") {
                $scope.class = "modal fade in";
            }
        };
        //this is to change default css and show the modal
        let removeParentCss = function() {
            $('#removeCss').appendTo("body");
        };
        removeParentCss();

        let getApiURL = function() {
            let host = $location.host();
            let port = $location.port();
            let protocol = $location.protocol();
            let apiUrl = protocol + "://" + host + ":" + port;
            return apiUrl;
            //return 'http://withoutfront.us-east-1.elasticbeanstalk.com'
        };

        //this function enables instructor to write another comment
        $scope.writeAnother = function() {
            //clear the content in the current form
            $scope.buttonText = "Send Comment";
            $scope.commentResult = false;
            $scope.moveFeedbackInput.length = 0;
            $scope.user = null;
            $scope.createTemplate = false;
        };

        // TODO: We don't use this anymore, change this to new datamodel


        $scope.moveResult = "neutral";
        $scope.assignmentResult = "developing";
        var moveFeedback = [];
        var assignmentFeedback = [];
        // var newAssignment = {
        //     //TODO:Fill all neccessary attributes(M)
        //     moveFeedback: moveFeedback,
        //     assignmentFeedback: assignmentFeedback,
        //
        // };
        ///////////////////////////////////////////////////////////////
        // for (let i = 0; i < $scope.moveFeedbackInput.length; i++) {
        //     moveFeedback[i] ={type: $scope.moveResult, content:$scope.moveFeedbackInput[i]};
        // }
        // console.log(moveFeedback);
        // for (let i = 0; i < $scope.assignmentFeedbackInput.length; i++) {
        //     assignmentFeedback[i] ={type: $scope.assignmentResult,content:$scope.assignmentFeedbackInput[i]};
        // }
        //this function is to send instructor comments to database comments relation
        $scope.createTemplate = false;
        $scope.showButton = true;
        $scope.previewComment = function() {

            for (let i = 0; i < $scope.moveFeedbackInput.length; i++) {
                moveFeedback[i] ={type: $scope.moveResult, content:$scope.moveFeedbackInput[i]};
            }
            console.log(moveFeedback);
            for (let i = 0; i < $scope.assignmentFeedbackInput.length; i++) {
                assignmentFeedback[i] ={type: $scope.assignmentResult,content:$scope.assignmentFeedbackInput[i]};
            }
            let newAssignment = {
                //TODO:Fill all neccessary attributes(M)
                moveFeedback: moveFeedback,
                assignmentFeedback: assignmentFeedback,

            };
            // let url = 'https://mte9jnaya7.execute-api.us-east-1.amazonaws.com/dev';
            if ( $scope.createTemplate === true) {
                let url = "/stats/instructors/createfeedback";
                for (let i in $scope.moveFeedbackInput) {
                    let commentFilled = $scope.moveFeedbackInput[i].comment;
                    if ($scope.moveFeedbackInput[i].comment === "Warning: input null") {
                        commentFilled = "null";
                    }
                    let moveFilled = $scope.result;
                    if ($scope.result == null) {
                        moveFilled = "incorrect";
                    }
                    let req2 = {
                        gameId: $scope.aid,
                        instructorId: $scope.iid,
                        comment: commentFilled,
                        moveResult: moveFilled
                    };
                    console.log(req2);
                    $http.post("/stats/instructors/" + $routeParams.sid + "/createfeedback", req2)
                        .then(function (response) {
                            console.log($routeParams.sid);
                            console.log("sage is very fun");
                            $scope.successfulMessage = "Send Successfully!";
                            $scope.commentResult = true;
                            // var myEle = angular.element( document.querySelector( '#removeButton' ) );
                            // myEle.remove();   //removes element
                            $scope.showButton = false;
                        }, function (error) {
                            console.log(error);
                        });
                }
            } else if ($scope.createTemplate == false) {
                submitTemplate();
            }
            $scope.commentResult = true;
            // $scope.moveFeedbackInput = null;
        };
        

        // TODO: Use New Datamodel
        //this is to submit the template
        //the default template result is fail
        $scope.templateResultFilled = "neutral";
        var submitTemplate = function() {
            var templateResultFilled = "incorrect";
            if ($scope.templateResult == "correct") {
                templateResultFilled = "correct";
            } else if ($scope.templateResult == "incorrect"){
                templateResultFilled = "correct";
            } else if ($scope.templateResult == "neutral") {
                templateResultFilled = "neutral";
            } else if ($scope.templateResult == "close") {
                templateResultFilled = "close";
            }
            for (let i in $scope.templateComments) {
                let templateCommentFilled = $scope.templateComments[i].commentString;
                let req1 = {
                    gameId: $scope.aid,
                    instructorId: $scope.iid,
                    comment: templateCommentFilled,
                    moveResult: templateResultFilled
                };
                $http.post("/stats/instructors/"+$routeParams.sid+"/createfeedback",req1)
                    .then(function(response) {
                        console.log($routeParams.sid);
                        $scope.successfulMessage = "Send Successfully!";
                        $scope.commentResult = true;
                        $scope.showButton = false;
                    }, function(error) {
                        console.log(error);
                    });
            }
        };
        //reset function
        var reset = function() {
            $scope.showButton = true;
            $scope.successfulMessage = "";
            $scope.buttonText = "Send Comment";
            $scope.moveFeedbackInput = [];
        };
        ///this is another part where the instructor could choose to use the existing template and edit template to send their comments based on templates
        //this is the function for choosing templates or create own templates
        $scope.showUpTemplateRadio = false;
        $scope.chooseExisting = function(templateFlag) {
            reset();
            $scope.showUpTemplateRadio = true;
            $scope.createTemplate = false;
        };
        $scope.chooseOwn = function(templateFlag) {
            //reset the send button for new sent comment
            reset();
            $scope.createTemplate = true;
            $scope.showTemplateComments = false;
        };

        //the following part is to control the request from template
        //this is to control the presentation of templates classified by good or bad template
        //create and push and pop options for selective and show corresponding template when the template select
        const goodTemplates = [
            { id: 1, commentString: 'correct template1' },
            { id: 2, commentString: 'correct template2' },
            { id: 3, commentString: 'correct template3' },
            { id: 4, commentString: 'correct template4' },
            { id: 5, commentString: 'correct template5' }
        ];
        const badTemplates = [
            { id: 1, commentString: 'incorrect template1' },
            { id: 2, commentString: 'incorrect template2' },
            { id: 3, commentString: 'incorrect template3' },
            { id: 4, commentString: 'incorrect template4' },
            { id: 5, commentString: 'incorrect template5' }
        ];
        const neutralTemplates = [
            { id: 1, commentString: 'neutral template1' },
            { id: 2, commentString: 'neutral template2' },
            { id: 3, commentString: 'neutral template3' },
            { id: 4, commentString: 'neutral template4' },
            { id: 5, commentString: 'neutral template5' }
        ];
        const closeTemplates = [
            { id: 1, commentString: 'close template1' },
            { id: 2, commentString: 'close template2' },
            { id: 3, commentString: 'close template3' },
            { id: 4, commentString: 'close template4' },
            { id: 5, commentString: 'close template5' }
        ];
        const allTemplates = {'correct': goodTemplates, 'incorrect':badTemplates,'neutral':neutralTemplates,'close':closeTemplates};
        const templateTypeGood = [[{ id: 1, commentString: 'Nice Job1' },
            { id: 2, commentString: 'Keep Up1' },
            { id: 3, commentString: 'Nice Try1' },
            { id: 4, commentString: 'Wonderful Job' },
            { id: 5, commentString: 'That\'s right direction' }],[{ id: 1, commentString: 'Nice Job2' },
            { id: 2, commentString: 'Keep Up2' },
            { id: 3, commentString: 'Nice Try2' },
            { id: 4, commentString: 'Wonderful Job' },
            { id: 5, commentString: 'That\'s right direction' }],[{ id: 1, commentString: 'Nice Job3' },
            { id: 2, commentString: 'Keep Up3' },
            { id: 3, commentString: 'Nice Try' },
            { id: 4, commentString: 'Wonderful Job' },
            { id: 5, commentString: 'That\'s right direction' }],[{ id: 1, commentString: 'Nice Job4' },
            { id: 2, commentString: 'Keep Up4' },
            { id: 3, commentString: 'Nice Try' },
            { id: 4, commentString: 'Wonderful Job' },
            { id: 5, commentString: 'That\'s right direction' }],[{ id: 1, commentString: 'Nice Job5' },
            { id: 2, commentString: 'Keep Up5' },
            { id: 3, commentString: 'Nice Try' },
            { id: 4, commentString: 'Wonderful Job' },
            { id: 5, commentString: 'That\'s right direction' }]];

        // var reqTemplate = {
        //     gameId: $scope.aid,
        //     instructorId: $scope.iid,
        //     type: 'wrong',
        //     template: templateTypeBad
        // };
        // $http.post("/stats/instructors/" + $routeParams.sid + "/createTemplate", reqTemplate)
        //     .then(function (response) {
        //         $scope.successfulMessage = "Template Create!";
        //         $scope.commentResult = true;
        //         // var myEle = angular.element( document.querySelector( '#removeButton' ) );
        //         // myEle.remove();   //removes element
        //         $scope.showButton = false;
        //     }, function (error) {
        //         console.log("create fails");
        //
        //     });
        //the default template type is bad template
        var templateType = templateTypeGood;
        $scope.showUpTemplate = false;

        //this function is to change the template type based on the radio button
        $scope.changeTemplateType = function() {
            $scope.showUpTemplate = true;
            $scope.templates = badTemplates;
            var reqType = {
                type: $scope.templateResult
            };

            $http.post("/stats/instructors/" + $routeParams.sid + "/getTemplate", reqType)
                .then(function(response){
                    console.log("get response from mongodb");
                    console.log(response);
                    templateType = response.data;
                    let type =  $scope.templateResult;
                    $scope.templates = allTemplates[type];
                }, function(error) {
                    console.log(error);
                    console.log("something went wrong!");
                });
        };
        // this function is to control the templates version number inside good or bad range
        //the default is bad range
        $scope.templates = badTemplates;
        $scope.showTemplateComments = false;
        $scope.showTemplate = function() {
            console.log($scope.templateEach);
            let templateIndex = 1;
            switch($scope.templateEach.id) {
                case 1:
                    templateIndex = $scope.templateEach.id;
                    console.log(templateType[0]);
                    $scope.templateComments = templateType[0];
                    break;
                case 2:
                    templateIndex = $scope.templateEach.id;
                    $scope.templateComments = templateType[1];
                    break;
                case 3:
                    templateIndex = $scope.templateEach.id;
                    $scope.templateComments = templateType[2];
                    break;
                case 4:
                    templateIndex = $scope.templateEach.id;
                    $scope.templateComments = templateType[3];
                    break;
                case 5:
                    templateIndex = $scope.templateEach.id;
                    $scope.templateComments = templateType[4];
                    break;
                default:
                    templateIndex = $scope.templateEach.id;
            }
            console.log(templateIndex);
            $scope.showTemplateComments = true;
        };

        $scope.showInput = function(i) {
            return true;
        }
        // this is to edit the templates comments
        //must define this or will be undefined this bug takes me long time to fix

        $scope.mode = [];
        for (var i = 0; i < 5; i++) {
            $scope.mode[i] = false;
        }
        $scope.editDetails = function(i) {
            console.log($scope.templateComments[i]);
            console.log($scope.mode[i]);
            $scope.mode[i] = true;
        };

        $scope.removeComment = function(i) {
            $scope.moveFeedbackInput.splice(i,1);
        };
        ///////////////////////this is to clear all states and close the feedback modal////////////////////
        $scope.clearAll = function() {
            reset();
            $scope.showTemplateComments = false;
            $scope.showUpTemplateRadio = false;
            $scope.createTemplate = false;
            $scope.showTemplate = false;
            $scope.templateFlag = false;//choose existing or create own template
            $scope.templateResult = false;//correct wrong neutral response
            $scope.result = false;//type of feedback
            $scope.showTemplateComments = false;
        };
        ///////////////////////finish the instructor comment part//////////////////////////////////////////
        $scope.previousStep = function () {
            var steppers = $mdStepper('preview-step');
            steppers.back();
        };

        $scope.nextStep = function () {
            var steppers = $mdStepper('preview-step');
            steppers.next();
        };

        $scope.preview = function(){
            $scope.initHide = false;
        };

        $scope.previewAreaHandler = function(){
            $scope.initHide = !$scope.initHide;
        };

        $scope.closePreviewArea = function(){
            $scope.initHide = true;
        };

        $scope.showupHandler = function(){
           var object = {timestamp: new Date().getTime()}
           localStorage.setItem("showUpKey", JSON.stringify(object));
           $scope.initHide = !$scope.initHide;
        };
///////////////////////this is to get the focus of each game ///////////////////////////////////
        $scope.error = false;

        // TODO: use parent CT Concepts to replace the game Id and course Id in the pop up model
        // step1: get parent level CT concept, no need to modify
        var parentCTConcepts = null;
        // /games/:gid/courses/:cid/getparentctconcept
        // "/games/5c0f311e1c2ea6a9cf105cd1/courses/5aa3573481e48e19b4686bc6/getparentctconcepts"
        $scope.primaryLevel = [];
        $scope.middleLevel = [];
        $scope.detailedLevel = [];
        var primaryLevelR = [];
        var middleLevelR = [];
        var detailedLevelR = [];
        var temp = []
        var map = {"Sequences":"L1", "Conditionals":"L1","Loops":"L1","Parallelism":"L1","Event":"L1","Operators":"L1","Data":"L1",
            "Problem Statements":"L2","Recipes":"L2","Instructions":"L2","Algorithms":"L2","Dynamic Sequences":"L2","Boolean Logic":"L2",
            "If":"L2","If Else":"L2","Sample Instances":"L2", "Repeating Sequences":"L2", "Looping Forever": "L2" , "Conditional Looping":"L2", "Parallelism Forever" :"L2" , "Conditional Parallelism":"L2", "Single Event Triggering" :"L2" , "Collisions Triggering":"L2" ,
            "Mathematical Operations":"L2","Logic Operations":"L2","String Operations":"L2","Primitive Type Variables" :"L2", "Collections":"L2"};
        $http.get('/stats/games/' + $scope.aid + '/courses/' + $scope.cid + '/getparentctconcepts')
        .then((response) => {
            parentCTConcepts = response.data.message;
            if (parentCTConcepts === undefined || parentCTConcepts === []) {
                $scope.CTConcepts = "UNDEFINED";
            }
            console.log(" /*this is the response from he get parent cct concept*/");
            console.log(response.data.message.ctConcepts);

            for (let i = 0 ; i < response.data.message.ctConcepts.length; i++) {
                if (response.data.message.ctConcepts[i].children != []) {
                    temp.push(response.data.message.ctConcepts[i].name);
                    for (let j = 0; j < response.data.message.ctConcepts[i].children.length; j++) {
                        if (response.data.message.ctConcepts[i].children[j].children != []) {
                            temp.push(response.data.message.ctConcepts[i].children[j].name);
                            for (let j = 0; j < response.data.message.ctConcepts[i].children[j].children.length; k++) {
                                temp.push(response.data.message.ctConcepts[i].children[j].children[k].name);
                            }
                        }
                    }
                }
            }
            temp = temp.slice();
            for (let w = 0; w < temp.length; w++) {
                if (map[temp[w]] == "L1") {
                    $scope.primaryLevel.push(temp[w]);
                } else if (map[temp[w]] == "L2") {
                    $scope.middleLevel.push(temp[w]);
                } else {
                    $scope.detailedLevel.push(temp[w]);
                }
            }
            console.log("detailed")
            console.log(detailedLevelR);
            console.log("middle");
            console.log(middleLevelR);
            console.log("primary");
            console.log(primaryLevelR);

        }, (err) => {
            // console.log("this is the error from the get the parent error");
            console.log(err);
            console.log("this is the end of the error from the get parent error ");
        });
        console.log("ths is the  parent ctConcept");
        console.log(parentCTConcepts);

        // step2: COMPLETE HERE: replace game Id and course Id with parent quest level CT Concept
        //TO be decided what to show on the broswer
        $scope.CTConcept = parentCTConcepts;
        $scope.dataForParenTree = parentCTConcepts;
        ////////////////////////////finish shown the data from inheritance////////////////////////
        $scope.concepts=[];
        $scope.treeOptions = {
            nodeChildren: "children",
            dirSelectable: true,
            injectClasses: {
                ul: "a1",
                li: "a2",
                liSelected: "a7",
                iExpanded: "a3",
                iCollapsed: "a4",
                iLeaf: "a5",
                label: "a6",
                labelSelected: "a8"
            }
        };

        $http.get("/stats/instructors/"+$routeParams.sid + "/curricula_items")
            .then(function(response) {
                    console.log("this is the data for the tree");
                    console.log($routeParams.sid);
                    $scope.dataForTheTree = response.data;
                    console.log(typeof($scope.dataForTheTree));
                    console.log($scope.dataForTheTree);
                    console.log("this the end for the tree data");
                }
            );

        $scope.reset=function(){
            $scope.LP={};
            $scope.error = false;
        };

        $scope.showSelected = function(sel, flag, nodes) {
            $scope.selectedNode = sel;
            console.log(nodes);
            console.log("this is for testing");
            if(flag) {
                $scope.concepts.push(sel);
            } else {
                let index = $scope.concepts.indexOf(sel);
                if(index > -1) {
                    $scope.concepts.splice(index, 1);
                }
            }
        };
        var dataFocus = null;

        $scope.submitCTConceptsForm = function () {
            var newcCtConcepts = {
                ctConcepts: $scope.concepts
            };

            $http.post("/stats/assignment/"+ $scope.aid + "/updatectconcepts", newcCtConcepts)
            .then((response) => {
                $window.alert("Focus area saved");
            }, (err) => {
                console.log(err);
                $window.alert("Something wrong when connecting to database, try again later");
            })
        };


      //this is to show the focus modal and select focus and objective for each game
        $scope.showFocus = false;
        $scope.showFocusModal = function() {
            $scope.showFocus = true;
            $('#focusModal').appendTo("body").modal('show');//useful
            if ($scope.class === "modal-backdrop fade in") {
                $scope.class = "modal fade in";
            }
        };
        //this is to show the assignment general feedback
        $scope.showAssignmentFeedbackModal = function() {
            $scope.commentResult = false; 
            $scope.buttonText = "Send Comment";
            $('#AssFeedbackModal').appendTo("body").modal('show');//useful
            if ($scope.class === "modal-backdrop fade in") {
                $scope.class = "modal fade in";
            }
        };
        //this is to add and delete the assignment feedback for each game
        $scope.assignmentFeedbackInput = [];
        $scope.enterAssFeedback = function(keyEvent) {
            if (keyEvent.which === 13) {
                try {
                    console.log($scope.users.feedback);
                    console.log($scope.users);
                } catch (error) {
                    $scope.users = {};
                    $scope.users.feedback = "Warning: input null";
                }
                let user = angular.copy($scope.users);
                $scope.assignmentFeedbackInput.push(user);
            }
        };
        $scope.addFeedback = function() {
            try {
                console.log($scope.users.feedback);
                console.log($scope.users);
            } catch (error) {
                $scope.users = {};
                $scope.users.feedback = "Warning: input null";
            }
            let user = angular.copy($scope.users);
            $scope.assignmentFeedbackInput.push(user);

        };
        $scope.deleteFeedback = function() {
            $scope.users = null;
            $scope.assignmentFeedbackInput.pop();
        };
        $scope.removeFeedback = function(i) {
            $scope.assignmentFeedbackInput.splice(i,1);
        };


        $scope.updateAssignmentFeedback = function() {
            $mdDialog.show({
                locals: {level: "assignment", id: $scope.aid},
                controller: "InstructorUpdateAssignmentFeedbackController",
                templateUrl: "/public/views/instructor/instructor_updateAssignmentFeedback.html",
                // targetEvent: $event,
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                hasBackDrop: true
            })
        };
        //add move feedback
        $scope.updateMoveFeedback = function() {
            $mdDialog.show({
                locals: {level: "assignment", id: $scope.aid},
                controller: "InstructorUpdateMoveFeedbackController",
                templateUrl: "/public/views/instructor/instructor_updateMoveFeedback.html",
                // targetEvent: $event,
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                hasBackDrop: true
            })
        }

}]).directive('customDraggable', function() {
        return {
            restrict: 'A',
            link: function(scope, elem, attr, ctrl) {
                elem.draggable();
            }
    }});
