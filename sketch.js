// main menu to begin with - eventually
// replace with Game (char select / customization) - eventually
// replace with Round, Pause menu, controls menu
const sceneManager = new SceneManager();

function keyPressed() {
	keys[key] = 1;
}

function keyReleased() {
	keys[key] = 0;
}

// runs once before setup
function preload() {
	soundFormats("wav");
	testSound1 = loadSound("assets/1.wav");
	testSound2 = loadSound("assets/4.wav");
	testSound3 = loadSound("assets/5.wav");
}

// runs once, when the page is ready
function setup() {
	createCanvas(screenWidth, screenHeight);
	noSmooth();
	rectMode(CENTER);

	// eventually put the main menu on the scene stack initially
	const promiseTest = new Promise(function(resolve, reject) {
		setTimeout(_ => resolve(), 0);
	});

	gameManager.addPlayer(new Player(config[0], 200, "right"));
	gameManager.addPlayer(new Player(config[1], screenWidth / 2, "left"));
	gameManager.addPlayer(new Player(config[2], screenWidth - 200, "left"));

	promiseTest.then(_ => sceneManager.replace(new Round()));
}

// this function fires every frame
function draw() {
	//physicsManager.update();
	sceneManager.update();
	sceneManager.draw();
}

