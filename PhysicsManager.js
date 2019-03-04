// instantiate this when the game starts
class PhysicsManager {
	constructor(gravity = 9.81) {
		this.world = planck.World({gravity: planck.Vec2(0, gravity)});

		// COLLISION LISTENERS
		// bounce players away from each other horizontally
		this.world.on("pre-solve", contact => {
			const [fixtureA, fixtureB] = [..."AB"].map(X => contact[`getFixture${X}`]());
			const [bodyA, bodyB] = [fixtureA, fixtureB].map(fixture => fixture.getBody());
			const [classA, classB] = [bodyA, bodyB].map(body => body.getUserData()["class"]);

			if(classA === "Player" && classB === "Player") {
				const {x: xA, y: yA} = bodyA.getPosition();
				const {x: xB, y: yB} = bodyB.getPosition();
				
				const {x: xVA, y: yVA} = bodyA.getLinearVelocity();
				const {x: xVB, y: yVB} = bodyB.getLinearVelocity();
				
				if(Math.abs(yA - yB) < 98 / SCALE) {
					const blastStrength = Math.abs(xVA - xVB) + 5;
					bodyA.setLinearVelocity(Vec2((xA - xB) * blastStrength, yVA));
					bodyB.setLinearVelocity(Vec2((xB - xA) * blastStrength, yVB));
				}
			}
		});

		// check for player collisions beginning with platforms
		this.world.on("begin-contact", contact => {
			const [fixtureA, fixtureB] = [..."AB"].map(X => contact[`getFixture${X}`]());

			for(const player of players) {
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
		});

		// check for player collisions ending with platforms
		this.world.on("end-contact", contact => {
			const [fixtureA, fixtureB] = [..."AB"].map(X => contact[`getFixture${X}`]());
			
			for(const player of players) {
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
		});

		this.bodies = new Set();

		this.players = new Set();
		this.platforms = new Set();
		this.stageObjects = new Set();
		this.polygons = new Set();
	}

	update() {
		console.log([...this.players].map(player => player.getPosition()));
		setTimeout(_ => this.world.step(1 / 60), 100);
		console.log([...this.players].map(player => player.getPosition()));
	}

	clearWorld() {
		for(const body of this.bodies) {
			this.world.destroyBody(body);
		}
	}

	createPlayer(x, y, width, height) {
		// return body;
		const body = this.world.createBody({
			type: "dynamic",
			position: Vec2(x / SCALE, y / SCALE),
			fixedRotation: true,
			bullet: true
		});

		this.players.add(body);
		console.log([...this.players].map(player => player.getPosition()));
		return body;
	}

	createPolygon(points) {
		const body = this.world.createBody({
			type: "static",
			position: Vec2(0, 0)
		});

		if(points.length === 8) {
			body.createFixture({
				shape: Polygon(
					points.filter((_, i) => [0, 1, 2, 7].includes(i))
					.map(([x, y]) => Vec2(x / SCALE, y / SCALE))
				),
				friction: 0.5,
				restitution: 0
			});

			body.createFixture({
				shape: Polygon(
					points.filter((_, i) => [2, 3, 6, 7].includes(i))
					.map(([x, y]) => Vec2(x / SCALE, y / SCALE))
				),
				friction: 0.5,
				restitution: 0
			});

			body.createFixture({
				shape: Polygon(
					points.filter((_, i) => [3, 4, 5, 6].includes(i))
					.map(([x, y]) => Vec2(x / SCALE, y / SCALE))
				),
				friction: 0.5,
				restitution: 0
			});
		} else if(points.length === 6) {
			body.createFixture({
				shape: Polygon(
					points.filter((_, i) => [0, 1, 2, 5].includes(i))
					.map(([x, y]) => Vec2(x / SCALE, y / SCALE))
				),
				friction: 0.5,
				restitution: 0
			});

			body.createFixture({
				shape: Polygon(
					points.filter((_, i) => [2, 3, 4, 5].includes(i))
					.map(([x, y]) => Vec2(x / SCALE, y / SCALE))
				),
				friction: 0.5,
				restitution: 0
			});
		} else {
			body.createFixture({
				shape: Polygon(points.map(([x, y]) => Vec2(x / SCALE, y / SCALE))),
				friction: 0.5,
				restitution: 0
			});
		}

		body.setUserData({class: "Polygon"});

		this.polygons.add(body);

		return body;
	}

	createBall(x, y, radius) {
		const body = this.world.createBody({
			type: "dynamic",
			position: Vec2(this.x / SCALE, this.y / SCALE)
		});

		body.createFixture({
			shape: Circle(this.radius / SCALE),
			friction: 0.5,
			density: 1,
			restitution: 0.8
		});

		body.setUserData({class: "Ball"});

		this.stageObjects.add(body);

		return body;
	}


	createPlatform(x, y, width, height) {
		// return body;
		const body = this.world.createBody({
			type: "static",
			position: Vec2(x / SCALE, y / SCALE)
		});

		const [halfW, halfH] = [width / 2, height / 2];
		
		/*
		this.body.createFixture({
			shape: Box(halfW / SCALE, halfH / SCALE, Vec2(0, 0), 0),
			restitution: 0,
			friction: 0.35
		});
		*/

		// top edge
		body.createFixture({
			shape: Edge(
				Vec2(-(halfW - 1) / SCALE, -halfH / SCALE), 
				Vec2((halfW - 1) / SCALE, -halfH / SCALE)
			),
			friction: 0.5
		});

		// bottom edge
		body.createFixture({
			shape: Edge(
				Vec2(-halfW / SCALE, halfH / SCALE), 
				Vec2(halfW / SCALE, halfH / SCALE)
			),
			friction: 0.5
		});

		// left edge
		body.createFixture({
			shape: Edge(
				Vec2(-halfW / SCALE, -halfH / SCALE), 
				Vec2(-halfW / SCALE, halfH / SCALE)
			),
			friction: 0.5
		});

		// right edge
		body.createFixture({
			shape: Edge(
				Vec2(halfW / SCALE, -halfH / SCALE), 
				Vec2(halfW / SCALE, halfH / SCALE)
			),
			friction: 0.5
		});

		// check for intersection with any player
		for(const player of players) {
			if(player.getOverlap(x, y, width, height) > 0) {
				// don't do the platform!
				world.destroyBody(body);
				return null;
			}
		}

		body.setUserData({class: "Platform"});

		return body;
	}
}