var score = 0;
var TIME_LIMIT = 60000;
var gameTimeLimit;
var timer;
var spawnEnemies;
var countDown;
var isGamePlayed = 0;

/**
* @description Enemies our player must avoid
* @constructor
* @param {number} x - The x location of enemy
* @param {number} y - The y location of enemy
*/
var Enemy = function( x, y ) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
	this.x = x;
	this.y = y;
};

/**
* @description  Update the enemy's position, required method for game
* @param {number} dt - a time delta between ticks
*/
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
	var randomAmplitude = 100 + (Math.random() * 20);
	var randomStartTime = Math.random()*100;

	var enemyWidth = 101;
	var enemyHeight = 171;
	var enemyTopBorder = 73;
	var enemyBottomBorder = 28;

	var playerWidth = 101;
	var playerHeight = 171;
	var playerLeftBorder = 35;
	var playerRightBorder = 25;
	var playerTopBorder = 63;
	var playerBottomBorder = 28;


	this.x +=  randomAmplitude * dt ;

	//Check if enemy collided with the player
	if( ( ( ( player.x + playerLeftBorder > this.x) && (player.x + playerLeftBorder < this.x + enemyWidth-40)) 
		  || 
	     ( (this.x  >= player.x + playerLeftBorder) && (this.x + enemyWidth <= player.x + playerWidth- playerRightBorder) ) 
		) 
		&&
		( ( (player.y + playerTopBorder > this.y + enemyTopBorder) && (player.y + playerTopBorder+8 <= (this.y + enemyHeight - enemyBottomBorder)))  
		   || 
		  ( (this.y + enemyTopBorder > player.y + playerTopBorder-8) && (this.y + enemyTopBorder < player.y + playerHeight - playerBottomBorder-3)) 
		)
	  ) 
	  {
		player.isActive = false;
		sleep(2000);
		stopGameLoop();
		gameOver();	
      }
};

/**
* @description Draw the enemy on the screen, required method for game
*/
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite),this.x, this.y);
};

/**
* @description Create a new player and set position of player on the grass
* @constructor
*/
var Player = function() {
	this.setInitalPosition();
};

/**
* @description Adds points if player reaches river
*/
Player.prototype.update = function(){
	// If player reaches water increment points by 10.
	if(this.y < 25)
	{
		score += 10;

		clearCanvas();
		displayScore();
		displayTimeLeft();
		this.setInitalPosition();
	}
};

/**
* @description Draw the player on the canvas
*/
Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
* @description Handle player movements
*/
Player.prototype.handleInput = function(key) {
	var bottomBorder = (canvas.height - 200);
	var rightBorder =(canvas.width - 100);
	var step = 30;

	switch (key){
		case 'left' :
		    if(this.x > 0)
			{
				this.x -= step;
			}
			break;
		case 'right' :
		    if(this.x < rightBorder)
			{
				this.x += step;
			}
			break;
		case 'up' :
		    if(this.y > 0)
			{
				this.y -= step;
			}			
			break;
		case 'down' :
		    if( this.y < bottomBorder)
			{
				this.y += step;
			}
			break;
		case 'default':
			break;
	}
};


/**
* @description Set position of player on the grass
*/
Player.prototype.setInitalPosition = function(){
	this.x = 100;
	this.y = canvas.width-70;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player = new Player();

/**
* @description Clear the Canvas
*/
function clearCanvas() {
	canvas.width = 505;
}

/**
* @description Set font style for writing on canvas
*/	
function setFontStyle() {
	ctx.font = '12pt Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'green';
	ctx.lineWidth = 1;
}	

/**
* @description Show the current score
*/
function displayScore(){
	setFontStyle();
	ctx.fillText("Score: " + score,450,40);
}

/**
* @description Display the time left for the game to end
*/
function displayTimeLeft() {
	setFontStyle();
	ctx.fillText("Time Left: " + gameTimeLimit/1000 + " seconds",80,40);
}

/**
* @description Clean up when the game is over and start new game menu
*/
function gameOver(){
	  stopGame();
	  player.setInitalPosition();
	  resetEngine();
}

/**
* @description Sleep 
* @param {number} milliseconds - time to sleep for in milliseconds
*/
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


var enemyPosY = [65,145,225];

/**
* @description Set up the game screen
*/	
function setupScreen() {
	var posY = enemyPosY[Math.floor(Math.random() * (enemyPosY.length))];
	var posX = canvas.width/10 * Math.random();
	allEnemies.push( createEnemy( posX, posY));
}

/**
* @description Start the game by spawning the enemies and setting time
* limit to finish the game
*/	
function startGame() {
	score = 0;
	isGamePlayed = 1;
	player.isActive = true;

	gameTimeLimit = TIME_LIMIT;

	// This listens for key presses and sends the keys to your
	// Player.handleInput() method. You don't need to modify this.
	document.addEventListener('keyup', doKeyUp,false);

	clearCanvas();
	displayScore();
	displayTimeLeft();

	spawnEnemies = setInterval(setupScreen,2000);

	timer = setTimeout(gameOver, gameTimeLimit);

	countDown = window.setInterval(function() {
    gameTimeLimit-= 1000;

	clearCanvas();
	displayTimeLeft();
	displayScore();

	if (gameTimeLimit < - 1) {
        clearInterval(countDown);
        return;
    }
	}, 1000);

}

/**
* @description Create a new enemy bug
* @param {number} posX
* @param {number} posY
* @returns {Enemy}
*/
function createEnemy( posX,posY ) {
	var enemy = new Enemy( posX, posY );
	return enemy;
}

/**
* @description Stop the game by clearing the timers and clearing canvas
*/
function stopGame(){
	document.removeEventListener('keyup', doKeyUp,false);

	clearTimeout(timer);
	clearInterval(spawnEnemies);
	clearInterval(countDown);

	clearCanvas();
}

/**
* @description Key handler for the player
*/
function doKeyUp(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
}
