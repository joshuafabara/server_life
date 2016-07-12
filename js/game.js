var Debugger = function () { };
Debugger.log = function (message) {
   try {
      console.log(message);
   } catch (exception) {
      return;
   }
}


// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;
document.body.appendChild(canvas);
var arc_direction = getRandomInt(1,4);
var keep_direction = getRandomInt(0,1);
var lives = 3;
var builds = 0;
var performance = 0;
var throw_hotfix = 0;
var keep_hotfix_on = 0;
var throw_cache = 0;
var keep_cache_on = 0;
var with_cache_shield = 0;
var throw_performance = 0;
var keep_hfperformance_on = 0;
var throw_platform_issue = 0;
var keep_platform_issue_on = 0;
var platform_issue_affects = 0;
var dr_mode_on = 0;
var lives_to_print = '';
var dr_servers_to_print = '';
var enemies_number = 0;
var from_pullrequest = 0;
var levelAssets = {
  0 : "images/server_lifedr.jpg",
  1 : "images/server_life.jpg",
  2 : "images/server_life2.jpg",
  3 : "images/server_life3.png",
  4 : "images/server_life4.jpg",
  5 : "images/server_life5.jpg"
};
var level = 1;

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = levelAssets[level];

// Server image
var serverReady = false;
var serverImage = new Image();
serverImage.onload = function () {
	serverReady = true;
};
serverImage.src = "images/pantheon.png";

// Pull Request image
var pullrequestReady = false;
var pullrequestImage = new Image();
pullrequestImage.onload = function () {
	pullrequestReady = true;
};
pullrequestImage.src = "images/pullrequest.png";

// Hotfix image
var hotfixReady = false;
var hotfixImage = new Image();
hotfixImage.onload = function () {
  hotfixReady = true;
};
hotfixImage.src = "images/hotfix.png";

// Cache image
var cacheReady = false;
var cacheImage = new Image();
cacheImage.onload = function () {
  cacheReady = true;
};
cacheImage.src = "images/cache.png";

// dcache image
var dcacheReady = false;
var dcacheImage = new Image();
dcacheImage.onload = function () {
  dcacheReady = true;
};
dcacheImage.src = "images/dcache.png";

// Varnish image
var varnishReady = false;
var varnishImage = new Image();
varnishImage.onload = function () {
  varnishReady = true;
};
varnishImage.src = "images/varnish.png";

// Akamai image
var akamaiReady = false;
var akamaiImage = new Image();
akamaiImage.onload = function () {
  akamaiReady = true;
};
akamaiImage.src = "images/akamai.png";

// Performance image
var hfperformanceReady = false;
var hfperformanceImage = new Image();
hfperformanceImage.onload = function () {
  hfperformanceReady = true;
};
hfperformanceImage.src = "images/hfperformance.png";

// Platform issue image
var platform_issueReady = false;
var platform_issueImage = new Image();
platform_issueImage.onload = function () {
  platform_issueReady = true;
};
platform_issueImage.src = "images/platform_issue.png";

// dr_server issue image
var dr_serverReady = false;
var dr_serverImage = new Image();
dr_serverImage.onload = function () {
  dr_serverReady = true;
};
dr_serverImage.src = "images/dr_server.png";

// Architecture image
var enemyReady = false;
var enemyImage = new Image();
enemyImage.onload = function () {
	enemyReady = true;
};
enemyImage.src = "images/web_enemy.png";

var enemy2Ready = false;
var enemy2Image = new Image();
enemy2Image.onload = function () {
  enemy2Ready = true;
};
enemy2Image.src = "images/web_enemy2.png";

var enemy3Ready = false;
var enemy3Image = new Image();
enemy3Image.onload = function () {
  enemy3Ready = true;
};
enemy3Image.src = "images/web_enemy3.png";

var enemy4Ready = false;
var enemy4Image = new Image();
enemy4Image.onload = function () {
  enemy4Ready = true;
};
enemy4Image.src = "images/web_enemy4.png";

var enemy5Ready = false;
var enemy5Image = new Image();
enemy5Image.onload = function () {
  enemy5Ready = true;
};
enemy5Image.src = "images/web_enemy5.png";

