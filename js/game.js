// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "img/spacebg.jpg";
bgImage.width = 1000;
// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "img/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "img/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {};
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	// Take care of overflow
	if (hero.x > canvas.width - 30)
		hero.x = canvas.width - 30;
	if (hero.x < 0)
		hero.x = 0;
	if (hero.y > canvas.height - 30)
	hero.y = canvas.height - 30;
	if (hero.y < 0)
	hero.y = 0;

	// Monster overflow
	monster.x += (Math.random() - 0.5) * hero.speed * 0.09;
	monster.x = Math.abs(monster.x);
	if (monster.x > canvas.width)
		monster.x = canvas.width;
	monster.y += (Math.random() - 0.5) * hero.speed * 0.09;
	monster.y = Math.abs(monster.y);
    if (monster.y > canvas.height)
		monster.y = canvas.height;

	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset();
	}

};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// For mobile 
canvas.addEventListener("click", function(e){

    // Because mobile is a pain
    var modifier = 0.3;
    var mmodifier = 0.1;
    var x = 0;
    var y = 0;
    if (e.pageX !== undefined && e.pageY !== undefined) {
    x = e.pageX;
    y = e.pageY;
    }

    // Take care of mobile taps for movement

	if (y < hero.y) { // Player holding up
	    hero.y -= hero.speed * modifier;
	}
	if (y > hero.y) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (x < hero.x) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (x > hero.x) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	monster.x += (Math.random() - 0.5) * hero.speed * mmodifier;
	monster.x = Math.abs(monster.x);
	monster.y += (Math.random() - 0.5) * hero.speed * mmodifier;
	monster.y = Math.abs(monster.y);
	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset();
	}
}, false);
var getpos = function (e) {
    var position = {x: null, y: null};
    if (Modernizr.touch) { //global variable detecting touch support
        if (e.touches && e.touches.length > 0) {
            position.x = e.touches[0].pageX - canvasPosition.x;
            position.y = e.touches[0].pageY - canvasPosition.y;
        }
    }
    else {
        position.x = e.pageX - canvasPosition.x;
        position.y = e.pageY - canvasPosition.y;
    }
    
    return position;
}

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible
