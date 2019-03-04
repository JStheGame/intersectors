function drawHeart(x, y, size, rgb = [255]) {
	const r2 = Math.sqrt(2);
	const r = size;

	push();
	fill(...rgb);
	noStroke();

	beginShape();
	vertex(x - r, y - r);
	vertex(x + r, y - r);
	vertex(x + r + r2 * r / 2, y - r + r2 * r / 2);
	vertex(x, y + r2 * r);
	vertex(x - r - r2 * r / 2, y - r + r2 * r / 2);
	endShape(CLOSE);

	ellipse(x - r, y - r, 2 * r, 2 * r);
	ellipse(x + r, y - r, 2 * r, 2 * r);

	pop();
}

class HUD {
	constructor(x, parent) {
		this.x = x;
		this.parent = parent;
	}

	draw() {
		// draw the heads up display
 		drawHeart(this.x - 10, 52, 6 + (this.parent.hp < 10000 ? sin(frameCount / 2) : 0));

		const barWidth = 128;
		
		// hp bar fill
		const barFilled = this.parent.hp / this.parent.maxHp * barWidth;
		
		noStroke();
		
		fill(0, 100);
		rect(this.x + 145 - barWidth / 2, 50, barWidth, 20);
		
		fill(...this.parent.rgb);
		rect(this.x + 145 - barWidth + barFilled / 2, 50, barFilled, 20);

		// hp bar outline
		stroke(255);
		strokeWeight(5);
		noFill();

		rect(this.x + 145 - barWidth / 2, 50, barWidth, 20);

		for(let i = 0; i < this.parent.platformLimit; i++) {
			if(i < this.parent.platformLimit - this.parent.platforms.size) fill(...this.parent.rgb);
			else fill(0, 100);

			stroke(255);
			strokeWeight(5);
			rect(this.x + i * 60, 80, 50, 20);
		}
	}
}