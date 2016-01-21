//Contains Home View controller and directives
'use strict';


var detection = angular.module('careApp.face',['ngRoute','angular-uuid']);

detection.controller('DetectionCtrl', function($scope,DocumentService, uuid){

    var webCamVideo = document.getElementById('webCamVideo'),
        canvas1 = document.getElementById("canvas1"),
        photoList = document.getElementsByClassName('photo'),
        canvasFaceList = document.getElementsByClassName('canvasFace'),
        captureButton = document.getElementById("captureButton"),
        trainButton = document.getElementById("trainButton"),
        modelButton = document.getElementById("modelButton"),
        authButton = document.getElementById("authButton"),
        clearButton = document.getElementById("clearButton"),
        stopButton = document.getElementById("stopButton"),
        startButton = document.getElementById("startButton"),
        faceForm = document.getElementById("faceForm"),
        photoWho = document.getElementById("photo-who"),
        media  = navigator.getUserMedia || navigator.webkitGetUserMedia,
        videoObj = {video: true},
        imageNameArray = [],
        detectedFaces = [],
        NO_OF_CAM_SHOTS = 2,
        width = 600,
        height = 0,
        webCamStream = null,
        streaming = false;

    $scope.docArray =[]

    //Saves all user images to userfaces directory
    $scope.saveFaceToDirectory = function(fileId,imgString){
        var imgData = imgString.replace(/^data:image\/png;base64,/, "");
        DocumentService.saveDocument(fileId,  imgData).then(function(res){
            angular.forEach(res,function(obj,index){
                var obj= {
                    "documentId":obj.documentId,
                    "documentContent":"<img class='my-photo' src='data:image/png;base64,"+obj.documentContent+"'>"
                }
                $scope.docArray.push(obj);
            })
        });
    };
    //Status message array
    $scope.statusContainer = [];


    //Start Web Camera stream
    $scope.startWebCamera = function(){
        navigator.getUserMedia = media;
        navigator.getUserMedia(videoObj, function(stream) {
            webCamVideo.src = window.URL.createObjectURL(stream);
            height = webCamVideo.videoHeight / (webCamVideo.videoWidth/width);
            if (isNaN(height)) {
                height = width / (4/3);
            }
            webCamVideo.setAttribute('width', width);
            webCamVideo.setAttribute('height', height);
            canvas1.setAttribute('width', width);
            canvas1.setAttribute('height', height);
            webCamVideo.play()
            streaming = true;
            webCamStream = stream;
            $scope.addStatus("Video Streaming Started...");
        }, function(){
            $scope.addStatus("Error in Video Streaming...");
            console.log("Error in Video Media Stream");
        });
    };

    //Stops the Web Camera from streaming
    $scope.stopWebCamera = function(){
        if(webCamStream != null){
            webCamStream.stop();
        }
    };

    //Takes picture in intervals

    $scope.saveImage = function(){
        saveFaceToDirectory();
    };



    //Takes picture in intervals
    $scope.makeClicks = function(){
        var i= 1,
            interval =  window.setInterval(function(){
                if(i < NO_OF_CAM_SHOTS){
                    //calculating image index from 0, i-1
                    $scope.takepicture(i,photoList[i-1],canvasFaceList[i-1]);
                    i = i+1;
                }else{
                    window.clearInterval(interval);
                }
            },2000);
    };

    //Takes a picture and draws into the canvas
    $scope.takepicture = function (index,photo,canvas) {
        var context = canvas1.getContext('2d'),
            data=null,
            userName = document.getElementById("userName").value;
        if (width && height) {
            canvas1.width = width;
            canvas1.height = height;
            context.drawImage(webCamVideo, 0, 0, width, height);
            data = canvas1.toDataURL('image/png');
            photo.setAttribute('src', data);
            //For Canvas face drawing
            var contextCnv = canvas.getContext('2d');
            canvas.width = width;
            canvas.height = height;
            contextCnv.drawImage(webCamVideo, 0, 0, width, height);
            var hash = uuid.v4();
            //Name of the image example abc.png
            $scope.saveFaceToDirectory(hash,data);
            imageNameArray.push(userName+index+'.png');
        } else {
            clearphoto();
        }
    };

    //Clears the canvas
    var clearphoto = function() {
        var context = canvas1.getContext('2d'),
            data = null;
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas1.width, canvas1.height);
        data = canvas1.toDataURL('image/png');
        for(var i=0;i<photoList.length;i++){
            photoList[i].setAttribute('src', data);
        }
    };

    //Detects the face of a user
    $scope.detectFaces = function(){
        operations.detectUserFace(imageNameArray,$scope.callbackDetectFace,detectedFaces);
    };

    //Create User Face Model : train
    $scope.createUserFaceModel = function(){
        operations.createUserModel(imageNameArray,$scope.userName,$scope.callbackCreateModel,detectedFaces);
    };

    //Compares a face with a list of valid models
    $scope.authenticateFace = function(){
        var context = canvas1.getContext('2d'),
            data=null,modelIdArray = [];
        if (width && height) {
            canvas1.width = width;
            canvas1.height = height;
            context.drawImage(webCamVideo, 0, 0, width, height);
            data = canvas1.toDataURL('image/png');
            photoWho.setAttribute('src', data);
            //Name of the image example abc.png
            operations.saveFaceToDirectory('who.png',data);
            for(var i in $scope.AUTHENTICATED_MODELS){
                modelIdArray.push($scope.AUTHENTICATED_MODELS[i].model_id);
            }
            try{
                operations.authenticateFace(modelIdArray,$scope.callbackAuthenticateFace);
            }catch(err){
                console.log("Error: ",err);
            }

            modelIdArray = [];
        }
    };

    //Draws a rectangle on face detected
    $scope.drawFaceRectangle = function(canvas,x,y,width,height){
        var context = canvas.getContext("2d");
        context.rect(x,y,width,height);
        context.strokeStyle="red";
        context.stroke();
    };

    //Callback method creating Model
    $scope.callbackCreateModel = function(errors, model){
        // check if an errors has occurred
        if(errors){
            $scope.handleErrors(errors);
        }else{
            $scope.addStatus("Model Created With >"+model.model_id);
            console.log("Model Created With : ",model);
            imageNameArray = [];
            detectedFaces = [];
        }
    };

    //Handles Error Object array
    $scope.handleErrors = function(errors){
        for(var error in errors){
            var ermessage = error.message,
                ermessageId = error.message_id;
            console.log("ERROR : ",ermessageId," : ",ermessage);
        }
    };

    //Add New status message to board
    $scope.addStatus = function(message){
        $scope.$apply(function(){
            $scope.statusContainer.push(message);
        });
    };

    //Clear message board
    $scope.clearStatus = function(message){
        $scope.$apply(function(){
            $scope.statusContainer = [];
        });
    };
    //Callback Method for Authenticate face
    $scope.callbackAuthenticateFace = function(errors, result) {
        if(errors){
            console.log(errors)
        }else{
            console.log(result)
        }
        console.log(result)
        for(var i = 0; i < result.faces.length ; i++){
            console.log('result.faces[i] : ', result.faces[i])
            var aFace = result.faces[i],
                resultList = aFace.results;
            for(var j in resultList){
                var score = resultList[j].score;
                console.log("score : ",score);
                if(score > 0.1){
                    $scope.addStatus("Authentication Successful");
                }else{
                    $scope.addStatus("Authentication Failed");
                }
            }

        }
    };

    //Callback method for detect faces
    $scope.callbackDetectFace = function(errors, resp){
        var faces = resp.faces;
        detectedFaces = faces;
        console.log("Response From ",resp);
        if(errors){
            $scope.handleErrors(errors);
        }else{
            $scope.addStatus("Faces detected...");
            console.log("Faces detected...",faces)
        }
    };



    //Callback for delete a model
    $scope.callbackDelModel = function(errors,data){
        if(errors){
            $scope.handleErrors(errors);
        }else{
            operations.getModelList($scope.callbackListModels);
        }
    };



    $scope.startWebCamera();

});