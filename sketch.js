/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/


*/



var jumpSound;
var coinsound;
var levelwinsound;
var canyondeathsound;

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var isFound;

var trees_x;

var collectable;

var canyon;

var mountain;

var clouds;

var game_score;

var flagpole;

var lives;

var platforms;

var Enemies;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    coinsound = loadSound('assets/collectcoin-6075.mp3');
    coinsound.setVolume(0.5);
    levelwinsound = loadSound('assets/level-win-6416.mp3')
    levelwinsound.setVolume(0.1);
    canyondeathsound = loadSound('assets/videogame-death-sound-43894.mp3')
    
}


function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    lives = 3;
    startGame();

}

function draw()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    
    push();
    translate(scrollPos, 0)
	// Draw clouds.
    drawCloud();
    
	// Draw mountains.
    drawMountain();

	// Draw trees.
    drawTrees();
    
    //draw platforms
//    for(var i = 0; i < platforms.length; i++)
//        {
//            platforms[i].draw();
//        };
    
    for(plt of platforms)
        {
            plt.draw();
        }

	// Draw canyons.
    for(var i =0; i < canyon.length; i++)
    {
        drawCanyon(canyon[i]);
        checkCanyon(canyon[i]);
            
    }

	// Draw collectable items.
    for(var i =0; i < collectable.length; i++)
    {
        
        if(collectable[i].isFound == false)
            {
                drawCollectable(collectable[i]);
                checkCollectable(collectable[i]);
            };
 
    }
    
    renderFlagpole();

    for( i = 0; i < Enemies.length; i++)
        {
            Enemies[i].draw();
        }


    
    pop();

    //Draw Game Character
    drawGameChar();


    fill(255);
	noStroke();
	textSize(14);
	text("score: " + game_score, 20, 20);
	text("lives: " + lives, 900, 20);
    
    //draw lives
    for(var i = 0; i < lives; i++)
    {
        fill(255,0,0);
        ellipse(30+(i*30),40, 25,25);
    }
	
    checkPlayerDie();

	if (lives < 1)
	{
		fill(0);
		noStroke();
		textSize(26);
		text("Game Over. Press space to continue !", 200, 200);
		return;
	}
	if (flagpole.isReached) 
	{
		fill(0);
		noStroke();
		textSize(26);
		text("Congratulation! You've won the game! Press space to restart !", 200, 300);
		return;
	}

    // Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

    // Logic to make the game character rise and fall.
    if(gameChar_y < floorPos_y)
    {
        var isContact = false;
        for(var i = 0; i < platforms.length; i++)
            {
                if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true)
                    {
                        isContact = true;
                        break;
                    }
            }
        if(isContact == false)
            {
                gameChar_y += 2;
                isFalling = true;
            }
    }
    
    else{
        isFalling = false;
    }
    if (flagpole.isReached == false)
    {
        checkFlagpole();
    }

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

}
// ---------------------
// Key control functions
// ---------------------

function keyPressed(){

	if(keyCode == 37 && flagpole.isReached == false)
    {
        console.log("left arrow");
        isLeft = true;
    }
    else if(keyCode == 39 && flagpole.isReached == false)
    {
        console.log("right arrow");
        isRight = true;
    }
    else if(keyCode == 32 && gameChar_y == floorPos_y && lives > 0 && flagpole.isReached == false){
        console.log("SpaceBar");
        gameChar_y -= 150;
        isPlummeting = true;
        isFalling = true;
        jumpSound.play();
    }
    if(keyCode == 32 && lives <= 0)
	{
		lives = 3;
		startGame();
	}
	if (keyCode == 32 && flagpole.isReached)
	{
		startGame();
	}

}