// Game objects
var server = {
	speed: 256 // movement in pixels per second
};
var pullrequest = {
  width: 40,
  height: 40
};
var hotfix = {
  width: 40,
  height: 32
};
var cache = {
  width: 45,
  height: 51
};
var dcache = {
  x: 2000,
  y: 2000
};
var varnish = {
  x: 2000,
  y: 2000
};
var akamai = {
  x: 2000,
  y: 2000
};
var hfperformance = {
  width: 40,
  height: 40,
  x:2000,
  y: 2000
};
var platform_issue = {
  width: 45,
  height: 45,
  x:2000,
  y: 2000
};
var dr_server = {
  width: 35,
  height: 66,
  x:2000,
  y: 2000
};
var pullrequestCaught = 0;
var enemy = {
  width: 40,
  height: 40,
  speed: 5
};
var enemy2 = {
  width: 43,
  height: 43,
  speed: 5,
  is_enabled: 0,
  x: 2000,
  y: 2000,
  keep_direction: 0,
  arc_direction: 0
};
var enemy3 = {
  width: 46,
  height: 46,
  speed: 5,
  is_enabled: 0,
  x: 2000,
  y: 2000,
  keep_direction: 0,
  arc_direction: 0
};
var enemy4 = {
  width: 48,
  height: 48,
  speed: 5,
  is_enabled: 0,
  x: 2000,
  y: 2000,
  keep_direction: 0,
  arc_direction: 0
};
var enemy5 = {
  width: 50,
  height: 50,
  speed: 5,
  is_enabled: 0,
  x: 2000,
  y: 2000,
  keep_direction: 0,
  arc_direction: 0
};
// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var renderEnemies = function (enemies_number) {
  switch(enemies_number) {
    case 1:
        if (!from_pullrequest || enemy2.x > (canvas.width - enemy2.width) || enemy2.x < (0 + enemy2.width) || enemy2.y > (canvas.height - enemy2.height) || enemy2.y < (0 + enemy2.height)) {
          enemy2.x = getRandomInt(0, canvas.width, server.x, server.x + server.width);
          enemy2.y = getRandomInt(0, canvas.height, server.y, server.y + server.height);
        }
        enemy2.is_enabled = 1;
        break;
    case 2:
        if (!from_pullrequest || enemy2.x > (canvas.width - enemy2.width) || enemy2.x < (0 + enemy2.width) || enemy2.y > (canvas.height - enemy2.height) || enemy2.y < (0 + enemy2.height)) {
          enemy2.x = getRandomInt(0, canvas.width, server.x, server.x + server.width);
          enemy2.y = getRandomInt(0, canvas.height, server.y, server.y + server.height);
        }
        if (!from_pullrequest || enemy3.x > (canvas.width - enemy3.width) || enemy3.x < (0 + enemy3.width) || enemy3.y > (canvas.height - enemy3.height) || enemy3.y < (0 + enemy3.height)) {
          enemy3.x = getRandomInt(0, canvas.width, server.x, server.x + server.width);
          enemy3.y = getRandomInt(0, canvas.height, server.y, server.y + server.height);
        }
        enemy2.is_enabled = 1;
        enemy3.is_enabled = 1;
        break;
    case 3:
        if (!from_pullrequest || enemy2.x > (canvas.width - enemy2.width) || enemy2.x < (0 + enemy2.width) || enemy2.y > (canvas.height - enemy2.height) || enemy2.y < (0 + enemy2.height)) {
          enemy2.x = getRandomInt(0, canvas.width, server.x, server.x + server.width);
          enemy2.y = getRandomInt(0, canvas.height, server.y, server.y + server.height);
        }
        if (!from_pullrequest || enemy3.x > (canvas.width - enemy3.width) || enemy3.x < (0 + enemy3.width) || enemy3.y > (canvas.height - enemy3.height) || enemy3.y < (0 + enemy3.height)) {
          enemy3.x = getRandomInt(0, canvas.width, server.x, server.x + server.width);
          enemy3.y = getRandomInt(0, canvas.height, server.y, server.y + server.height);
        }
        if (!from_pullrequest || enemy4.x > (canvas.width - enemy4.width) || enemy4.x < (0 + enemy4.width) || enemy4.y > (canvas.height - enemy4.height) || enemy4.y < (0 + enemy4.height)) {
          enemy4.x = getRandomInt(0, canvas.width, server.x, server.x + server.width);
          enemy4.y = getRandomInt(0, canvas.height, server.y, server.y + server.height);
        }
        enemy2.is_enabled = 1;
        enemy3.is_enabled = 1;
        enemy4.is_enabled = 1;
        break;
    case 4:
        enemy.y -= enemy.speed;
        if (!from_pullrequest || enemy2.x > (canvas.width - enemy2.width) || enemy2.x < (0 + enemy2.width) || enemy2.y > (canvas.height - enemy2.height) || enemy2.y < (0 + enemy2.height)) {
          enemy2.x = getRandomInt(0, canvas.width, server.x, server.x + server.width);
          enemy2.y = getRandomInt(0, canvas.height, server.y, server.y + server.height);
        }
        if (!from_pullrequest || enemy3.x > (canvas.width - enemy3.width) || enemy3.x < (0 + enemy3.width) || enemy3.y > (canvas.height - enemy3.height) || enemy3.y < (0 + enemy3.height)) {
          enemy3.x = getRandomInt(0, canvas.width, server.x, server.x + server.width);
          enemy3.y = getRandomInt(0, canvas.height, server.y, server.y + server.height);
        }
        if (!from_pullrequest || enemy4.x > (canvas.width - enemy4.width) || enemy4.x < (0 + enemy4.width) || enemy4.y > (canvas.height - enemy4.height) || enemy4.y < (0 + enemy4.height)) {
          enemy4.x = getRandomInt(0, canvas.width, server.x, server.x + server.width);
          enemy4.y = getRandomInt(0, canvas.height, server.y, server.y + server.height);
        }
        if (!from_pullrequest || enemy5.x > (canvas.width - enemy5.width) || enemy5.x < (0 + enemy5.width) || enemy5.y > (canvas.height - enemy5.height) || enemy5.y < (0 + enemy5.height)) {
          enemy5.x = getRandomInt(0, canvas.width, server.x, server.x + server.width);
          enemy5.y = getRandomInt(0, canvas.height, server.y, server.y + server.height);
        }
        enemy2.is_enabled = 1;
        enemy3.is_enabled = 1;
        enemy4.is_enabled = 1;
        enemy5.is_enabled = 1;
        break;
  }
};

