'use strict';

import Ball from '../background/ball';
import '../background/background.scss';

export default class Background {

	/**
	 * Конструктор класса
	 */
	constructor({ctx, width, height}) {
		this.ctx = ctx;
		this.width = width;
		this.height = height;

		this.balls = [];
		for (let i = 0; i < 30; i++) {
			this.balls[i] = new Ball({width, height});
		}
	}

	setSize(width, height) {
		this.width = width;
		this.height = height;
	}

	/**
	 * Начало новой игры
	 */


	start() {
		// this.ball.draw(this.ctx);
		this._stopped = false;
		this.balls.forEach(ball => {
			ball.draw(this.ctx);
			ball.dv({vx: (this.getRandom(-0.02, 0.02)), vy: (this.getRandom(-0.02, 0.02))});
		});

		this.move();
	}

	isStopped() {
		return this._stopped;
	}

	/**
	 * Начинаем движение
	 */
	move() {
		let time;
		const exec = this.exec.bind(this);
		const self = this;

		let step = () => {
			const now = Date.now();
			const dt = now - (time || now);
			time = now;

			if (!self.isStopped()) {
				this.animation = requestAnimationFrame(step);
			}

			exec(dt);
		};

		step();
	}

	clear() {
		this.ctx.clearRect(0, 0, this.width, this.height);
	}

	/**
	 * Обрабатываем текущий момент
	 * @param  {number} dt
	 */
	exec(dt) {
		this.clear();

		this.balls.forEach(ball => {
			ball.update(dt);
			ball.checkRectangleIntersection({
				width: this.width,
				height: this.height
			}, 'reflect');

			this.checkBalls();

			ball.draw(this.ctx);
		});
	}

	checkBalls() {
		const result = {};
		this.count = 1;
		this.balls.forEach(ball => {
			let ballinfo = ball.getInfo();
			for(let i = this.count; i < this.balls.length; ++i){
				let bufferinfo = this.balls[i].getInfo();
				if (((ballinfo.x | 0) !== (bufferinfo.x | 0)) && ((ballinfo.y | 0) !== (bufferinfo.y | 0))) {
					if (((Math.sqrt((bufferinfo.x - ballinfo.x) ** 2 +
							(bufferinfo.y - ballinfo.y) ** 2)) | 0) < bufferinfo.r + ballinfo.r) {
						result.x = true;
					}
				}
				this.balls[i].reflect(result);
				result.x = false;
			}
			++this.count;
		});
	}

	stop(){
		this._stopped = true;
	}

	getRandom(min, max) {
		return ((Math.random() * (max - min)) + min);
	}

	stopAnimation(){
		cancelAnimationFrame(this.animation);
	}
}
