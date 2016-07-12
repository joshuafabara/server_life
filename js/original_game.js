// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;
document.body.appendChild(canvas);
var arc_direction = getRandomInt(1,4);
var keep_direction = getRandomInt(0,1);
var lives = 3;
var enemy_speed = 5;
var builds = 0;
var performance = 0;

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/server_life.jpg";

// Server image
var serverReady = false;
var serverImage = new Image();
serverImage.onload = function () {
	serverReady = true;
};
serverImage.src = "images/pantheon.png";

// Hotfix image
var pullrequestReady = false;
var pullrequestImage = new Image();
pullrequestImage.onload = function () {
	pullrequestReady = true;
};
pullrequestImage.src = "images/pullrequest.png";

// Architecture image
var enemyReady = false;
var enemyImage = new Image();
enemyImage.onload = function () {
	enemyReady = true;
};
enemyImage.src = "images/web_enemy.png";

// Game objects
var server = {
	speed: 256 // movement in pixels per second
};
var pullrequest = {};
var pullrequestCaught = 0;
var enemy = {};
// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a pullrequest
var reset = function () {
	server.x = canvas.width / 2;
	server.y = canvas.height / 2;

	// Throw the pullrequest somewhere on the screen randomly
	pullrequest.x = 32 + (Math.random() * (canvas.width - 64));
	pullrequest.y = 32 + (Math.random() * (canvas.height - 64));

	enemy.x = getRandomInt(0, canvas.width);
	enemy.y = getRandomInt(0, canvas.height);
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


var init = function () {
  arc_direction = getRandomInt(1,4);
  keep_direction = getRandomInt(0,1);
  lives = 4;
  enemy_speed = 5;
  builds = 0;
  pullrequestCaught = 0;
};

// Update game objects
var update = function (modifier) {
	enemy_speed += 0.001;
	if (38 in keysDown) { // Player holding up
		server.y -= server.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		server.y += server.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		server.x -= server.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		server.x += server.speed * modifier;
	}
	keep_direction = getRandomInt(0,1);
	if (!keep_direction) {
		arc_direction = getRandomInt(1,4);
	}
	switch(arc_direction) {
	    case 1:
	        enemy.x += enemy_speed;
	        break;
	    case 2:
	        enemy.x -= enemy_speed;
	        break;
	    case 3:
	        enemy.y += enemy_speed;
	        break;
	    case 4:
	        enemy.y -= enemy_speed;
	        break;
	}

	// Are they touching?
	if (
		server.x <= (pullrequest.x + 32)
		&& pullrequest.x <= (server.x + 32)
		&& server.y <= (pullrequest.y + 32)
		&& pullrequest.y <= (server.y + 32)
	) {
		++pullrequestCaught;
		enemy_speed -= 1;
		if (pullrequestCaught == 12) {
			++builds;
			pullrequestCaught = 0;
			enemy_speed -= 5*builds;
      server.speed += 50;
      performance++;
		}
		reset();
	}
	if (
		server.x <= (enemy.x + 32)
		&& enemy.x <= (server.x + 32)
		&& server.y <= (enemy.y + 32)
		&& enemy.y <= (server.y + 32)
	) {
		--lives;
		if (lives == -1) {
			gameOver();
		}
		else{
			reset();
		}
	}
};

var gameOver = function () {
	ctx.font = "48px Helvetica";
  ctx.fillStyle = 'Red';
  ctx.fillText('MELTED SERVER!!!!', canvas.width/2 - 200, canvas.height/2 - 50);
  ctx.font = "30px Verdana";
  ctx.fillStyle = 'White';
  ctx.fillText('Refresh to play again.', canvas.width/2 - 140, canvas.height/2 + 50);
  context.clearRect(0, 0, canvas.width, canvas.height);
  // init();
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (serverReady) {
		ctx.drawImage(serverImage, server.x, server.y);
	}

	if (pullrequestReady) {
		ctx.drawImage(pullrequestImage, pullrequest.x, pullrequest.y);
	}

	if (enemyReady) {
		ctx.drawImage(enemyImage, enemy.x, enemy.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Builds: " + builds + "   Merged PRs: " + pullrequestCaught + "   Performance: " + performance + "    Lives: "+ lives, 32, 15);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
