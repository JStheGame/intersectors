class Intersector {
	constructor(parent, xOffset, yOffset) {
		this.xOffset = xOffset;
		this.yOffset = yOffset;
		this.parent = parent;
		this.x = 0;
		this.y = 0;
		const size = 40 - Math.max(Math.abs(xOffset), Math.abs(yOffset)) / 4;
		this.size = Math.floor(size);
	}

	update() {
		this.x = this.parent.x + (this.xOffset + 70) * {left: -1, right: 1}[this.parent.facing];
		this.y = this.parent.y + this.yOffset;
	}

	draw() {
		push();
		fill(...this.parent.rgb, 144);
		noStroke();
		rect(this.x, this.y, this.size, this.size);
		pop();
	}
}
