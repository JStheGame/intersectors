// UTILITY FUNCTIONS
const rand = (lower, upper, pow = 1) => Math.floor(Math.random() ** pow * (upper - lower + 1) + lower);

// GAMEPLAY VARIABLES
const keys = {};
//const players = [];
const intersectors = [];
const HUDs = [];
const PAUSE = "P";

// INITIALIZATION
const screenWidth = 1500;
const screenHeight = 1000;
const {World, Vec2, Circle, Box, Edge, Chain, Polygon} = planck;
const SCALE = 320; // defines the relation between pixels and metres
//const world = planck.World({gravity: planck.Vec2(0, 9.81)});


//let physicsManager;

const physicsManager = {
	world: World({gravity: planck.Vec2(0, 9.81)}),
	bodies: new Set(),
	update: _ => physicsManager.world.step(1 / 60),
	createPlayer: function(x, y, width, height) {
		const body = this.world.createBody({
			type: "dynamic",
			position: Vec2(x / SCALE, y / SCALE),
			fixedRotation: true,
			bullet: true
		});

		return body;
	},
	reset: function() {
		// clear all the bodies from the world
		for(const body of this.bodies) {
			if(body.getUserData().class !== "Player") {
				this.world.destroyBody(body);
				this.bodies.delete(body);
			}
		}

		return this.bodies.size === 0;
	}
};

const gameManager = {
	players: [],
	intersectors: [],
	HUDs: [],
	score: [],
	controlIndices: [],
	roundsToWin: 7,
	addPlayer: function(player) {
		this.players.push(player);
		this.score.push(0);
	},
	checkForWinner: function() {
		let winner = -1;

		for(let i = 0; i < this.score.length; i++) {
			if(this.score[i] >= this.roundsToWin) winner = i;
		}

		return winner;
	},
	reset: function() {
		this.players = [];
		this.score = [];
		this.HUDs = [];
		this.score = [];
	}
	// maybe other stuff too!
}



let testSound1, testSound2, testSound3;


const config = [
    {
        left: "%",
        right: "'",
        up: "&",
        down: "(",
        jump: " ",
        hold: "Z",
        flatPlat: "X",
        vertPlat: "C",
        clear: "V",
        pause: "B"
    },
    {
        left: "A",
        right: "D",
        up: "W",
        down: "S",
        jump: "Q",
        hold: "E",
        flatPlat: "1",
        vertPlat: "2",
        clear: "3",
        pause: "4"
    },
    {
        left: "F",
        right: "H",
        up: "T",
        down: "G",
        jump: "R",
        hold: "Y",
        flatPlat: "6",
        vertPlat: "7",
        clear: "8",
        pause: "9"
    },
    {
        left: "J",
        right: "L",
        up: "I",
        down: "K",
        jump: "U",
        hold: "O",
        flatPlat: "P",
        vertPlat: "M",
        clear: "Û",
        pause: "0"
    }
];

const buttons = {};

for(let i = 0; i < 4; i++) {
	for(const key of Object.values(config[i])) {
		buttons[key] = i;
	}
}