function keyReleased()
{

    if(keyCode == 37)
    {
        console.log("left arrow");
        isLeft = false;
    }
    else if(keyCode == 39)
    {
        console.log("right arrow");
        isRight = false;
    }
    else if(keyCode == 32)
    {
        console.log("Space bar");
        isPlummeting = false;
        isFalling = true;
    }
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character


    	if(isLeft && isFalling)
	{
		// add your jumping-left code
    fill(0);
    rect( gameChar_x + 8, gameChar_y - 37, 4, 15);
    rect( gameChar_x - 8, gameChar_y - 37, 4, 15);
    fill(0, 255, 0);
    stroke(1);
    ellipse( gameChar_x - 6, gameChar_y - 17, 13, 10);
    ellipse( gameChar_x + 10, gameChar_y - 17, 13, 10);
    //head
    fill(255, 0, 0);
    ellipse(gameChar_x, gameChar_y - 50, 40, 45);
    //eyes
    fill(0);
    ellipse( gameChar_x + 9, gameChar_y - 50, 10, 10);
    ellipse( gameChar_x - 9, gameChar_y - 50, 10, 10);
    fill(255);
    ellipse(gameChar_x + 9, gameChar_y - 50, 5, 5);
    ellipse(gameChar_x -9, gameChar_y - 50, 5, 5);


	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
    fill(0);
    rect( gameChar_x + 8, gameChar_y - 37, 4, 15);
    rect( gameChar_x - 8, gameChar_y - 37, 4, 15);
    fill(0, 255, 0);
    stroke(1);
    ellipse( gameChar_x - 6, gameChar_y - 17, 13, 10);
    ellipse( gameChar_x + 10, gameChar_y - 17, 13, 10);
    //head
    fill(255, 0, 0);
    ellipse(gameChar_x, gameChar_y - 50, 40, 45);
    //eyes
    fill(0);
    ellipse( gameChar_x + 9, gameChar_y - 50, 10, 10);
    ellipse( gameChar_x - 9, gameChar_y - 50, 10, 10);
    fill(255);
    ellipse(gameChar_x + 9, gameChar_y - 50, 5, 5);
    ellipse(gameChar_x -9, gameChar_y - 50, 5, 5);

	}
	else if(isLeft)
	{
		// add your walking left code
    fill(0);
    rect( gameChar_x - 2, gameChar_y - 37, 4, 30);
    fill(0, 255, 0);
    stroke(1);
    ellipse( gameChar_x, gameChar_y - 2, 13, 10);
    //head
    fill(255, 0, 0);
    ellipse(gameChar_x, gameChar_y - 50, 40, 45);
    //eyes
    fill(0);
    ellipse( gameChar_x - 9, gameChar_y - 50, 10, 10);
    fill(255);
    ellipse(gameChar_x -9, gameChar_y - 50, 5, 5);

	}
	else if(isRight)
	{
		// add your walking right code
    fill(0);
    rect( gameChar_x - 2, gameChar_y - 37, 4, 30);
    fill(0, 255, 0);
    stroke(1);
    ellipse( gameChar_x, gameChar_y - 2, 13, 10);
    //head
    fill(255, 0, 0);
    ellipse(gameChar_x, gameChar_y - 50, 40, 45);
    //eyes
    fill(0);
    ellipse( gameChar_x + 9, gameChar_y - 50, 10, 10);
    
    fill(255);
    ellipse(gameChar_x + 9, gameChar_y - 50, 5, 5);

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
    fill(0);
    rect( gameChar_x + 8, gameChar_y - 37, 4, 15);
    rect( gameChar_x - 8, gameChar_y - 37, 4, 15);
    fill(0, 255, 0);
    stroke(1);
    ellipse( gameChar_x - 6, gameChar_y - 17, 13, 10);
    ellipse( gameChar_x + 10, gameChar_y - 17, 13, 10);
    //head
    fill(255, 0, 0);
    ellipse(gameChar_x, gameChar_y - 50, 40, 45);
    //eyes
    fill(0);
    ellipse( gameChar_x + 9, gameChar_y - 50, 10, 10);
    ellipse( gameChar_x - 9, gameChar_y - 50, 10, 10);
    fill(255);
    ellipse(gameChar_x + 9, gameChar_y - 50, 5, 5);
    ellipse(gameChar_x -9, gameChar_y - 50, 5, 5);

	}
	else
	{
		// add your standing front facing code
    fill(0);
    rect( gameChar_x + 8, gameChar_y - 37, 4, 30);
    rect( gameChar_x - 8, gameChar_y - 37, 4, 30);
    fill(0, 255, 0);
    stroke(1);
    ellipse( gameChar_x - 6, gameChar_y - 2, 13, 10);
    ellipse( gameChar_x + 10, gameChar_y - 2, 13, 10);
    //head
    fill(255, 0, 0);
    ellipse(gameChar_x, gameChar_y - 50, 40, 45);
    //eyes
    fill(0);
    ellipse( gameChar_x + 9, gameChar_y - 50, 10, 10);
    ellipse( gameChar_x - 9, gameChar_y - 50, 10, 10);
    fill(255);
    ellipse(gameChar_x + 9, gameChar_y - 50, 5, 5);
    ellipse(gameChar_x -9, gameChar_y - 50, 5, 5);
    }



}
    
