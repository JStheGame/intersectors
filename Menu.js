class Menu {
	// title, options = {"option name": _ => {option command}}, pos
	constructor(title = "MENU", options = {}, position = [0, 0], controllers = [0, 1, 2, 3]) {
		this.title = title;
		this.options = options;
		this.optionNames = Object.keys(options);
		this.howManyOptions = this.optionNames.length;
		this.position = position;
		this.controllers = controllers;
		this.selected = 0;
	}

	update() {
		// eventually change these listeners to correspond to
		// the controlling players' buttons

		if(keys[PAUSE]) {
			//unpause
			keys[PAUSE] = 0;
			sceneManager.remove();
		}

		if(keys["&"]) {
			// go up
			keys["&"] = 0;
			this.selected = (this.selected + this.howManyOptions - 1) % this.howManyOptions;
		}

		if(keys["("]) {
			// go down
			keys["("] = 0
			this.selected = (this.selected + 1) % this.howManyOptions;
		}

		if(keys[" "]) {
			// select this option
			keys[" "] = 0;
			this.options[this.optionNames[this.selected]]();
		}
	}

	draw() {
		const [x, y] = [screenWidth / 2, screenHeight / 2];

		push();
		noStroke();
		fill(255);
		
		fill(0, 200);

		rect(x, y, 800, 500);

		fill(255);

		textSize(40);
		textAlign(CENTER, CENTER);
		text(this.title, x, y - 200);
		
		for(let i = 0; i < this.howManyOptions; i++) {
			textAlign(LEFT, CENTER);

			// draw the option name
			text(this.optionNames[i], x - 200, y - 100 + 100 * i);
			
			// draw the selection arrow
			if(this.selected === i) {
				rect(x - 250, y - 100 + 100 * i, 25, 25);
			}

		}


		pop();
	}
}