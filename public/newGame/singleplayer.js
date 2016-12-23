'use strict';

import THREELib from "three-js";
import Ball from "./ball";
import Camera from "./camera";
import KeyMaster from "./keymaster";
import Light from "./light";
import pointerLock from "./pointerLock"
import Block from "../components/block/block"
let THREE = THREELib(); // return THREE JS

export default class DGame {
	constructor({width, height}) {
		this.width = width;
		this.height = height;

		this.key = new KeyMaster();

		this.dots = [];

		this.rendrer = new THREE.WebGLRenderer({canvas: document.querySelector('.js-canvas'), antialias: true});
		this.rendrer.setSize(this.width, this.height);
		this.score = 0;
	}


	init(element, goBack, reGo) {
		this.divCont = document.querySelector('.js-play');
		this.scoreDiv = new Block('div', {});
		this.scoreLable = this.scoreDiv._get();
		this.scoreLable.classList.add('js-button1');

		element.appendChild(this.rendrer.domElement);
		this.key.init();

		this.camera = new Camera({x: 0, y: 100, z: 300});
		this.camera.setCamera(this.width, this.height);

		this.pointerLock = new pointerLock(this.rendrer, this.camera, this.removeList.bind(this), goBack, reGo);

		this.scene = new THREE.Scene();

		this.dots = [];
		this.r = 20;
		this.plural = 1;
		this.factor = 0.2;
		this.player = new Ball({x: 100, y: 0, z: 100, r: this.r, color: 'blue'});
		this.player.setCamera(this.camera.getCamera());
		this.player.draw(this.scene);
		this.fillField();

		this.grid = new THREE.GridHelper(1000, 50, 'grey', 'grey');
		this.scene.add(this.grid);
		this.grid.position.set(0, 0, 0);

		this.Sin = 0;
		this.Cos = 0;

		this.light = new Light({x: 0, y: 150, z: 100});
		this.light.setLight(this.scene);

		this.calcSpeed = this.calcSpeed.bind(this);
		this.added = false;
		this.rendrer.setClearColor('#F5F5F5');
	}

	animate() {
		let date = Date.now();
		let doAnimate = () => {
			this.condition = this.pointerLock.getLocked();
			if (this.condition.locked) {
				if (!this.added) {
					document.addEventListener('click', this.calcSpeed);
					this.added = true;
				}
				let localdate = Date.now();
				this.doKeys();
				this.player.update(localdate - date);
				this.player.checkReact('reflect');
				this.dots.push(this.player);
				for (let j = 0; j < this.dots.length; ++j) {
					this.dots[j].update(localdate - date);
					this.dots[j].checkReact('reflect');
					let checkDotR = this.dots[j].getR();
					let checkDotCoor = this.dots[j].getPosition();
					this.checkReactEach({j: j, checkDotCoor: checkDotCoor, checkDotR: checkDotR});
				}
				this.player = this.dots[this.dots.length - 1];
				this.dots.pop();
				this.player.decreaseAll();
				this.player.setCamera(this.camera.getCamera());
				this.player.decreaseR(this.scene);
				this.checkR();
				this.renderer();
				this.setScore();
				date = localdate;
			}
			this.animation = requestAnimationFrame(doAnimate);
		};
		doAnimate();
	}

	removeList() {
		document.removeEventListener('click', this.calcSpeed);
		this.added = false;
	}

	calcSpeed(event) {
		this.calcSinCos();
		this.player.removeFromScene(this.scene);
		let coor = this.player.getPosition();
		let food = new Ball({x: coor.x, z: coor.z, r: 7, color: 'green'});
		food.draw(this.scene);
		food.changeSpeed(-this.Sin, -this.Cos);
		this.dots.push(food);
		let r = this.player.getR().r - 5;
		if (!this.checkExist(r, -1).bool) {
			this.player = new Ball({x: coor.x, z: coor.z, r: r, color: 'blue'});
			this.player.draw(this.scene);
			this.player.changeSpeed(this.Sin, this.Cos);
		} else {
			this.stopAnimation();
			this.pointerLock.gameOver(this.setNullScene.bind(this));
		}
	}

	calcSinCos() {
		let coordinates = this.camera.getPosition();
		let sum = Math.sqrt(coordinates.z ** 2 + coordinates.x ** 2);
		this.Sin = coordinates.x / sum;
		this.Cos = coordinates.z / sum;
	}

	doKeys() {
		if (this.key.is('w') || this.key.is('ц')) {
			this.calcSinCos();
			this.player.moveForward(this.Sin, this.Cos);
		}
		if (this.key.is('s') || this.key.is('ы')) {
			this.calcSinCos();
			this.player.moveBackward(this.Sin, this.Cos);
		}
		if (this.key.is('a') || this.key.is('ф')) {
			this.calcSinCos();
			this.player.moveLeft(this.Sin, this.Cos);
		}
		if (this.key.is('d') || this.key.is('в')) {
			this.calcSinCos();
			this.player.moveRight(this.Sin, this.Cos);
		}
		if (this.key.is(' ')) {
			this.player.increaseR(this.scene);
		}
		let coordinates = this.camera.getPosition();
		let ballCoordinates = this.player.getPosition();
		let newCoor = {
			x: coordinates.x + ballCoordinates.x,
			y: coordinates.y + ballCoordinates.y,
			z: coordinates.z + ballCoordinates.z
		};
		this.camera.changePosition(newCoor);
		this.light.changePosition(newCoor);

	}

