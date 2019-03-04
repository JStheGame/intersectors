class Ball {
	constructor(x = 800, y = 150, radius = 100, round) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.round = round;

		this.body = physicsManager.world.createBody({
			type: "dynamic",
			position: Vec2(this.x / SCALE, this.y / SCALE)
		});

		this.body.createFixture({
			shape: Circle(this.radius / SCALE),
			friction: 0.5,
			density: 1,
			restitution: 0.8
		});

		this.body.setUserData({class: "Ball"});

		physicsManager.bodies.add(this.body);
	}

	update() {
		// screen wrap
		const {x, y} = this.body.getPosition();
		const [xBound, yBound] = [
			screenWidth + 2 * this.radius, 
			screenHeight + 2 * this.radius
		];

		const [xOffset, yOffset] = [this.radius, this.radius];

		const [xPos, yPos] = [
			((x * SCALE + xBound + xOffset) % xBound - xOffset) / SCALE, 
			((y * SCALE + yBound + yOffset) % yBound - yOffset) / SCALE
		];

		this.body.setPosition(Vec2(xPos, yPos));

		//[this.x, this.y] = [xPos, yPos].map(coord => coord * SCALE);
	}

	draw() {
		push();
		noFill();
		stroke(255);
		strokeWeight(5);

		const {x, y} = this.body.getPosition();
		[this.x, this.y] = [x * SCALE, y * SCALE];
		ellipse(this.x, this.y, this.radius * 2, this.radius * 2);

		pop();
	}
}