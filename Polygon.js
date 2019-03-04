class PolygonBlock {
	// points is an array of [x, y] values, like [[1, 2], [5, 2], [3, 3]]
	constructor(points, stage) {
		this.points = points;
		this.stage = stage;

		this.body = physicsManager.world.createBody({
			type: "static",
			position: Vec2(0, 0)
		});

		if(points.length === 8) {
			this.body.createFixture({
				shape: Polygon(
					points.filter((_, i) => [0, 1, 2, 7].includes(i))
					.map(([x, y]) => Vec2(x / SCALE, y / SCALE))
				),
				friction: 0.5,
				restitution: 0
			});

			this.body.createFixture({
				shape: Polygon(
					points.filter((_, i) => [2, 3, 6, 7].includes(i))
					.map(([x, y]) => Vec2(x / SCALE, y / SCALE))
				),
				friction: 0.5,
				restitution: 0
			});

			this.body.createFixture({
				shape: Polygon(
					points.filter((_, i) => [3, 4, 5, 6].includes(i))
					.map(([x, y]) => Vec2(x / SCALE, y / SCALE))
				),
				friction: 0.5,
				restitution: 0
			});
		} else if(points.length === 6) {
			this.body.createFixture({
				shape: Polygon(
					points.filter((_, i) => [0, 1, 2, 5].includes(i))
					.map(([x, y]) => Vec2(x / SCALE, y / SCALE))
				),
				friction: 0.5,
				restitution: 0
			});

			this.body.createFixture({
				shape: Polygon(
					points.filter((_, i) => [2, 3, 4, 5].includes(i))
					.map(([x, y]) => Vec2(x / SCALE, y / SCALE))
				),
				friction: 0.5,
				restitution: 0
			});
		} else {
			this.body.createFixture({
				shape: Polygon(points.map(([x, y]) => Vec2(x / SCALE, y / SCALE))),
				friction: 0.5,
				restitution: 0
			});
		}

		this.body.setUserData({class: "Polygon"});

		physicsManager.bodies.add(this.body);
	}

	draw() {
		push();
		fill(255, 35);
		stroke(255);
		strokeWeight(5);

		beginShape();
		for(const [x, y] of this.points) vertex(x, y);
		endShape(CLOSE);

		pop();
	}
}
