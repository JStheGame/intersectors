class Player {
	constructor(
		controls, spawnX, facing = "left",
		offsetX = rand(5, 125), offsetY = rand(-75, 75)
	) {
		// physical properties
		this.x = spawnX;
		this.y = 100;
		this.spawnX = spawnX;
		this.width = 100;
		this.height = 100;
		this.jumpPower = 3.5;
		this.walkSpeed = 0.75;
		this.speedLimit = 2;

		// aesthetic properties
		this.rgb = Array.from({length: 3}, _ => rand(144, 233));
		this.facing = facing;
		this.shaking = 0;

		// gameplay properties
		this.controls = controls
		this.maxHp = 50000;
		this.hp = this.maxHp;
		this.platforms = new Set();
		this.platformLimit = 3;

		// sensor management properties
		this.grounded = false;
		this.floorContacts = new Set();
		this.leftWalled = false;
		this.leftContacts = new Set();
		this.rightWalled = false;
		this.rightContacts = new Set();
		
		this.HUD = new HUD(spawnX - 60, this);
		gameManager.HUDs.push(this.HUD);

		this.intersector = new Intersector(this, offsetX, offsetY);
		gameManager.intersectors.push(this.intersector);

		// define the physical body
		this.body = physicsManager.createPlayer(spawnX, 150, 100, 100);

		this.body.createFixture({
			// Box(halfWidth, halfHeight, position, rotation)
			shape: Box(this.width / 2 / SCALE, this.height / 2 / SCALE, 
				Vec2(0, 0), 0),
			restitution: 0,
			friction: 0.5,
			density: 10
		});

		// create the sensors
		this.footSensor = this.body.createFixture({
			shape: Box(45 / SCALE, 5 / SCALE, Vec2(0, 50 / SCALE), 0),
			isSensor: true
		});

		this.leftSensor = this.body.createFixture({
			shape: Box(5 / SCALE, 50 / SCALE, Vec2(-50 / SCALE, 0), 0),
			isSensor: true
		});

		this.rightSensor = this.body.createFixture({
			shape: Box(5 / SCALE, 50 / SCALE, Vec2(50 / SCALE, 0), 0),
			isSensor: true
		});

		this.body.setUserData({class: "Player"});

		physicsManager.bodies.add(this.body);
	}

	update() {
		// listen for key presses
		if(keys[this.controls.jump]) {
			this.jump();
			keys[this.controls.jump] = 0;
		}

		if(keys[this.controls.flatPlat]) {
			this.layPlatform();
			keys[this.controls.flatPlat] = 0;
		}

		if(keys[this.controls.vertPlat]) {
			this.layVertPlatform();
			keys[this.controls.vertPlat] = 0;
		}

		if(keys[this.controls.dash]) {
			this.dash();
			keys[this.controls.dash] = 0;
		}

		if(keys[this.controls.clear]) {
			this.clear();
			keys[this.controls.clear] = 0;
		}

		if(this.grounded && keys[this.controls.down]) {
			const {x, y} = this.body.getLinearVelocity();
			const velocity = new Vec2(x, y + this.walkSpeed);

			this.body.setLinearVelocity(velocity);
		}

		// handle movement
		if(keys[this.controls.left] && keys[this.controls.right]) {
			// do nothing
		} else if(keys[this.controls.left]) {
			// go left
			const {x, y} = this.body.getLinearVelocity();
			const velocity = new Vec2(Math.max(x - this.walkSpeed, -this.speedLimit), y);

			this.body.setLinearVelocity(velocity);
			if(!keys[this.controls.hold]) this.facing = "left";
		} else if(keys[this.controls.right]) {
			// go right
			const {x, y} = this.body.getLinearVelocity();
			const velocity = new Vec2(Math.min(x + this.walkSpeed, this.speedLimit), y);

			this.body.setLinearVelocity(velocity);
			if(!keys[this.controls.hold]) this.facing = "right";
		} else if(this.grounded) {
			// apply artificial friction
			const {x, y} = this.body.getLinearVelocity();
			const velocity = new Vec2(x * 0.8, y);

			this.body.setLinearVelocity(velocity);
		}

		// drag force
		const {x: _, y: vDown} = this.body.getLinearVelocity();
		const {x: xPosition, y: yPosition} = this.body.getPosition();

		this.body.applyForce(Vec2(0, -vDown), Vec2(xPosition, yPosition));

		// calculate the damage
		let damage = 0;

		for(const intersector of gameManager.intersectors) {
			// check for intersection
			const {x, y, size} = intersector;
			damage += this.getOverlap(x, y, size, size);
		}
		
		this.shaking = damage / 160;
		this.hp -= damage;
		if(this.hp < 0) this.hp = 0;


		// screen wrap
		const {x: boxX, y: boxY} = this.body.getPosition();
		const [xBound, yBound] = [
			screenWidth + this.width, 
			screenHeight + this.height
		];
		const [xOffset, yOffset] = [this.width / 2, this.height / 2];

		const [xPos, yPos] = [
			((boxX * SCALE + xBound + xOffset) % xBound - xOffset) / SCALE, 
			((boxY * SCALE + yBound + yOffset) % yBound - yOffset) / SCALE
		];

		this.body.setPosition(Vec2(xPos, yPos));

		[this.x, this.y] = [xPos, yPos].map(coord => coord * SCALE);
	}

	draw() {
		push();


		fill(...(this.hp > 0 ? this.rgb : [160]));
		stroke(...(this.hp > 0 ? this.rgb : [160]));
		strokeWeight(5);
		
		// draw the body
		rect(this.x, this.y, this.width, this.height);

		noStroke();

		const offset = {left: -5, right: 5}[this.facing];

		// draw the eyes
		for(const s of [-1, 1]) {
			fill(0);
			const x = this.x + s * 30 + offset + rand(-this.shaking, this.shaking);
			const y = this.y + rand(-this.shaking, this.shaking);
			ellipse(x, y, 15, 15);

			fill(255);
			ellipse(x - 2, y - 2, 4, 4);
			ellipse(x - 1, y + 1, 2, 2);
			ellipse(x + 1, y, 2, 2);
		}

		// draw the mouth
		fill(0);

		if(this.shaking > 0) {
			ellipse(this.x + offset + rand(-this.shaking, this.shaking), this.y + 10 + rand(-this.shaking, this.shaking), 20, 20);
		} else if(this.grounded) {
			rect(this.x + offset, this.y + 10, 20, 4);
		} else if(this.leftWalled || this.rightWalled) {
			ellipse(this.x + offset, this.y + 10, 10, 10);
		} else {
			arc(this.x + offset, this.y + 10, 20, 20, 0, PI);
		}

		pop();
	}

	jump() {
		if(this.grounded) {
			const velocity = new Vec2(this.body.getLinearVelocity().x, -this.jumpPower);
			this.body.setLinearVelocity(velocity);

			testSound1.setVolume(0.05);
			testSound1.play();
		} else if(this.leftWalled) {
			const velocity = new Vec2(3, -this.jumpPower);
			this.body.setLinearVelocity(velocity);
			if(!keys[this.controls.hold]) this.facing = "right";

			testSound3.setVolume(0.05);
			testSound3.play();
		} else if(this.rightWalled) {
			const velocity = new Vec2(-3, -this.jumpPower);
			this.body.setLinearVelocity(velocity);
			if(!keys[this.controls.hold]) this.facing = "left";

			testSound3.setVolume(0.05);
			testSound3.play();
		}
	}

	// gives the number of pixels currently overlapping the player
	getOverlap(x, y, width, height) {
		const w = min(this.x + this.width / 2, x + width / 2) 
				- max(this.x - this.width / 2, x - width / 2);
		const h = min(this.y + this.height / 2, y + height / 2) 
				- max(this.y - this.height / 2, y - height / 2);
		
		return w > 0 && h > 0 ? w * h : 0;
	}

	layPlatform() {
		if(this.platforms.size < this.platformLimit) {
			const {x: xVelocity, y: yVelocity} = this.body.getLinearVelocity();
			const offset = {left: -1, right: 1}[this.facing] * 125;
			const platform = new Platform(this.x + offset, this.y + yVelocity * 20, 100, 10, this.rgb, this);
			
			testSound2.setVolume(0.05);
			testSound2.play();

			return platform;
		}
	}

	layVertPlatform() {
		if(this.platforms.size < this.platformLimit) {
			const {x: xVelocity, y: yVelocity} = this.body.getLinearVelocity();
			const offset = {left: -1, right: 1}[this.facing] * 85;
			const platform = new Platform(this.x + offset, this.y + yVelocity * 20, 10, 100, this.rgb, this);
			return platform;
		}
	}

	dash() {
		let [x, y] = [0, 0];
		const power = 5;

		if(keys[this.controls.left]) x = -1;
		if(keys[this.controls.right]) x = 1;
		if(keys[this.controls.up]) y = -1;
		if(keys[this.controls.down]) y = 1;

		this.body.setLinearVelocity(Vec2(x * power, y * power));
	}

	clear() {
		// clear all the platforms
		for(const platform of this.platforms) {
			platform.delete();
		}
	}

	reset() {
		this.maxHp = 50000;
		this.hp = this.maxHp;
		this.jumpPower = 3.5;
		this.walkSpeed = 0.75;
		this.speedLimit = 2;
		
		this.grounded = false;
		this.floorContacts.clear();
		this.leftWalled = false;
		this.leftContacts.clear();
		this.rightWalled = false;
		this.rightContacts.clear();

		for(const platform of this.platforms) {
			platform.delete();
		}

		this.platformLimit = 3;

		this.body.setPosition(Vec2(this.spawnX / SCALE, 150 / SCALE));
		this.body.setLinearVelocity(Vec2(0, 0));
	}
}