// Reset the game when the player catches a pullrequest
var reset = function (from_pullrequest = 0) {
  if (!from_pullrequest) {
  	server.x = canvas.width / 2;
  	server.y = canvas.height / 2;
  }

  if (dr_mode_on == 0) {
  	// Throw the pullrequest somewhere on the screen randomly
  	pullrequest.x = 32 + (Math.random() * (canvas.width - 64));
  	pullrequest.y = 32 + (Math.random() * (canvas.height - 64));

    // Throw the hotfix somewhere on the screen randomly
    throw_hotfix = getRandomInt(0,11);
    if (pullrequestCaught == throw_hotfix && keep_hotfix_on == 0) {
      hotfix.x = 32 + (Math.random() * (canvas.width - 64));
      hotfix.y = 32 + (Math.random() * (canvas.height - 64)); 
      keep_hotfix_on = 1;
    }
    else {
      hotfix.x = hotfix.x;
      hotfix.y = hotfix.y;
    }

    // Throw the cache shield somewhere on the screen randomly
    throw_cache = getRandomInt(0,11);
    if (throw_cache == pullrequestCaught && keep_cache_on == 0 && with_cache_shield <= 3) {
      cache.x = 32 + (Math.random() * (canvas.width - 64));
      cache.y = 32 + (Math.random() * (canvas.height - 64)); 
    }
    else {
      cache.x = cache.x;
      cache.y = cache.y;
    }
    if (with_cache_shield >= 1) {
      dcache.x = canvas.width - 100;
      dcache.y = 120;
    }
    else {
      dcache.x = 2000;
      dcache.y = 2000;
    }

    if (with_cache_shield >= 2) {
      varnish.x = canvas.width - 100;
      varnish.y = 180;
    }
    else {
      varnish.x = 2000;
      varnish.y = 2000;
    }

    if (with_cache_shield == 3) {
      akamai.x = canvas.width - 100;
      akamai.y = 240;
    }
    else {
      akamai.x = 2000;
      akamai.y = 2000;
    }

    throw_hfperformance = getRandomInt(0,23);
    if (throw_hfperformance == pullrequestCaught && keep_hfperformance_on == 0) {
      hfperformance.x = 32 + (Math.random() * (canvas.width - 64));
      hfperformance.y = 32 + (Math.random() * (canvas.height - 64)); 
      keep_hfperformance_on = 1;
    }

    throw_platform_issue = getRandomInt(0,11);
    if (throw_platform_issue == pullrequestCaught && keep_platform_issue_on == 0) {
      platform_issue.x = 32 + (Math.random() * (canvas.width - 64));
      platform_issue.y = 32 + (Math.random() * (canvas.height - 64)); 
      keep_platform_issue_on = 1;
    }
  }

  if (lives == -1 && dr_mode_on > 0) {
    dr_server.x = 32 + (Math.random() * (canvas.width - 64));
    dr_server.y = 32 + (Math.random() * (canvas.height - 64)); 
  }
  if (!from_pullrequest || enemy.x > (canvas.width - enemy.width) || enemy.x < (0 + enemy.width) || enemy.y > (canvas.height - enemy.height) || enemy.y < (0 + enemy.height)) {
  	enemy.x = getRandomInt(0, canvas.width, server.x, server.x + server.width);
  	enemy.y = getRandomInt(0, canvas.height, server.y, server.y + server.height);
  }
  if (builds >= 3) {
    enemies_number = Math.floor(builds/3);
    renderEnemies(enemies_number);
    if (builds%3 == 0) {
      level = Math.floor(builds/3) + 1;
      if (dr_mode_on == 0) {
        bgImage.src = levelAssets[level];
      }
      else {
        bgImage.src = levelAssets[0];
      }
    }
  }
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max, exfrom = 0, exto = 0) {
  // var rand = 0;
  // if (!(exfrom == 0 && exto == 0)) {
  //   while (rand != 0) {
  //     rand = Math.floor(Math.random() * (max - min + 1)) + min;
  //     if (!(rand < exfrom && rand > exto)) {
  //       rand = 0;
  //     }
  //   }
  //   return rand;
  // }
  // else {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  // }
}


