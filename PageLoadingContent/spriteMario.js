/*JS file for the sprite.HTML*/
var button = {
			"space":  32,
			"left":   37,
			"right":  39,
			"up":     38,
			"down":   40
		}, walkPos = [ "33%","66.7%", "100%" ],
			bugMovePos = ["33%", "67%"],
			jumpPos = ["0%", "100%","0%"],
			i = 0,
			leaderBoardArr= [],
			bannerElem = "",
			standElem = "",
			walkElem = "",
			jumpElem = "",
			userElem = "",
			goldElem = "",
			bugElem = "",
			scoreElem = "",
			highScoreElem = "",
			leaderTableElem = "",
			audioElem = "",
			gameStatus = false,
			reloadWebPage = false,
			bugElemHorizontalPos = 0,
			marioVerticalPos = 0,
			bugHorizontalMovement = 0,
			marioVerticalMovement = 0,
			initialVerticalPos = marioVerticalMovement,
			defaultspeedMovementUp = 35,
			speedMovementUp = defaultspeedMovementUp,
			amountOfHeight = 25,
			verticalMovementOffset = 1,
			bugHorizontalMovementOffset = 1.2,
			setMarioInt = "",
			setBugInt = "",
			backgroundBodyColorChangeSpeed = 4000,
			defaultSpeedThreshould = 500,
			speedThreshould = defaultSpeedThreshould,
			speedMultiplier = 2,
			speedBalancer = 10,
			speedCounter = 0,
			maxSpeed = 50,
		//	isOffline = false,
			bugSpace = 35,
			indexedDBTableName = "Mario_Test",
			indexedDbDetails = {
				"name": "offlineDB",
				"version": 1,
				"tableDetails":[
					{ tableName: indexedDBTableName, 
						autoIncrement: false, 
						keyPath: "userName"
					}
				]
			},		
			LoadingTimeOut = 3000,
			createBug = false,
			numberBugGoingToBeCreated = 0,
			alreadyPressed = false,
			bugElemArray = [],
			bodyColorChangeArray = [/* "azure", "aliceblue", */"blanchedalmond", "cornsilk", "beige","antiquewhite",  "bisque", "blanchedalmond", "burlywood"/* , "cornsilk" */],
			cloneBugElem = "",
			intialColor = "000",
			userName = "",
			mainMovementDivElem = "",
			defaultTableContent = `<tr>
										<th>UserName</th><th>HighScore</th>
								   </tr>`,
			tableInnerContentStr = "",
			colorChangeSpeed = 4000,
			instructionElem = "",
			colorOffset = 1,
			url = "",
			speedControllerActivity = ["start", "pause"],
			marioSpeedController = speedControllerActivity[0],
			bugSpeedController = speedControllerActivity[0],
			jumpController = speedControllerActivity[0],
			imageMovementController = speedControllerActivity[0];
			buttonCounter = 0,
			jumpSpeedOffset = 0.7,
			maxNoOfBug = 3,
			url = "",
			bodyContentHtml = "",
			highScore = 0,
			localStorageKey = "highScore",
			multiplierStr  = "",//log purpose
			threshouldStr = "";//log purpose
			const styleUsed = {
				backgroundPositionX: "backgroundPositionX",
				backgroundPositionY: "backgroundPositionY",
				right: 				 "right",
				top:                 "top",
				color:               "color",
				backgroundColor:"background-color"
			}, specialCharacter = {
				space : " ",
				percentage: "%",
				pound:"#"
			}, tableTag = {
				row: '<tr>',
				column:'<td>',
				closeRow:'</tr>',
				closeColumn:'</td>'
			},
			idbUtil=  indexedDbUtil;
		function assignStyleElem(Elem, style, styleProperty){ // this is used for assigning the Style to the Element 
			if(styleProperty == null){
				Elem && (function(){Elem.style = style})();
			} else {
				Elem && (function(){Elem.style[styleProperty] = style})();
			}
			
		};
		function maioImageMovement(){
			assignStyleElem(standElem, walkPos[i++], styleUsed.backgroundPositionX);
			if(i >= walkPos.length){
				i = 0;
			}
		};
		function loadingPageContent(){
			setTimeout(function(){
				init();
				bannerElem.hidden = true;
				alreadyPressed = false;			
				buttonCounter = 0;
			}, LoadingTimeOut);	
		};
		function resetGame(){
			speedThreshould = defaultSpeedThreshould;
			highScore = highScoreElem.innerText;
			document.body.innerHTML = bodyContentHtml;
			bannerElem = getElem("banner");
			bannerElem.innerText = "Loading..."
			bannerElem.hidden = false;
			sendUserDetailsToServer().then(function(_data){
				setValueIndexedDB(loadingPageContent);	
			}, function (_err){
			//	isOffline = true;
				setValueIndexedDB(loadingPageContent);
			}).catch(function(_err){
			//	isOffline = true;
				setValueIndexedDB(loadingPageContent);
			});			
		};
		function setValueIndexedDB(pageLoader){
			idbUtil.get(indexedDBTableName, [userName]).onsuccess(
				function(result){
					if(!result || (parseInt(result.highScore) < parseInt(highScore))){
						idbUtil.put(indexedDBTableName,[{"userName": userName, "highScore": highScore}], indexedDbDetails.name).onsuccess(pageLoader);
						return;
					}

					pageLoader();
				}
			);
		}
		function sendUserDetailsToServer(){
			return new Promise(
				function(resolve, reject){
					try{
						url = "./setHighScore?userName="+userName+"&highScore="+highScore;
						var xmlHttp = new XMLHttpRequest();
						xmlHttp.onreadystatechange = function() {
							console.log("readyState value ===> ", xmlHttp.readyState);
							console.log("status Value ===> ", xmlHttp.status); 
							if (xmlHttp.readyState == 4 ){
								if(xmlHttp.status == 200){
									resolve(this.responseText);
								} else {
									reject(xmlHttp.status);
									setTimeout(sendUserDetailsToServer, 5000);
								}
								
							}								
						}
						xmlHttp.open("GET", url, true); // true for asynchronous 
						xmlHttp.send(null);
					} catch (e){
						
					}
					
				}
			);
		};
		function gameOver(){
			bugSpeedController = speedControllerActivity[1];
			marioSpeedController = speedControllerActivity[1];
			jumpController = speedControllerActivity[1];
			alreadyPressed = true;
			gameStatus = true;
			reloadWebPage = confirm("Do  you  want  play  Again  ;-)");
			if(reloadWebPage){
				resetGame();
			}
		};
		function checkGameOver(tempElem){
			bugElemHorizontalPos = parseInt(tempElem.style.right);
			marioVerticalPos = parseInt(standElem.style.top);
			switch(bugElemHorizontalPos){
				/* case 54:{
					if(marioVerticalMovement > 10){
						gameOver();
					}
					break;
				} */
				case 55:  case 67:{
					if(marioVerticalMovement > 10){
						gameOver();
					}
					break;
				}
				case 56: case 66: {
					if(marioVerticalMovement > 9){
						gameOver();
					}
					break;
				}
				case 57: case 58: case 59: case 60: case 61: case 62: case 63: case 64: case 65:{
					if(marioVerticalMovement > 8){
						gameOver();
					}
					break;
				}
			}
			
		};
		function colorChange(){
			setInterval(function(){
				//intialColor = (styleUsed.color).substring(1,4);
				intialColor = (parseInt(intialColor, 16) + colorOffset).toString(16);
				if(intialColor.length == 1){
					intialColor = "00"+intialColor;
				} 
				if(intialColor.length == 2){
					intialColor = "0"+intialColor;
				}
				assignStyleElem(instructionElem, specialCharacter.pound + intialColor, styleUsed.color);
				if(intialColor == "fff"){
					intialColor = "000"
					assignStyleElem(instructionElem, specialCharacter.pound + intialColor, styleUsed.color);
				}
			}, colorChangeSpeed);
		};
		function bugMovement(){
			bugElemArray = document.getElementsByClassName("bug");
			for(var i = 0, aliasName = "", n = bugElemArray.length; i < n; i++){
				aliasName = bugElemArray[i];
				if(!aliasName || bugSpeedController == speedControllerActivity[1]){
					return;
				}
				bugHorizontalMovement = parseInt( aliasName.style[styleUsed.right]);
				if(bugHorizontalMovement++ % 2 != 0){				
						assignStyleElem(aliasName, 33 + specialCharacter.percentage , styleUsed.backgroundPositionX);				
				} else {
					assignStyleElem(aliasName, 67 + specialCharacter.percentage , styleUsed.backgroundPositionX);
				}
				if(scoreElem.innerText > 100 && bugElemArray.length < maxNoOfBug && bugHorizontalMovement == bugSpace){
					createBug = true;
					cloneBugElem = bugElemArray[0].cloneNode();
					assignStyleElem(cloneBugElem, "0%", styleUsed.right);
				}
				if(bugHorizontalMovement >= 100 ){
					bugHorizontalMovement = 0;					
				}
				if(createBug && bugHorizontalMovement >= bugSpace){
					mainMovementDivElem.append(cloneBugElem);
					createBug = false;
				}
				assignStyleElem(aliasName, bugHorizontalMovement+specialCharacter.percentage, styleUsed.right);
				checkGameOver(aliasName);
			}
		};
		/* function getRandomInt(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}; */
		function calcualateMarioSpeed(){
			setMarioInt = setTimeout(function(){				
				speedThreshould = (speedThreshould <= maxSpeed) ? maxSpeed : speedThreshould - speedBalancer * speedMultiplier;
				if( speedMultiplier < 1 ) {
					speedMultiplier = 1 ;
					speedCounter = 0;
				} else {
					speedMultiplier = speedMultiplier - speedCounter++/10;
				}				
				if(speedThreshould != maxSpeed){ // for traceability
					multiplierStr = multiplierStr + speedThreshould + specialCharacter.space;
					threshouldStr = threshouldStr + speedMultiplier+ specialCharacter.space;
				}
				//bugMovement(getRandomInt(1, 3));
				if(marioSpeedController == speedControllerActivity[0]){
					if(imageMovementController == speedControllerActivity[0] ){
						maioImageMovement();
					}
					calcualateMarioSpeed();
				}
			}, speedThreshould);
		};
		function checkHighScore(){
			 if(parseInt(highScoreElem.innerText) < parseInt(scoreElem.innerText)){
				highScoreElem.innerText = scoreElem.innerText;
				//localStorage.setItem(localStorageKey, highScoreElem.innerText);
			} 
			
		};
		function scoreIncrementer(){
			scoreElem.innerText++;
			checkHighScore();
		};
		function calculateBugSpeed(){
			setBugInt = setTimeout(function(){
				/* bugSpeedController = speedControllerActivity[1] */		
				if(bugSpeedController == speedControllerActivity[0]){
					scoreIncrementer();
					bugMovement();
					calculateBugSpeed();
				}
				//checkGameOver();						
				
			}, speedThreshould * bugHorizontalMovementOffset);
		};
		function calculateSpeed(){
			calcualateMarioSpeed();
			calculateBugSpeed(); 
		};
		function fillBackground(){
			var backgroundFillElem = document.getElementById("backgroundFill"),
				spanStyleStr = "";
				for(var top = 0, i = 0; top <= 90; top+= 20, i++){
					for(var right = 0, j = 0; right <= 100;right = right + 11, j++){
						if(right % 2 == 0){
							spanStyleStr += `<span class = "mario" id = "tree-${i + j}" style="background-position: 100% 67%;height: 113px;width: 109px;position: absolute;right: ${right}%; top: ${top}%;z-index: -1;opacity: 0.3;"></span>`;
						} else {
							spanStyleStr += `<span class = "mario" id = "tree-${i + j}" style="background-position: 67% 67%;height: 113px;width: 109px;position: absolute;right: ${right}%; top: ${top}%;z-index: -1;opacity: 0.3;"></span>`;
						}
						
					}
				}
				backgroundFillElem.innerHTML = spanStyleStr;	
		}; 
		function getElem(elementName){
			return document.getElementById(elementName);
		}
		document.addEventListener("DOMContentLoaded", function(){
			var index = 0;
			fillBackground();
			 setInterval(function(){
				assignStyleElem(document.body,bodyColorChangeArray[index++], styleUsed.backgroundColor);
				if(index > bodyColorChangeArray.length){
					index = 0;
				}
			}, backgroundBodyColorChangeSpeed); 
			userElem = getElem("userName");
			userName = prompt("Please Enter your UserName");
			if(userName){
				userElem.innerText = userName;
			} else {
				userName = userElem.innerText;
			}
			init();
			idbUtil.setDBDetails(indexedDbDetails).openDatabase();
		});
		function fillLeaderBoard(){
			tableInnerContentStr = defaultTableContent;
			leaderBoardArr.sort(function(a, b){
                return parseInt(b.highScore) - parseInt(a.highScore);
             });
			leaderBoardArr.forEach(function(elem){
				if(elem.userName == undefined && elem.highScore == undefined){
					return;
				}
				tableInnerContentStr += (tableTag.row + tableTag.column + elem.userName + tableTag.closeColumn + tableTag.column + elem.highScore + tableTag.closeColumn + tableTag.closeRow); 
				if(elem.userName == userName){
					highScoreElem.innerText = elem.highScore;
				}
			});
			console.log(tableInnerContentStr);
			tableElem.innerHTML = tableInnerContentStr;
		};
		function getHighScore(){
			return new Promise (function (resolve, reject){
				try {
					var xmlHttp = new XMLHttpRequest();
					url = "./getHighScore";
					xmlHttp.onreadystatechange = function() { 
						console.log("readyState value ===> ", xmlHttp.readyState);
						console.log("status Value ===> ", xmlHttp.status);
						if(xmlHttp.readyState == 4 ){
							if ( xmlHttp.status == 200){
								// leaderBoardArr = JSON.parse(xmlHttp.responseText);
								// fillLeaderBoard();
							//	localStorage.setItem("isOffline", "false");
								resolve(JSON.parse(xmlHttp.responseText));
							} else {
								setTimeout(getHighScore, 5000);
								reject(xmlHttp.status);
							}
						}
											
					}
					xmlHttp.open("GET", url, true); // true for asynchronous 
					xmlHttp.send(null);
				} catch(e){				
				//	isOffline = true;
				//	localStorage.setItem("isOffline", "true");
					setTimeout(getHighScore, 5000);
					reject(e);
				}
			});
		};
		function init() {			
			scoreElem = getElem("score");			
			standElem = getElem("marioStand");
			bannerElem = getElem("banner");
			mainMovementDivElem = getElem("movement");
			instructionElem = getElem("instruction");
			userElem = getElem("userName");
			highScoreElem = getElem("Highscore");
			tableElem = getElem("leaderTable");
			audioElem = getElem("audioSrc");
			tableElem.innerHTML=defaultTableContent;
			//goldElem = getItem("gold")
			/* if(localStorage.getItem(localStorageKey)){
				highScoreElem.innerText =localStorage.getItem(localStorageKey);
			} */
			colorChange();
			initialVerticalPos = parseInt(standElem.style.top);
			//standElem = document.getElementById("marioWalk");
			
			/* jumpElem = document.getElementById("marioJump");
			assignStyleElem(jumpElem, jumpPos[0]); */
			//sentInt = setInterval(maioImageMovement, 100);
		window.onkeydown = function(event){
			switch(event.keyCode){
			case button.up:
			case button.space: {
					//alert(styleUsed.top);
					
					if(buttonCounter++ == 0 && !alreadyPressed) {
						jumpController = speedControllerActivity[0];
						marioSpeedController = speedControllerActivity[0];
						bugSpeedController = speedControllerActivity[0];
						gameStatus = false; 
						calculateSpeed();
					}
					if(buttonCounter++ != 0 && !alreadyPressed){
						alreadyPressed = true;
						imageMovementController = speedControllerActivity[1];
						assignStyleElem(standElem, jumpPos[0],styleUsed.backgroundPositionX);
						assignStyleElem(standElem, jumpPos[1], styleUsed.backgroundPositionY);
						movementUp();
						//movementDown();
						//marioSpeedController = speedControllerActivity[0];
						
					} 
					
				}			
			}
		};
			bodyContentHtml = document.body.innerHTML;
			getHighScore().then(function (data){
				leaderBoardArr = data
				fillLeaderBoard();
				idbUtil.put(indexedDBTableName, leaderBoardArr, indexedDbDetails.name).oncomplete(function(){
					localStorage.setItem("IndexedDb", "true");
				});
			}, function(err){
				alert("server is not up right now so Leader Board will not be populated other functionality works properly Sorry for the Inconvinience");
				if(localStorage.getItem("IndexedDb") == "true"){
					idbUtil.get(indexedDBTableName, [userName],indexedDbDetails.name).onsuccess(function(result){
						if(result){
							highScoreElem.innerText = result.highScore;
						} else {
							alert("your details are not cached :-/ But don't worry your details will be received once we server is on you can play now as a new user");
							highScoreElem.innerText = 0;
						}
					});
				} else {
					alert("You can play now but value won't be stored ");
				}
				
			});
  }
  function movementDownCallBack(){
	var verticalUserName = 0;
	marioVerticalMovement = parseInt(standElem.style.top);
	marioVerticalMovement += verticalMovementOffset;
	verticalUserName = marioVerticalMovement - 4;
	assignStyleElem(standElem, marioVerticalMovement+specialCharacter.percentage, styleUsed.top);
	assignStyleElem(userElem, verticalUserName+specialCharacter.percentage, styleUsed.top);
	if(marioVerticalMovement - initialVerticalPos < 0){
		if(jumpController == speedControllerActivity[0]){
			movementDown();
		}
	} else if(!gameStatus) {
		imageMovementController = speedControllerActivity[0];
		//calcualateMarioSpeed();
		assignStyleElem(standElem, jumpPos[2], styleUsed.backgroundPositionY);
		alreadyPressed = false;
	}
  };
  function movementDown(){	
	//
	speedMovementUp = (defaultspeedMovementUp < speedThreshould * jumpSpeedOffset) ? defaultspeedMovementUp: speedThreshould * 0.7;
//	setTimeout(movementDownCallBack,speedThreshould * 0.7);
	setTimeout(movementDownCallBack, speedMovementUp);
  };
  function movementUpCallBack(){
	var verticalUserName = 0;
	marioVerticalMovement = parseInt(standElem.style.top);
	marioVerticalMovement -= verticalMovementOffset;
	verticalUserName = marioVerticalMovement - 4;
	assignStyleElem(standElem, marioVerticalMovement+specialCharacter.percentage, styleUsed.top);
	assignStyleElem(userElem, verticalUserName+specialCharacter.percentage, styleUsed.top);
	if(initialVerticalPos - marioVerticalMovement <= amountOfHeight){
		if(jumpController == speedControllerActivity[0]){
			movementUp();
		}		
	}else {
		movementDown();
	}
  };
  function movementUp(){
	  /* standElem.animate( //Animate is not working in the way I needed but keeping this code for future references
		  [{
			  "top" : initialVerticalPos+specialCharacter.percentage,
			  "easing": 'ease-in'
		   }, 
		   {
			   "top": (initialVerticalPos - amountOfHeight) + specialCharacter.percentage,
			   "easing": 'ease-out'
		   }
		  ],200); */
	speedMovementUp = (defaultspeedMovementUp < speedThreshould * jumpSpeedOffset) ? defaultspeedMovementUp: speedThreshould * 0.7;
	setTimeout(movementUpCallBack, speedMovementUp);
	//setTimeout(movementUpCallBack, speedThreshould * 0.7);
  };