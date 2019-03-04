class Scoreboard {
	constructor(scores) {
		this.scores = scores;
	}

	update() {
		// listen for confirmation (button press)
		if(keys[" "]) {
			keys[" "] = 0;

			// close the scoreboard, start a new round maybe
			const winnerIndex = gameManager.checkForWinner();

			if(winnerIndex > -1) {
				// end the game, go to endGame menu
				sceneManager.replace(new Menu(
					"that was fun!",
					{
						"rematch": _ => {
							for(let i = 0; i < gameManager.score.length; i++) {
								gameManager.score[i] = 0;
							}

							sceneManager.replace(new Round());
						},
						"character select": _ => {
							gameManager.reset();
						},
						"exit to main menu": _ => {
							gameManager.reset();
						}
					}
				));
			} else {
				// do another round
				sceneManager.replace(new Round());
			}
		}
	}

	draw() {
		const [x, y] = [screenWidth / 2, screenHeight / 2];
		push();

		fill(0, 200);
		stroke(255);
		strokeWeight(5);

		rect(x, y, 800, 600);

		noStroke();
		fill(255);
		textSize(40);
		textAlign(CENTER, CENTER);

		text("scoreboard", x, y - 250);

		for(const [i, player] of Object.entries(gameManager.players)) {
			// draw the player's avatar
			noStroke();
			fill(...player.rgb);
			const [playerX, playerY] = [x - 300, y - 150 + 100 * i];

			rect(playerX, playerY, 60, 60);
			const playerScore = gameManager.score[i];

			for(const s of [-1, 1]) {
				fill(0);
				
				ellipse(playerX + s * 20, playerY, 12, 12);

				fill(255);
				ellipse(playerX + s * 20 - 2, playerY - 2, 4, 4);
				ellipse(playerX + s * 20 - 1, playerY + 1, 2, 2);
				ellipse(playerX + s * 20 + 1, playerY, 2, 2);
			}

			// draw the mouth
			fill(0);
			arc(playerX, playerY + 5, 15, 15, 0, PI);




			// draw the player's score
			stroke(255);
			strokeWeight(5);

			for(let j = 0; j < gameManager.roundsToWin; j++) {
				fill(...(j < playerScore ? player.rgb : [0]));
				rect(x - 200 + 50 * j, y - 150 + 100 * i, 35, 35);
			}

		}

		pop();
	}
}