var init = function () {
  arc_direction = getRandomInt(1,4);
  keep_direction = getRandomInt(0,1);
  lives = 3;
  enemy.speed = 5;
  builds = 0;
  pullrequestCaught = 0;
};

// Update game objects
var update = function (modifier) {
	enemy.speed += 0.001;
  if (enemy2.is_enabled == 1) {
    enemy2.speed += 0.001;
  }
  if (enemy3.is_enabled == 1) {
    enemy3.speed += 0.001;
  }
  if (enemy4.is_enabled == 1) {
    enemy4.speed += 0.001;
  }
  if (enemy5.is_enabled == 1) {
    enemy5.speed += 0.001;
  }
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
	        enemy.x += enemy.speed;
	        break;
	    case 2:
	        enemy.x -= enemy.speed;
	        break;
	    case 3:
	        enemy.y += enemy.speed;
	        break;
	    case 4:
	        enemy.y -= enemy.speed;
	        break;
	}

  //Move second enemy
  enemy2.keep_direction = getRandomInt(0,1);
  if (!keep_direction) {
    enemy2.arc_direction = getRandomInt(1,4);
  }
  switch(enemy2.arc_direction) {
      case 1:
          enemy2.x += enemy2.speed;
          break;
      case 2:
          enemy2.x -= enemy2.speed;
          break;
      case 3:
          enemy2.y += enemy2.speed;
          break;
      case 4:
          enemy2.y -= enemy2.speed;
          break;
  }

  //Move third enemy
  enemy3.keep_direction = getRandomInt(0,1);
  if (!keep_direction) {
    enemy3.arc_direction = getRandomInt(1,4);
  }
  switch(enemy3.arc_direction) {
      case 1:
          enemy3.x += enemy3.speed;
          break;
      case 2:
          enemy3.x -= enemy3.speed;
          break;
      case 3:
          enemy3.y += enemy3.speed;
          break;
      case 4:
          enemy3.y -= enemy3.speed;
          break;
  }

  //Move fourth enemy
  enemy4.keep_direction = getRandomInt(0,1);
  if (!keep_direction) {
    enemy4.arc_direction = getRandomInt(1,4);
  }
  switch(enemy4.arc_direction) {
      case 1:
          enemy4.x += enemy4.speed;
          break;
      case 2:
          enemy4.x -= enemy4.speed;
          break;
      case 3:
          enemy4.y += enemy4.speed;
          break;
      case 4:
          enemy4.y -= enemy4.speed;
          break;
  }

  //Move fifth enemy
  enemy5.keep_direction = getRandomInt(0,1);
  if (!keep_direction) {
    enemy5.arc_direction = getRandomInt(1,4);
  }
  switch(enemy5.arc_direction) {
      case 1:
          enemy5.x += enemy5.speed;
          break;
      case 2:
          enemy5.x -= enemy5.speed;
          break;
      case 3:
          enemy5.y += enemy5.speed;
          break;
      case 4:
          enemy5.y -= enemy5.speed;
          break;
  }

	// Are they touching? (server and pull request)
	if (
		server.x <= (pullrequest.x + pullrequest.width)
		&& pullrequest.x <= (server.x + pullrequest.width)
		&& server.y <= (pullrequest.y + pullrequest.height)
		&& pullrequest.y <= (server.y + pullrequest.height)
	) {
		++pullrequestCaught;
		enemy.speed -= 1;
		if (pullrequestCaught == 12) {
			++builds;
			pullrequestCaught = 0;
			// enemy.speed -= 10*builds;
      hfperformance.x = 2000;
      hfperformance.y = 2000;
      keep_hfperformance_on = 0;
      enemy.speed = builds*2;
      server.speed += 30;
      performance++;
      if (builds%2 == 0) {
        lives++;
      }
		}
		reset(from_pullrequest = 1);
	}
  // Are they touching? (server and enemy)
	if (
		(server.x <= (enemy.x + enemy.width)
		&& enemy.x <= (server.x + enemy.width)
		&& server.y <= (enemy.y + enemy.height)
		&& enemy.y <= (server.y + enemy.height))
    ||
    (server.x <= (enemy2.x + enemy2.width)
    && enemy2.x <= (server.x + enemy2.width)
    && server.y <= (enemy2.y + enemy2.height)
    && enemy2.y <= (server.y + enemy2.height))
    ||
    (server.x <= (enemy3.x + enemy3.width)
    && enemy3.x <= (server.x + enemy3.width)
    && server.y <= (enemy3.y + enemy3.height)
    && enemy3.y <= (server.y + enemy3.height))
    ||
    (server.x <= (enemy4.x + enemy4.width)
    && enemy4.x <= (server.x + enemy4.width)
    && server.y <= (enemy4.y + enemy4.height)
    && enemy4.y <= (server.y + enemy4.height))
    ||
    (server.x <= (enemy5.x + enemy5.width)
    && enemy5.x <= (server.x + enemy5.width)
    && server.y <= (enemy5.y + enemy5.height)
    && enemy5.y <= (server.y + enemy5.height))
	) {
    if (with_cache_shield == 0) {
		  --lives;
    }
    else {
      --with_cache_shield;
      keep_cache_on = 0;
    }
    switch(with_cache_shield) {
      case 0:
          serverImage.src = "images/pantheon.png";
          break;
      case 1:
          serverImage.src = "images/pantheon_dcache.png";
          break;
      case 2:
          serverImage.src = "images/pantheon_varnish.png";
          break;
      case 3:
          serverImage.src = "images/pantheon_akamai.png";
          break;
    }
    if (lives == -1) {
      dr_mode_on = 1;
      bgImage.src = levelAssets[0];
      pullrequest.x = 2000;
      pullrequest.y = 2000;
      hotfix.x = 2000;
      hotfix.y = 2000;
      performance.x = 2000;
      performance.y = 2000;
      hfperformance.x = 2000;
      hfperformance.y = 2000;
      cache.x = 2000;
      cache.y = 2000;
      platform_issue.x = 2000;
      platform_issue.y = 2000;
      enemy.speed = builds - 2;
      switch(enemies_number) {
        case 1:
          enemy2.speed = builds - 2;
            break;
        case 2:
          enemy3.speed = builds - 2;
            break;
        case 3:
          enemy4.speed = builds - 2;
            break;
        case 4:
          enemy5.speed = builds - 2;
            break;
      }

      reset();
    }
    else if (lives == -2) {
			gameOver();
		}
		else{
			reset();
		}
	}
  // Are they touching? (server and hotfix)
  if (
    server.x <= (hotfix.x + hotfix.width)
    && hotfix.x <= (server.x + hotfix.width)
    && server.y <= (hotfix.y + hotfix.height)
    && hotfix.y <= (server.y + hotfix.height)
  ) {
    enemy.x += 200;
    enemy.y += 200;
    enemy.speed -= builds*2;
    switch(enemies_number) {
      case 1:
          enemy2.x += 200;
          enemy2.y += 200;
          enemy2.speed -= builds*2;
          break;
      case 2:
          enemy3.x += 200;
          enemy3.y += 200;
          enemy3.speed -= builds*2;
          break;
      case 3:
          enemy4.x += 200;
          enemy4.y += 200;
          enemy4.speed -= builds*2;
          break;
      case 4:
          enemy5.x += 200;
          enemy5.y += 200;
          enemy5.speed -= builds*2;
          break;
    }
    hotfix.x = 2000;
    hotfix.y = 2000;
    keep_hotfix_on = 0;
  }
  // Are they touching? (server and cache)
  if (
    server.x <= (cache.x + cache.width)
    && cache.x <= (server.x + cache.width)
    && server.y <= (cache.y + cache.height)
    && cache.y <= (server.y + cache.height)
  ) {
    with_cache_shield += 1;
    cache.x = 2000;
    cache.y = 2000;
    keep_cache_on = 0;
    if (with_cache_shield >= 1) {
      dcache.x = canvas.width - 100;
      dcache.y = 120;
      if (with_cache_shield == 1) {
        serverImage.src = "images/pantheon_dcache.png";
      }
    }
    else {
      dcache.x = 2000;
      dcache.y = 2000;
    }

    if (with_cache_shield >= 2) {
      varnish.x = canvas.width - 100;
      varnish.y = 180;
      if (with_cache_shield == 2) {
        serverImage.src = "images/pantheon_varnish.png";
      }
    }
    else {
      varnish.x = 2000;
      varnish.y = 2000;
    }

    if (with_cache_shield == 3) {
      akamai.x = canvas.width - 100;
      akamai.y = 240;
      keep_cache_on = 1;
      serverImage.src = "images/pantheon_akamai.png";
    }
    else {
      akamai.x = 2000;
      akamai.y = 2000;
    }
    Debugger.log("with_cache_shield"+with_cache_shield );
    Debugger.log("keep_cache_on"+keep_cache_on );
  }
  // Are they touching? (server and hfperformance)
  if (
    server.x <= (hfperformance.x + hfperformance.width)
  && hfperformance.x <= (server.x + hfperformance.width)
  && server.y <= (hfperformance.y + hfperformance.height)
  && hfperformance.y <= (server.y + hfperformance.height)
  ) {
    Debugger.log("tocuhed" );
    hfperformance.x = 2000;
    hfperformance.y = 2000;
    server.speed += 30;
    performance++;
    keep_hfperformance_on = 0;
  }
  // Are they touching? (server and platform_issue)
  if (
    server.x <= (platform_issue.x + platform_issue.width)
  && platform_issue.x <= (server.x + platform_issue.width)
  && server.y <= (platform_issue.y + platform_issue.height)
  && platform_issue.y <= (server.y + platform_issue.height)
  ) {
    platform_issue.x = 2000;
    platform_issue.y = 2000;
    platform_issue_affects = getRandomInt(0,1);
    if (platform_issue_affects == 0) {
      server.speed -= 30;
      performance--;
    }
    else{
      if (with_cache_shield == 0) {
        --lives;
      }
      else {
        --with_cache_shield;
        keep_cache_on = 0;
      }
      switch(with_cache_shield) {
        case 0:
            serverImage.src = "images/pantheon.png";
            break;
        case 1:
            serverImage.src = "images/pantheon_dcache.png";
            break;
        case 2:
            serverImage.src = "images/pantheon_varnish.png";
            break;
        case 3:
            serverImage.src = "images/pantheon_akamai.png";
            break;
      }
      
      if (lives == -1) {
        dr_mode_on = 1;
        bgImage.src = levelAssets[0];
        pullrequest.x = 2000;
        pullrequest.y = 2000;
        hotfix.x = 2000;
        hotfix.y = 2000;
        performance.x = 2000;
        performance.y = 2000;
        hfperformance.x = 2000;
        hfperformance.y = 2000;
        cache.x = 2000;
        cache.y = 2000;
        platform_issue.x = 2000;
        platform_issue.y = 2000;
        enemy.speed = builds;
        switch(enemies_number) {
          case 1:
            enemy2.speed = builds;
              break;
          case 2:
            enemy3.speed = builds;
              break;
          case 3:
            enemy4.speed = builds;
              break;
          case 4:
            enemy5.speed = builds;
              break;
        }
        reset();
      }
      else if (lives == -2) {
        gameOver();
      }
      else{
        reset();
    }
    }
    keep_platform_issue_on = 0;
  }

  // Are they touching? (server and dr_server)
  if (
    server.x <= (dr_server.x + dr_server.width)
  && dr_server.x <= (server.x + dr_server.width)
  && server.y <= (dr_server.y + dr_server.height)
  && dr_server.y <= (server.y + dr_server.height)
  ) {
    dr_server.x = 2000;
    dr_server.y = 2000;
    dr_mode_on++;
    if (dr_mode_on == 6) {
      dr_mode_on = 0;
      lives++;
      bgImage.src = levelAssets[level];
      dr_server.x = 2000;
      dr_server.y = 2000;
    }
    reset(from_pullrequest = 1);
  }
};

