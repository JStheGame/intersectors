class Platform {
	constructor(x, y, width, height, rgb, parent) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.rgb = rgb;
		this.lifeSpan = 300;
		this.flashing = false;
		this.parent = parent;

		this.body = physicsManager.world.createBody({
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
		this.body.createFixture({
			shape: Edge(
				Vec2(-(halfW - 1) / SCALE, -halfH / SCALE), 
				Vec2((halfW - 1) / SCALE, -halfH / SCALE)
			),
			friction: 0.5
		});

		// bottom edge
		this.body.createFixture({
			shape: Edge(
				Vec2(-halfW / SCALE, halfH / SCALE), 
				Vec2(halfW / SCALE, halfH / SCALE)
			),
			friction: 0.5
		});

		// left edge
		this.body.createFixture({
			shape: Edge(
				Vec2(-halfW / SCALE, -halfH / SCALE), 
				Vec2(-halfW / SCALE, halfH / SCALE)
			),
			friction: 0.5
		});

		// right edge
		this.body.createFixture({
			shape: Edge(
				Vec2(halfW / SCALE, -halfH / SCALE), 
				Vec2(halfW / SCALE, halfH / SCALE)
			),
			friction: 0.5
		});
		
		// check for intersection with any player
		for(const player of gameManager.players) {
			if(player.getOverlap(x, y, width, height) > 0) {
				// don't do the platform!
				physicsManager.world.destroyBody(this.body);
				return;
			}
		}

		this.body.setUserData({class: "Platform"});

		physicsManager.bodies.add(this.body);


		// temp platform overlap-preventer function
		physicsManager.world.step(0);

		if(this.body.getContactList().next.contact.isTouching()) {
			physicsManager.world.destroyBody(this.body);
			return;
		}


		if(parent && parent.platforms) this.parent.platforms.add(this);
	}

	update() {
		this.lifeSpan--;

		if(this.lifeSpan < 60) this.flashing = true;
		if(this.lifeSpan < 0) this.delete();
	}

	draw() {
		push();
		stroke(...this.rgb, this.flashing ? Math.sin(frameCount) * 125 + 130 : 255);
		strokeWeight(5);
		noFill();
		rect(this.x, this.y, this.width, this.height);
		pop();
	}

	delete() {
		// don't draw the platform anymore
		this.parent.platforms.delete(this);
		// delete the platform from physical space
		physicsManager.world.destroyBody(this.body);
		physicsManager.bodies.delete(this.body);
	}
}