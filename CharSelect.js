class CharSelect() {
	constructor() {
		this.joined = Array(4).fill(false);
		//this.joined = 0;
		this.players = [];
		this.howMany = 0;
	}

	update() {
		// listen for button presses
		for(let i = 0; i < 4; i++) {
			for(const key of Object.keys(config[i])) {
				if(keys[key] && !this.joined[i]) {
					// player i join the game
					//this.joined[i] = true;

					this.players.push(new Player(config[i]));
					this.howMany++;
				}
			}
		}

		// if the button belongs to an active player, affect the menu

		// else, join that player in!





	}

	draw() {
		background(80);


	}
}