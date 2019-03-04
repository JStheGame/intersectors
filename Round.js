class Round {
	constructor(stage) {
		this.bounceFunction = contact => {
			const [fixtureA, fixtureB] = [..."AB"].map(X => contact[`getFixture${X}`]());
			const [bodyA, bodyB] = [fixtureA, fixtureB].map(fixture => fixture.getBody());
			const [classA, classB] = [bodyA, bodyB].map(body => body.getUserData()["class"]);

			if(classA === "Player" && classB === "Player") {
				const {x: xA, y: yA} = bodyA.getPosition();
				const {x: xB, y: yB} = bodyB.getPosition();
				
				const {x: xVA, y: yVA} = bodyA.getLinearVelocity();
				const {x: xVB, y: yVB} = bodyB.getLinearVelocity();
				
				if(Math.abs(yA - yB) < 98 / SCALE) {
					const blastStrength = Math.abs(xVA - xVB) + 3;
					bodyA.setLinearVelocity(Vec2((xA - xB) * blastStrength, yVA));
					bodyB.setLinearVelocity(Vec2((xB - xA) * blastStrength, yVB));
				}
			}
		};

		this.sensorActivate = contact => {
			const [fixtureA, fixtureB] = [..."AB"].map(X => contact[`getFixture${X}`]());

			for(const player of gameManager.players) {
				for(const [sensor, platform] of [[fixtureA, fixtureB], [fixtureB, fixtureA]]) {
					if(!platform.isSensor()) {
						if(sensor === player.footSensor) {
							player.grounded = true;
							player.floorContacts.add(platform);
						}

						if(sensor === player.leftSensor) {
							player.leftWalled = true;
							player.leftContacts.add(platform);
						}

						if(sensor === player.rightSensor) {
							player.rightWalled = true;
							player.rightContacts.add(platform);
						}
					}
				}
			}
		};

		this.sensorDeactivate = contact => {
			const [fixtureA, fixtureB] = [..."AB"].map(X => contact[`getFixture${X}`]());
			
			for(const player of gameManager.players) {
				for(const [sensor, platform] of [[fixtureA, fixtureB], [fixtureB, fixtureA]]) {
					if(!platform.isSensor()) {
						if(sensor === player.footSensor) {
							player.floorContacts.delete(platform);
							if(player.floorContacts.size === 0) player.grounded = false;
						}

						if(sensor === player.leftSensor) {
							player.leftContacts.delete(platform);
							if(player.leftContacts.size === 0) player.leftWalled = false;
						}

						if(sensor === player.rightSensor) {
							player.rightContacts.delete(platform);
							if(player.rightContacts.size === 0) player.rightWalled = false;
						}
					}
				}
			}
		};

		//this.activePlayers = gameManager.players.map(_ => true);
		//this.playersRemaining = gameManager.players.length;

		for(const player of gameManager.players) {
			player.reset();
		}

		// generate a new random stage
		this.stage = new Stage(this);

		this.stageObjects = [];

		for(let i = 0; i < 30; i++) {
			//this.stageObjects.push(new Ball(rand(100, screenWidth - 100), rand(100, screenHeight - 100), rand(10, 80)));
		}

		// COLLISION LISTENERS
		// bounce players away from each other horizontally
		physicsManager.world.on("pre-solve", this.bounceFunction);

		// check for player collisions beginning with platforms
		physicsManager.world.on("begin-contact", this.sensorActivate);

		// check for player collisions ending with platforms
		physicsManager.world.on("end-contact", this.sensorDeactivate);
	}

	update() {
		// spawn powerups periodically

		if(gameManager.players.filter(player => player.hp > 0).length < 2) {
			// end this round!

			// destroy the world
			this.end();
		}

		// advance the physics engine 1 frame
		if(keys[PAUSE]) {
			// pause the game
			keys[PAUSE] = 0;

			//gameManager.players[0].reset();
			//this.end();
			
			sceneManager.add(new Menu(
				"GAME PAUSED",
				{
					"resume": _ => sceneManager.remove(),
					"restart": _ => alert("cool!"),
					"exit": _ => alert("exit!")
				}
			));
		} else {
			physicsManager.update();
		}

		for(const object of this.stageObjects) {
			object.update();
		}

		for(const player of gameManager.players) {
			player.update();

			for(const platform of player.platforms) {
				platform.update();
			}
		}

		for(const intersector of gameManager.intersectors) {
			intersector.update();
		}
	}

	draw() {
		// paint the background
		background(100);

		this.stage.draw();
		
		for(const object of this.stageObjects) {
			object.draw();
		}

		for(const player of gameManager.players) {
			for(const platform of player.platforms) {
				platform.draw();
			}

			player.draw();
		}

		for(const intersector of gameManager.intersectors) {
			intersector.draw();
		}

		// draw HUD
		for(const HUD of gameManager.HUDs) HUD.draw();
	}

	end() {
		// end the round

		// clear the intersectors and heads up displays
		//gameManager.intersectors.splice(0, gameManager.intersectors.length);
		//gameManager.HUDs.splice(0, gameManager.HUDs.length);

		// deactivate the collision listeners
		physicsManager.world.off("pre-solve", this.bounceFunction);
		physicsManager.world.off("begin-contact", this.sensorActivate);
		physicsManager.world.off("end-contact", this.sensorDeactivate);

		// reset the world
		console.log(physicsManager.reset());

		// update the score
		let max = 0;
		let winner;

		for(const [i, player] of Object.entries(gameManager.players)) {
			if(player.hp > max) {
				max = player.hp;
				winner = i;
			}
		}

		gameManager.score[winner]++;

		// display the scoreboard
		sceneManager.add(new Scoreboard());
		console.log(gameManager);
	}
}