var express = require("express"),
    app = express(),
    fs = require("fs"),
    path = {
        "root": "/",
        "spriteImage": "/spriteMarioV1.png",
        "spriteHtml": "/sprite.html",
        "spriteJS": "/spriteMario.js",
        "spriteCss": "/spriteMario.css",
        "getHighScore":"/getHighScore",
        "setHighScore":"/setHighScore",
        "parentFolder" : ".."
    },
    folderName = {
        "JSON": "JSON",
        "PageLoadingContent":"PageLoadingContent"
    },
    tempHighScorePath = path.parentFolder + path.root + folderName.JSON + path.root + "HighScoreRepoitory.json",
    highScoreJsonArr = [],
    userName = "",
    highScore = "";
const MimeType = {
    "html": "text/html",
    "js" : "text/javascript",
    "css" : "text/css",
    "png" : "image/png",
    "json" : "application/json"
};
    app.use(express.static(path.parentFolder + path.root + folderName.PageLoadingContent));
    function trace(str){ //utility Purpose ....
        console.log(str);
    };
    function setHighScoreHandler(req, res){
        var UserNameNotExist = false,
        tempJson = {};
        fs.exists(tempHighScorePath, function(exists){ //above url is  ../JSON/HighScoreRepoitory.json
            if(exists){
                highScoreJsonArr = JSON.parse(fs.readFileSync(tempHighScorePath, "utf8"));
            }
            userName = req.query.userName;
            highScore = req.query.highScore;
            for(var i = 0; i < highScoreJsonArr.length; i++){
                var Elem = highScoreJsonArr[i];
                UserNameNotExist = true;
                trace(Elem);
    
                if(Elem.userName == userName){
                    UserNameNotExist = false;
                    trace("userName Exist");
                    highScore = parseInt(highScore);
                    Elem.highScore = parseInt(Elem.highScore);
                    if ((Elem.highScore) < (highScore)){
                        Elem.highScore = highScore;
                        trace("swapping the Value " + highScore);
                    }  else {
                        trace("As the HighScore value is very less we are not swapping " + highScore);
                    }
                    break;
                }
            }
            if(UserNameNotExist|| highScoreJsonArr.length == 0){
                tempJson.userName = userName;
                tempJson.highScore = parseInt(highScore);
                console.log(tempJson);
                highScoreJsonArr.push(tempJson);
            };
            fs.writeFile(tempHighScorePath, JSON.stringify(highScoreJsonArr), function(err){
                if(err){
                    trace(err);
                    return;
                }
                res.end("added");

            });
            
        });
    };
    function getHighScoreHandler(req, res){
    trace ("highScorePath ::::: " + tempHighScorePath);
        trace("Processing the requested get url ::::: " + req.url);
        fs.exists(tempHighScorePath, function(exists){
                if(exists){
                    fs.readFile(tempHighScorePath, function(_err, data){
                        res.setHeader('Content-Type', MimeType.json);
   			            res.end(data);
                    });
                } else {
                    res.end("[]");
                }      
        });
    };
    app.get("/setHighScore",setHighScoreHandler);
    app.get("/getHighScore", getHighScoreHandler);
    app.listen(8796);