	checkR() {
		let check = this.player.getR().r;
		for (let i = 0; i < this.dots.length; ++i) {
			let checkColor = this.dots[i].getColor();
			if (this.dots[i].getR().r < check && checkColor === 'red') {
				this.dots[i].redraw(this.scene, 'green');
			} else if (this.dots[i].getR().r > check && checkColor === 'green') {
				this.dots[i].redraw(this.scene, 'red');
			}
		}
	}

	checkReactEach({j, checkDotCoor, checkDotR}) {
		for (let k = j + 1; k < this.dots.length; ++k) {
			let newCheckDotR = this.dots[k].getR().r;
			let newCheckDotCoor = this.dots[k].getPosition();
			let Distance = (Math.sqrt((checkDotCoor.x - newCheckDotCoor.x) ** 2 +
					(checkDotCoor.z - newCheckDotCoor.z) ** 2)) | 0;
			let distR = (newCheckDotR + checkDotR.r) | 0;
			if (Distance < distR) {
				this.dots[k].removeFromScene(this.scene);
				this.dots[j].removeFromScene(this.scene);
				let speed = this.dots[j].getSpeed();
				let speed1 = this.dots[k].getSpeed();
				if (newCheckDotR > checkDotR.r) {
					if (k === this.dots.length - 1) {
						if (newCheckDotR > 50) {
							this.plural *= this.factor;
						}
						this.dots[k] = new Ball({
							x: newCheckDotCoor.x | 0, z: newCheckDotCoor.z | 0, vx: speed1.vx, vz: speed1.vz,
							r: newCheckDotR + this.plural, color: 'blue'
						});
						this.score += 1;
						if (newCheckDotR + 1 - this.r > 10) {
							this.camera.increaseRCam();
							this.r += 15;
						}
					} else {
						this.dots[k] = new Ball({
							x: newCheckDotCoor.x | 0, z: newCheckDotCoor.z | 0, vx: speed1.vx, vz: speed1.vz,
							r: newCheckDotR + this.plural
						});
					}
					this.dots[k].draw(this.scene);
					let newk = this.checkExist(checkDotR.r - 1, j).k;
					if (newk === j) {
						this.dots[j] = new Ball({
							x: checkDotCoor.x | 0, z: checkDotCoor.z | 0, vx: speed.vx, vz: speed.vz,
							r: checkDotR.r - 1
						});
						this.dots[j].draw(this.scene);
					}
				} else {
					if (newCheckDotR > 50) {
						this.plural *= this.factor;
					}
					this.dots[j] = new Ball({
						x: checkDotCoor.x | 0, z: checkDotCoor.z | 0, vx: speed.vx, vz: speed.vz,
						r: checkDotR.r + this.plural
					});
					this.dots[j].draw(this.scene);
					let newk = this.checkExist(newCheckDotR - 1, k);
					if (k === newk.k) {
						if (k === this.dots.length - 1) {
							this.dots[k] = new Ball({
								x: newCheckDotCoor.x | 0, z: newCheckDotCoor.z | 0, vx: speed1.vx, vz: speed1.vz,
								r: newCheckDotR - 1, color: 'blue'
							});
							this.score -= 1;
							if (this.r - newCheckDotR - 1 > 10 && this.r !== 20) {
								this.camera.decreaseRCam();
								this.r -= 15;
							}
						} else if (newk.bool) {
							this.stopAnimation();
							this.pointerLock.gameOver(this.setNullScene.bind(this));
						} else {
							this.dots[k] = new Ball({
								x: newCheckDotCoor.x | 0, z: newCheckDotCoor.z | 0, vx: speed1.vx, vz: speed1.vz,
								r: newCheckDotR - 1
							});
						}
						if(!newk.bool) {
							this.dots[k].draw(this.scene);
						}
					}
				}
				if (this.dots.length < 20) {
					this.addOneMore();
				}
			}
		}
	}

	checkExist(R, k) {
		let boolResult = false;
		if (R < 5) {
			if (k == -1) {
				boolResult = true;
			}
			if (k === this.dots.length - 1) {
				this.dots.pop();
				boolResult = true;
			} else {
				for (let m = k; m < this.dots.length - 1; ++m) {
					this.dots[m] = this.dots[m + 1]
				}
				--this.dots.length;
				--k;
			}
		}
		return {
			k: k,
			bool: boolResult
		};
	}

	renderer() {
		this.rendrer.render(this.scene, this.camera.getCamera());
	}

	setScore() {
		this.scoreLable.innerHTML = 'Score: ' + this.score;
		this.divCont.appendChild(this.scoreLable);
	}

	fillField() {
		for (let i = 0; i < 20; ++i) {
			let randsphere = new Ball({
				x: this.random(-1000, 1000), y: 0, z: this.random(-1000, 1000),
				vx: this.random(-30, 30), vz: this.random(-30, 30), r: this.random(10, 100)
			});
			randsphere.draw(this.scene);
			this.dots.push(randsphere);
		}
	}

	addOneMore() {
		let buffer = this.dots.pop();
		let randsphere = new Ball({
			x: this.random(-1000, 1000), y: 0, z: this.random(-1000, 1000),
			vx: this.random(-30, 30), vz: this.random(-30, 30), r: this.random(10, 70)
		});
		randsphere.draw(this.scene);
		this.dots.push(randsphere);
		this.dots.push(buffer);
	}

	setNullScene() {
		for(let i = 0 ; i < 19; ++i){
			this.dots[i].removeFromScene(this.scene);
		}
		this.scene = null;
		this.camera = null;
		this.light = null;
		this.divCont.removeChild(this.scoreLable);
	}

	stopAnimation() {
		cancelAnimationFrame(this.animation);
	}

	random(min, max) {
		return Math.random() * (max - min) + min;
	}

}