//    gravity code
//     if(isFalling == true && gameChar_y < floorPos_y){
//         gameChar_y += 3;
//     }
//     else{
//         isFalling = false;
//     }






// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawCloud()
{
    for(var i=0; i < clouds.length; i++)
    {
        fill(255);
        ellipse(clouds[i].pos_x, clouds[i].pos_y, 55, 55)
        ellipse(clouds[i].pos_x+25, clouds[i].pos_y, 35, 35)
        ellipse(clouds[i].pos_x+45, clouds[i].pos_y, 25, 25)
    }
}

// Function to draw mountains objects.
function drawMountain()
{
   for(var i =0; i < mountain.length; i++)
   {
        fill(160,82,45)
        triangle(mountain[i], floorPos_y, mountain[i]+90, 106, mountain[i]+170, floorPos_y)  // larger mountain range
        triangle(mountain[i]+70, floorPos_y, mountain[i]+160, 276, mountain[i]+220, floorPos_y) // smaller mountain range
        fill(255)
        triangle(mountain[i]+85, floorPos_y/3.5, mountain[i]+90, 106, mountain[i]+95, floorPos_y/3.5) // snow on top of the mountain
   } 
}

// Function to draw trees objects.
function drawTrees()
{
    for(var i = 0; i < trees_x.length; i++)
    {
        fill(100, 50, 0);
        rect(75 + trees_x[i], -200/2 + floorPos_y, 50, 200/2); // tree trunk
        fill(0, 100, 0);
        triangle(trees_x[i] + 25, -200/2 + floorPos_y, // leaves 
                trees_x[i] + 100, -200 + floorPos_y,
                trees_x[i] + 175, -200/2 + floorPos_y);
        
        triangle(trees_x[i], -200/4 + floorPos_y, // leaves
                trees_x[i] + 100, -200*3/4 + floorPos_y,
                trees_x[i] + 200, -200/4 + floorPos_y);
    }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
        noStroke();
        fill(100,155,255)
        rect(t_canyon.x_Pos, 432, t_canyon.width, 200)
//        fill(135,206,250) // color of water in the canyon
//        rect(t_canyon.x_Pos, 522, 155, 100) // water
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
     if((gameChar_world_x > t_canyon.x_Pos + 10 && gameChar_world_x < t_canyon.x_Pos +150) && (gameChar_y >= floorPos_y))
                {
                    isLeft = false;
                    isRight = false
                    isPlummeting = true;
                }
            else if(gameChar_y < floorPos_y){
                    isPlummeting = false;
                }
        

	if (isPlummeting){
		gameChar_y += 1;
	}
}

function renderFlagpole()
{
    push();
    strokeWeight(5);
    stroke(0);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
    noStroke();
    fill(48, 213, 200);
    if(flagpole.isReached)
    {
        rect(flagpole.x_pos, floorPos_y - 250, 50, 50);
    }
    else
    {
        rect(flagpole.x_pos, floorPos_y - 50, 50, 50);
    }
    pop();
}

function checkFlagpole()
{
    var d = abs(gameChar_world_x - flagpole.x_pos);
    if(d < 15)
        {
            flagpole.isReached = true;
            levelwinsound.play();
        }
}



// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
        fill(255,215,0)
        ellipse(t_collectable.x, t_collectable.y -5 + 310, t_collectable.diameter, t_collectable.diameter)
        fill(255,165,0)
        ellipse(t_collectable.x, t_collectable.y - 5 + 310, t_collectable.diameter/2, t_collectable.diameter/2)
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    if(abs(gameChar_world_x - t_collectable.x) < 35)
    {
        t_collectable.isFound = true;
        game_score += 1;
        coinsound.play();
    }
}



function checkPlayerDie()
{
    if(gameChar_y > height)
        {
            lives -= 1;
            canyondeathsound.play();
            startGame();
            //console.log("player dead");
        }

}


