var http = require("http"),
    fs = require("fs"),
    URL = require("url"),
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
    highScoreJsonArr = [],
    userName = "",
    highScore = "",
    urlParts = [];
const RequestNameJson = {
    "GET" : "GET",
    "POST" : "POST"
};
const MimeType = {
    "html": "text/html",
    "js" : "text/javascript",
    "css" : "text/css",
    "png" : "image/png",
    "json" : "application/json"
};
function staticFileResponse(url, res){
    /* var tempUrl = path.parentFolder + path.root + folderName.PageLoadingContent + url;
    trace(tempUrl); */
    fs.readFile(path.parentFolder + path.root + folderName.PageLoadingContent + url,function(err, data){
        trace( url + " got hosted successfully");
        res.write(data);
        res.end();
    });
};
function trace(str){ //utility Purpose ....
    console.log(str);
};
function checkGetUrl(req, res){
    var tempHighScorePath = path.parentFolder + path.root + folderName.JSON + path.root + "HighScoreRepoitory.json",
        UserNameNotExist = false,
        tempJson = {};
    trace ("highScorePath ::::: " + tempHighScorePath);
    if(req.url.includes(path.setHighScore)){
        trace("Processing the requested get url ::::: " + req.url);
        fs.exists(tempHighScorePath, function(exists){ //above url is  ../JSON/HighScoreRepoitory.json
            if(exists){
                highScoreJsonArr = JSON.parse(fs.readFileSync(tempHighScorePath, "utf8"));
            }
            urlParts = URL.parse(req.url, true);
            userName = urlParts.query.userName;
            highScore = urlParts.query.highScore;
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
    }else if (req.url.includes(path.getHighScore)){
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
        }
        );
    } else {
        trace("please set the Case correctly for this url ::::: " + req.url);
    }
};
function checkPostUrl(str){
    if (req.url.includes(path.setHighScore)){
        trace("Processing the requested post url ::::: " + req.url);
    } else {
        trace("please set the Case correctly for this url ::::: " + req.url);
    }
};
http.createServer(
    function(req, res){
        trace(req.url);
        switch(req.url){
            case path.spriteHtml:
            case path.root:{
                res.writeHead(200, {
                    "Content-Type": MimeType.html
                });
                staticFileResponse(req.url, res); 
                break;
            }
            case path.spriteJS: {
                res.writeHead(200, {
                    "Content-Type":MimeType.js
                });
                staticFileResponse(req.url, res);
                break;
            }
            case path.spriteCss: {
                res.writeHead(200, {
                    "Content-Type":MimeType.css
                });
                staticFileResponse(req.url, res);
                break;
            }
            case path.spriteImage: {
                res.writeHead(200, {
                    "Content-Type":MimeType.png
                });
                staticFileResponse(req.url,res); 
                break;
            }
            default: {
                trace("checking the url in the Get method and post Method ::: "+ req.url);
                if(req.method == RequestNameJson.GET){
                    checkGetUrl(req, res);
                } else if (req.method == RequestNameJson.POST){
                    checkPostUrl(req, res);
                } else {
                    trace("please set the Case correctly for this url :::::" + req.url);
                }
            }
        }
        if(req.url.includes(path.getHighScore)){

        } else if (req.url.includes(path.setHighScore)){

        }
    }
).listen(8796);