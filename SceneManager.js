class SceneManager {
	constructor() {
		this.stack = [];
		this.length = 0;
	}

	update() {
		if(this.stack.length) this.stack[this.stack.length - 1].update();
	}

	draw() {
		for(const scene of this.stack) scene.draw();
	}

	add(scene) {
		this.stack.push(scene);
	}

	remove() {
		this.stack.pop();
		// probably also take care of destroying physics bodies, etc
		// reset the world
	}

	replace(scene) {
		while(this.stack.length) this.stack.pop();
		this.stack.push(scene);

		//console.log(this.stack);
	}
}