function startGame(){
	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
    

	// Initialise arrays of scenery objects.
    
    
    trees_x = [
        100, 
        300, 
        500, 
        1050, 
        1300, 
        1500, 
        2300, 
        2500, 
        2400, 
        3100, 
        4000, 
        4200,
        4500,
        4900,
        5000,
        5300
    ]
    
    collectable = [
        {x : 240,y : 40,diameter: 40, isFound: false},
        {x : 1040,y : 100,diameter: 40, isFound: false},
        {x : 1640,y : 10,diameter: 40, isFound: false},
        {x : 1280,y : 100,diameter: 40, isFound: false},
        {x : 1820,y : 40,diameter: 40, isFound: false},
        {x : 1900,y : 100,diameter: 40, isFound: false},
        {x : 2100,y : 30,diameter: 40, isFound: false},
        {x : 2660,y : 90,diameter: 40, isFound: false},
        {x : 3660,y : 100,diameter: 40, isFound: false},
        {x : 4000,y : 60,diameter: 40, isFound: false},
        {x : 4200,y : 100,diameter: 40, isFound: false},
        {x : 4300,y : 30, diameter: 40, isFound: false},
        {x: 4350,y : 100, diameter: 40, isFound: false},
        {x: 4390,y : 10, diameter: 40, isFound: false},
        {x : 4400,y : 40,diameter : 40, isFound: false},
        {x: 4490, y: 100,diameter : 40, isFound: false},
        {x: 4580, y: 20,diameter : 40, isFound: false},
        {x: 4600,y : 60,diameter : 40, isFound: false},
        {x: 4800,y : 100,diameter : 40, isFound: false},
        {x: 4900,y : 20,diameter : 40, isFound: false}
    ]
    
        canyon = [
        {x_Pos : 0, width : 155},
        {x_Pos : 700, width : 155},
        {x_Pos : 1200, width : 155},
        {x_Pos : 2200, width : 155},
        {x_Pos : 3800, width : 155}
    ]
    
    mountain = [
        860, 
        1800, 
        2800, 
        3400,
        4700
    ]
    
    clouds = [
        {pos_x : 100, pos_y: 200},
        {pos_x : 600, pos_y: 100},
        {pos_x : 800, pos_y: 200},
        {pos_x : 1400, pos_y: 100},
        {pos_x : 1800, pos_y: 200},
        {pos_x : 2000, pos_y: 100},
        {pos_x : 2200, pos_y: 200},
        {pos_x : 2400, pos_y: 50},
        {pos_x : 2600, pos_y: 200},
        {pos_x : 2800, pos_y: 100},
        {pos_x : 3100, pos_y: 200},
        {pos_x : 3400, pos_y: 100},
        {pos_x : 3800, pos_y: 200},
        {pos_x : 4000, pos_y: 50},
        {pos_x : 4200, pos_y: 200},
        {pos_x : 4500, pos_y: 50},
        {pos_x : 4700, pos_y: 100},
        {pos_x: 5000, pos_y: 200},
        {pos_x: 5200, pos_y: 100},
        {pos_x: 5500, pos_y: 50}
    ]
    
    platforms = []
    
    platforms.push(createPlatforms(500, floorPos_y - 100, 100));
    platforms.push(createPlatforms(1000, floorPos_y - 150, 100))
    platforms.push(createPlatforms(1600, floorPos_y - 100, 100))
    platforms.push(createPlatforms(2500, floorPos_y - 150, 100))
    platforms.push(createPlatforms(3100, floorPos_y - 100, 100))
    platforms.push(createPlatforms(4000, floorPos_y - 150, 100))
    platforms.push(createPlatforms(4500, floorPos_y - 100, 100))
    
    Enemies = []
    
    Enemies.push(new Enemy(100, floorPos_y - 10, 100))
    
    
    
    game_score = 0;
    
    flagpole = {isReached: false, x_pos: 5500}
}

function createPlatforms(x, y, length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function(){
            fill(100, 50, 0);
            rect(this.x, this.y, this.length, 10);
        },
        checkContact: function(gc_x, gc_y)
        {
            if(gc_x > this.x && gc_x < this.x + this.length)
            {
                var d = this.y - gc_y;
                if(d >= 0 && d < 5)
                    {
                        return true;
                    }
            }
            return false;
        }
    }
    return p;
}

function Enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    
    this.currentX = x;
    this.inc = 1;
    
    this.update = function()
    {
        this.currentX += this.inc;
        
        
        if(this.currentX >= this.x + this.range)
            {
                this.inc = -1;
            }
        else if(this.currentX < this.x)
            {
                this.inc = 1;
            }
    } 
    
    this.draw = function()
    {
        this.update();
        fill(0)
        ellipse(this.currentX, this.y, 50, 50);
    }

    this.Contact = function(gc_x,gc_y)
    {
        var d = dist (gc_x,gc_y,this.currentX,this.y);
		if (d < 30)
		{
			return true;
		}

		return false;

    }
    
}