var gameOver = function () {
	ctx.font = "40px Helvetica";
  ctx.fillStyle = 'Red';
  ctx.fillText('502 ERROR.. ALL SERVERS DOWN!!', canvas.width/2 - 340, canvas.height/2 - 50);
  ctx.font = "30px Verdana";
  ctx.fillStyle = 'White';
  ctx.fillText('Refresh to play again.', canvas.width/2 - 140, canvas.height/2 + 50);
  context.clearRect(0, 0, canvas.width, canvas.height);
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

  if (hotfixReady) {
    ctx.drawImage(hotfixImage, hotfix.x, hotfix.y);
  }

  if (cacheReady) {
    ctx.drawImage(cacheImage, cache.x, cache.y);
  }

  if (dcacheReady) {
    ctx.drawImage(dcacheImage, dcache.x, dcache.y);
  }

  if (varnishReady) {
    ctx.drawImage(varnishImage, varnish.x, varnish.y);
  }

  if (akamaiReady) {
    ctx.drawImage(akamaiImage, akamai.x, akamai.y);
  }

  if (hfperformanceReady) {
    ctx.drawImage(hfperformanceImage, hfperformance.x, hfperformance.y);
  }

  if (platform_issueReady) {
    ctx.drawImage(platform_issueImage, platform_issue.x, platform_issue.y);
  }

  if (dr_serverReady) {
    ctx.drawImage(dr_serverImage, dr_server.x, dr_server.y);
  }

	if (enemyReady) {
		ctx.drawImage(enemyImage, enemy.x, enemy.y);
	}

  if (enemy2Ready) {
    ctx.drawImage(enemy2Image, enemy2.x, enemy2.y);
  }

  if (enemy3Ready) {
    ctx.drawImage(enemy3Image, enemy3.x, enemy3.y);
  }

  if (enemy4Ready) {
    ctx.drawImage(enemy4Image, enemy4.x, enemy4.y);
  }

  if (enemy5Ready) {
    ctx.drawImage(enemy5Image, enemy5.x, enemy5.y);
  }

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "20px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
  lives_to_print = (lives != -1)?lives+'':'DR!!';
  dr_servers_to_print = (dr_mode_on > 0)?(dr_mode_on - 1)+'':'N/A';
	ctx.fillText("Builds: " + builds + " || Merged PRs: " + pullrequestCaught + " || Performance: " + performance + " || Servers: "+ lives_to_print + " || DR servers: " + dr_servers_to_print, 5, 15);
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
