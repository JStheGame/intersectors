class DebugMode {
	constructor() {
		// do nothing
	}

	update() {
		if(keys[PAUSE]) {
			//unpause
			keys[PAUSE] = 0;
			sceneManager.remove();
		}
	}

	draw() {
		push();
		stroke(255);
		strokeWeight(5);
		fill(255);

		background(0, 100);

		textSize(30);

		// draw a grid
		for(let x = 100; x < screenWidth; x += 100) {
			// draw a line
			stroke(255);
			line(x, 0, x, screenHeight);
			noStroke();
			text(x, x, 100);
		}

		for(let y = 100; y < screenHeight; y += 100) {
			// draw a line
			stroke(255);
			line(0, y, screenWidth, y);
			noStroke();
			text(y, 100, y);
		}

		pop();
	}
}