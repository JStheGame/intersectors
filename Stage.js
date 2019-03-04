const exterior = {
	"vert-horiz-tunnel": [
		[[-200, 600], [50, 600], [50, 950], [600, 950], [600, 1200], [-200, 1200]],
		[[1700, 600], [1450, 600], [1450, 950], [900, 950], [900, 1200], [1700, 1200]],
		[[-200, 400], [50, 400], [50, 50], [600, 50], [600, -200], [-200, -200]],
		[[1700, 400], [1450, 400], [1450, 50], [900, 50], [900, -200], [1700, -200]]
	],
	"horiz-tunnel": [
		[[-200, 600], [50, 600], [50, 950], [1450, 950], [1450, 600], [1700, 600], [1700, 1200], [-200, 1200]],
		[[-200, 400], [50, 400], [50, 50], [1450, 50], [1450, 400], [1700, 400], [1700, -200], [-200, -200]]
	],
	"vert-tunnel": [
		[[600, -200], [600, 50], [50, 50], [50, 950], [600, 950], [600, 1200], [-200, 1200], [-200, -200]],
		[[900, -200], [900, 50], [1450, 50], [1450, 950], [900, 950], [900, 1200], [1700, 1200], [1700, -200]]
	],
	"full": [
		[[-200, -200], [0, -200], [0, screenHeight + 200], [-200, screenHeight + 200]],
		[[screenWidth + 200, -200], [screenWidth, -200], [screenWidth, screenHeight + 200], [screenWidth + 200, screenHeight + 200]],
		[[-200, -200], [screenWidth + 200, -200], [screenWidth + 200, 0], [-200, 0]],
		[[-200, screenHeight], [screenWidth + 200, screenHeight], [screenWidth + 200, screenHeight + 200], [-200, screenHeight + 200]]
	],
	"none": []
}

const interior = {
	"middle-platform": [
		[[300, 450], [screenWidth - 300, 450], [screenWidth - 300, 550], [300, 550]]
	],
	"inclined-platforms": [
		[[200, 600], [400, 600], [600, 800], [200, 800]],
		[[1300, 600], [1100, 600], [900, 800], [1300, 800]],
		[[600, 450], [900, 450], [750, 600]]
	],
	"one-triangle": [
		[[200, 800], [1300, 800], [750, 400]]
	],
	"middle-divider": [
		[[500, 120], [600, 120], [600, 250], [1000, 650], [1000, 880], [900, 880], [900, 700], [500, 300]]
	],
	"none": []
}

const randKey = obj => {
	const keys = Object.keys(obj);
	const length = keys.length;
	return keys[rand(0, length - 1)];
}

class Stage {
	constructor(round, exteriorType = randKey(exterior), interiorType = randKey(interior)) {
		this.platforms = new Set();
		this.round = round;

		for(const vertices of exterior[exteriorType]) {
			this.platforms.add(new PolygonBlock(vertices, this));
		}

		for(const vertices of interior[interiorType]) {
			this.platforms.add(new PolygonBlock(vertices, this));
		}
	}

	draw() {
		for(const platform of this.platforms) platform.draw();
	}
}