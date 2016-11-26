'use strict';

import Ball from '../game/ball';
import KeyMaster from '../game/keymaster';

export default class Game {
	constructor(params) {
		this.ctx = params.ctx;
		this.width = params.width;
		this.height = params.height;

		this.key = new KeyMaster();
		this.key.init();

		this.ball1 = new Ball({x: 100, y: 100, r: 30, color: 'blue'});
		this.ball2 = new Ball({x: 200, y: 200, r: 40});
		this.ball3 = new Ball({x: 400, y: 500, r: 20});
		this.ball4 = new Ball({x: 300, y: 300, r: 26});
		this.ball5 = new Ball({x: 200, y: 300, r: 16});
		this.ball6 = new Ball({x: 100, y: 450, r: 50});
		this.ball7 = new Ball({x: 100, y: 300, r: 40});
		this.ball8 = new Ball({x: 300, y: 400, r: 23});

		this.balls = {
			ball1: this.ball1,
			ball2: this.ball2,
			ball3: this.ball3,
			ball4: this.ball4,
			ball5: this.ball5,
			ball6: this.ball6,
			ball7: this.ball7,
			ball8: this.ball8,
		};
	}

	start() {
		for (const ball in this.balls) {
			this.balls[ball].draw(this.ctx);
		}
		this.balls.ball1.dv({vx: 0, vy: 0});
		this.balls.ball2.dv({vx: 0.1, vy: -0.1});
		this.balls.ball3.dv({vx: -0.1, vy: -0.1});
		this.balls.ball4.dv({vx: -0.1, vy: 0.1});
		this.balls.ball5.dv({vx: -0.1, vy: -0.1});
		this.balls.ball6.dv({vx: -0.1, vy: 0.1});
		this.balls.ball7.dv({vx: 0.1, vy: 0.1});
		this.balls.ball8.dv({vx: -0.1, vy: 0.1});
		this.animate();
	}

	animate() {
		let date = Date.now();
		const doAnimate = () => {
			const localDate = Date.now();
			this.clear();

			for (let ball in this.balls) {
				this.balls[ball].update(localDate - date);
				this.balls[ball].draw(this.ctx);
				this.balls[ball].checkRectBorder({
					width: this.width,
					height: this.height
				}, 'reflect');
			}
			this.checkRectEach();
			this.doKeys();
			date = localDate;

			requestAnimationFrame(doAnimate);
		};

		doAnimate();
	}

	// checkRectEach() {
	// 	let checked = [];
	// 	for (let currentBall in this.balls) {
	// 		let current = this.balls[currentBall];
	// 		for (let ball in this.balls) {
	// 			if (ball !== currentBall) {
	// 				let each = this.balls[ball];
	// 				let distancexy = (Math.sqrt((current.x - each.x) * (current.x - each.x) +
	// 						(current.y - each.y) * (current.y - each.y))) | 0;
	// 				let distancer = current.r + each.r;
	// 				if (distancer > distancexy) {
	// 					let already = false;
	// 					checked.forEach(function (balls, i, checked) {
	// 						if (balls === '' + ball + currentBall || balls === '' + currentBall + ball) {
	// 							already = true;
	// 						}
	// 					});
	// 					if (!already) {
	// 						this.balls[currentBall].reflect({x: true, y: true});
	// 						this.balls[ball].reflect({x: true, y: true});
	// 						checked.push('' + ball + currentBall);
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// };

	checkRectEach() {
		for (const ball in this.balls) {
			if (ball !== this.balls.ball1) {
				const coordinates = this.balls[ball].getCoordinates();
				let deleted = false;
				if (this.balls.ball1.countDistanceXY(coordinates)) {
					if (this.balls.ball1.compareR(coordinates)) {
						this.balls.ball1.increaseR();
						this.balls[ball].reduceR();
					} else {
						this.balls.ball1.reduceR();
						this.balls[ball].increaseR();
					}
					if (this.balls[ball].checkMinR()) {
						delete this.balls[ball];
						deleted = true;
					}
				}
				if (this.balls.ball1.compareR(coordinates) && !deleted) {
					this.balls[ball].changeColor('green');
				} else if (!this.balls.ball1.compareR(coordinates) && !deleted) {
					this.balls[ball].changeColor('red');
				}
			}
		}
	}

	doKeys() {
		if (this.key.is('w')) {
			this.ball1.dvy(-0.1);
		}
		if (this.key.is('s')) {
			this.ball1.dvy(0.1);
		}
		if (this.key.is('a')) {
			this.ball1.dvx(-0.1);
		}
		if (this.key.is('d')) {
			this.ball1.dvx(0.1);
		}
	}

	clear() {
		this.ctx.clearRect(0, 0, this.width, this.height);
	}
}
