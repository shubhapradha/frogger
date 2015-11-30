/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
		requestId;

	var numRows = 2,
		numCols = 3;

    var playerImages = [
				'images/char-boy.png',
                'images/char-cat-girl.png',  
                'images/char-horn-girl.png',   
                'images/char-pink-girl.png',   
                'images/char-princess-girl.png'
            ];

	var selectedPlayer = playerImages[0];
	var selectedPlayerLocX =110,
	    selectedPlayerLocY =150;

	var isActive = true;

    canvas.width = 505;
    canvas.height = 606;

    doc.body.appendChild(canvas);



    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

		canvas.removeEventListener('click', doMouseDown,false);
		document.removeEventListener('keydown', doKeydown,false);

		/* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);

        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
		 if(player.isActive)
		 {
			requestId = win.requestAnimationFrame(main); 
		 }
		 else
		 {
			reset();
		 }
		
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        // checkCollisions();
    }

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });

		player.sprite = selectedPlayer;
	    player.update();
	}

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {

		selectedPlayerLocX =110,
	    selectedPlayerLocY =150;

		selectedPlayer = playerImages[0];

		stopGameLoop();

        drawStartScreen();

		//Highlight current player
		ctx.fillStyle = 'rgba(238, 223, 204, 0.5)';
		ctx.fillRect(110,150,110,110);

		//Handle player selection before starting the game
		  canvas.addEventListener('click', doMouseDown, false);
		  document.addEventListener('keydown', doKeydown,false);
    }

	/**
	* @description Clear the canvas
    */
	function clearCanvas()
	{
		canvas.width = 505;
	}

	/**
	* @description Draw the start new game menu. The games
	* menu allows selection of the player character.
	*/
	function drawStartScreen(){
	    clearCanvas();

		row = col = playerIndex = 0;

		ctx.fillStyle = '#5FC148';
		ctx.fillRect(0,0,canvas.width,canvas.height);

		for( row=0; row < numRows; row++)
		{
			for (col = 0; col < numCols; col++) 
			{
				if(playerIndex < playerImages.length)
				{
					ctx.drawImage(Resources.get(playerImages[playerIndex]), col * 110 +110, row*110+ 110);	
					playerIndex++;
				}
			}
		}

		ctx.font = '30pt Arial';
		ctx.textAlign = 'center';
		ctx.strokeStyle = '#FFFF66';
		ctx.lineWidth = 1;
		ctx.fillStyle = '#FFFF66';
		ctx.fillText("New Game",250,450);
		ctx.strokeText("New Game",250,450);

		if( isGamePlayed )
		{
			ctx.font = '15pt Arial';
			ctx.textAlign = 'center';
			ctx.lineWidth = 1;
			ctx.fillStyle = '#FFFFFF';
			if(player.isActive == false)
			{
				ctx.fillText("Game Over !! Your Score is " + score,250,100);
			}
			else
			{
				ctx.fillText("Time Out !! Your Score is " + score,250,100);
			}
			
		}
		
	}

	/**
	* @description Stop the animation loop
	*/
	function stopGameLoop()
	{
		if (requestId) {
			win.cancelAnimationFrame(requestId);
			requestId = 0;
			return;
		}
	}

	/**
	* @description Key handler for selecting the player character in the Start New Game menu
	*/
	function doKeydown(e) {
			var allowedKeys = {
				13: 'enter',
				37: 'left',
				38: 'up',
				39: 'right',
				40: 'down'
			};

			selectPlayer(allowedKeys[e.keyCode]);
		}

	/**
	* @description Select the player character and save the player character details.
	* Start a new game if enter key pressed
	* @param {string} key - The key pressed
	*/
	function selectPlayer(key){
		switch (key){
			case 'left' :
				if(selectedPlayerLocX > 110)
				{
					selectedPlayerLocX -= 110;
					clearCanvas();
					drawStartScreen();
					ctx.fillStyle = 'rgba(238, 223, 204, 0.5)';
					ctx.fillRect( selectedPlayerLocX,selectedPlayerLocY,110,110);
					setSelectedPlayer(selectedPlayerLocX,selectedPlayerLocY);
				}
				break;
			case 'right' :
			     if(selectedPlayerLocX < 330 && selectedPlayerLocY <= 220)
				 {
					 selectedPlayerLocX += 110;
					 clearCanvas();
					 drawStartScreen();
					 ctx.fillStyle = 'rgba(238, 223, 204, 0.5)';
					 ctx.fillRect( selectedPlayerLocX,selectedPlayerLocY,110,110);
					 setSelectedPlayer(selectedPlayerLocX,selectedPlayerLocY);
				 }
				 else if( selectedPlayerLocX < 220 && selectedPlayerLocY >= 220)
				 {
					selectedPlayerLocX += 110;
					clearCanvas();
					drawStartScreen();
					ctx.fillStyle = 'rgba(238, 223, 204, 0.5)';
					ctx.fillRect( selectedPlayerLocX,selectedPlayerLocY,110,110);
					setSelectedPlayer(selectedPlayerLocX,selectedPlayerLocY); 
				 }
				break;
			case 'up' :
			    // if current location is in second row
				if(selectedPlayerLocY == 260)
				{
					selectedPlayerLocY -= 110;
					clearCanvas();
					drawStartScreen();
					ctx.fillStyle = 'rgba(238, 223, 204, 0.5)';
					ctx.fillRect( selectedPlayerLocX,selectedPlayerLocY,110,110);
					setSelectedPlayer(selectedPlayerLocX,selectedPlayerLocY);
				}
				break;
			case 'down' :
			    if(selectedPlayerLocY >= 110 && selectedPlayerLocY <= 220 && selectedPlayerLocX <= 220 )
				{
					selectedPlayerLocY += 110;
					clearCanvas();
					drawStartScreen();
					ctx.fillStyle = 'rgba(238, 223, 204, 0.5)';
					ctx.fillRect( selectedPlayerLocX,selectedPlayerLocY,110,110);
					setSelectedPlayer(selectedPlayerLocX,selectedPlayerLocY);
				}
				break;
			case 'enter' :
				// Start a new game if the key pressed is enter
				player.isActive = true;
				removeStartScreenListeners();

				main();
				startGame();
				break;
			case 'default':
				break;
		}
	}	

	/**
	* @description Set the image of the selected player character
	* @param {number} selectedPlayerLocX - x location of the selected player on start new game menu
	* @param {number} selectedPlayerLocY - y location of the selected player on start new game menu
	*/
	function setSelectedPlayer( selectedPlayerLocX,selectedPlayerLocY)
	{
		var index = 0;

		var playerLoc = selectedPlayerLocX/110;
		if(playerLoc>=1 && playerLoc<=3)
		{
			index = playerLoc - 1;
			if( selectedPlayerLocY >=260)
			{
				index += 3;
			}
		}

		selectedPlayer = playerImages[index];
	}

	/**
	* @description Remove the key and mouse listeners of the start new game menu
	*/
	function removeStartScreenListeners(){
		canvas.removeEventListener('click', doMouseDown,false);
		document.removeEventListener('keydown', doKeydown,false);
	}

	/**
	* @description Mouse handler for the Start New Game menu. 
	* Enable selection of player character by clicking on it
	* Start a new game if "Start New Game" is clicked
	*/
	function doMouseDown(event) {
		x = event.pageX - canvas.offsetLeft;
		y = event.pageY - canvas.offsetTop;

		var playerColumn = 0;

		//Player selected from first row
		if( y>150 && y<260) {
			for(playerColumn=0;playerColumn<=2;playerColumn++)
			{
				if(x> (playerColumn*110 + 110) && x< (playerColumn*110 + 220))
				{
					clearCanvas();
					drawStartScreen();
					ctx.fillStyle = 'rgba(238, 223, 204, 0.5)';
					ctx.fillRect( (playerColumn*110) + 110,150,110,110);
					selectedPlayer = playerImages[playerColumn];
					break;
				}
			}
		}
		//Player selected from second row . There are only 2 players ins second row
		else if( y>260 && y<370)
		{
			for(playerColumn=0;playerColumn<=1;playerColumn++)
			{
				if(x> (playerColumn*110 + 110) && x< (playerColumn*110 + 220))
				{
					clearCanvas();
					drawStartScreen();
					ctx.fillStyle = 'rgba(238, 223, 204, 0.5)';
					ctx.fillRect( playerColumn*110 + 110,260,110,110);
					selectedPlayer = playerImages[numCols + playerColumn];
					break;
				}
			}
		}

		// Click on Start New Game
		if (x>=150 && x<=350 && y>=420 && y<=450) 
		{
			lastTime = Date.now();
			player.isActive = true;
			removeStartScreenListeners();
			
			main();
			startGame();
		}
	}


    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
		'images/char-cat-girl.png',
		'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
	global.canvas = canvas;
	global.resetEngine = reset;
	global.requestId = requestId;
	global.stopGameLoop = stopGameLoop;
	global.isActive = isActive;
})(this);
