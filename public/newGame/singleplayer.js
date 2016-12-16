'use strict';

import THREELib from "three-js";
import Ball from "./ball";
import Camera from "./camera";
import KeyMaster from "./keymaster";
import Light from "./light";
import pointerLock from "./pointerLock"
let THREE = THREELib(); // return THREE JS

export default class DGame {
	constructor() {
		this.width = 1200;
		this.height = 800;

		this.key = new KeyMaster();

		this.dots = [];

		this.rendrer = new THREE.WebGLRenderer({antialias: true});
		this.rendrer.setSize(this.width, this.height);
	}


	init(element) {
		element.appendChild(this.rendrer.domElement);
		this.key.init();

		this.camera = new Camera({x: 0, y: 100, z: 150});
		this.camera.setCamera(this.width, this.height);

		this.pointerLock = new pointerLock(this.rendrer, this.camera);

		this.scene = new THREE.Scene();

		this.dots = [];
		this.r = 20;
		this.plural = 1;
		this.factor = 0.2;
		this.player = new Ball({x: 100, y: 0, z: 100, r: this.r, color: 'blue'});
		this.player.setCamera(this.camera.getCamera());
		this.player.draw(this.scene);

		let randsphere = new Ball({x: 50, y: 0, z: 100, vx: 20, vz: 15, r: 25, color: 'red'});
		randsphere.draw(this.scene);
		this.dots.push(randsphere);
		let randsphere1 = new Ball({x: 150, y: 0, z: 10, r: 10, vx: 25, vz: -15, color: 'green'});
		randsphere1.draw(this.scene);
		this.dots.push(randsphere1);
		let randsphere2 = new Ball({x: 300, y: 0, z: 150, vx: -15, vz: -20, r: 12, color: 'green'});
		randsphere2.draw(this.scene);
		this.dots.push(randsphere2);
		let randsphere3 = new Ball({x: -300, y: 0, z: 150, vx: -25, vz: -20, r: 17, color: 'green'});
		randsphere3.draw(this.scene);
		this.dots.push(randsphere3);
		let randsphere4 = new Ball({x: 300, y: 0, z: -150, vx: -30, vz: -12, r: 13, color: 'green'});
		randsphere4.draw(this.scene);
		this.dots.push(randsphere4);
		let randsphere5 = new Ball({x: 300, y: 0, z: -150, vx: -15, vz: 15, r: 17, color: 'green'});
		randsphere5.draw(this.scene);
		this.dots.push(randsphere5);
		let randsphere6 = new Ball({x: 300, y: 0, z: -150, vx: 10, vz: -15, r: 30, color: 'red'});
		randsphere6.draw(this.scene);
		this.dots.push(randsphere6);
		let randsphere7 = new Ball({x: 350, y: 0, z: -450, vx: 20, vz: -15, r: 15, color: 'green'});
		randsphere7.draw(this.scene);
		this.dots.push(randsphere7);
		let randsphere8 = new Ball({x: -300, y: 0, z: -150, vx: 30, vz: -15, r: 30, color: 'red'});
		randsphere8.draw(this.scene);
		this.dots.push(randsphere8);

		this.grid = new THREE.GridHelper(1000, 50, 'grey', 'grey');
		this.scene.add(this.grid);
		this.grid.position.set(0, 0, 0);

		this.Sin = 0;
		this.Cos = 0;

		this.light = new Light({x: 0, y: 150, z: 100});
		this.light.setLight(this.scene);

		let calcSpeed = this.calcSpeed.bind(this);
		document.addEventListener('mouseup', calcSpeed, false);
		this.rendrer.setClearColor('#F5F5F5');
	}

	animate() {
		let date = Date.now();
		let doAnimate = () => {
			this.condition = this.pointerLock.getLocked();
			if (this.condition.locked) {
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
				this.player = this.dots[this.dots.length -1];
				this.dots.pop();
				this.player.decreaseAll();
				this.player.setCamera(this.camera.getCamera());
				this.player.decreaseR(this.scene);
				this.checkR();
				this.renderer();
				date = localdate;
			}
			requestAnimationFrame(doAnimate);
		};
		doAnimate();
	}

	calcSpeed(event) {
		if (this.condition.canCalcSpeed) {
			this.calcSinCos();
			this.player.removeFromScene(this.scene);
			let coor = this.player.getPosition();
			let food = new Ball({x: coor.x, z: coor.z, r: 7, color: 'green'});
			food.draw(this.scene);
			food.changeSpeed(-this.Sin, -this.Cos);
			this.dots.push(food);
			let r = this.player.getR().r - 5;
			if(!this.checkExist(r, -1).delete) {
				this.player = new Ball({x: coor.x, z: coor.z, r: r, color: 'blue'});
				this.player.draw(this.scene);
				this.player.changeSpeed(this.Sin, this.Cos);
			} else {
				console.log('Game over');
			}
		} else {
			this.pointerLock.setConditionCalc();
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
						if(newCheckDotR > 50){
							this.plural *= this.factor;
						}
						this.dots[k] = new Ball({
							x: newCheckDotCoor.x | 0, z: newCheckDotCoor.z | 0, vx: speed1.vx, vz: speed1.vz,
							r: newCheckDotR + this.plural, color: 'blue'
						});
						if(newCheckDotR + 1 - this.r > 10){
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
					if(newCheckDotR > 50){
						this.plural *= this.factor;
					}
					this.dots[j] = new Ball({
						x: checkDotCoor.x | 0, z: checkDotCoor.z | 0, vx: speed.vx, vz: speed.vz,
						r: checkDotR.r + this.plural
					});
					this.dots[j].draw(this.scene);
					let newk = this.checkExist(newCheckDotR - 1, k).k;
					if(k === newk) {
						if (k === this.dots.length - 1) {
							this.dots[k] = new Ball({
								x: newCheckDotCoor.x | 0, z: newCheckDotCoor.z | 0, vx: speed1.vx, vz: speed1.vz,
								r: newCheckDotR - 1, color: 'blue'
							});
							if(this.r - newCheckDotR - 1 > 10 && this.r !== 20){
								this.camera.decreaseRCam();
								this.r -= 10;
							}
						} else {
							this.dots[k] = new Ball({
								x: newCheckDotCoor.x | 0, z: newCheckDotCoor.z | 0, vx: speed1.vx, vz: speed1.vz,
								r: newCheckDotR - 1
							});
						}
						this.dots[k].draw(this.scene);
					}
				}
			}
		}
	}

	checkExist(R, k){
		if(R < 5){
			if(k == -1){
				return { delete: true};
			}
			if(k === this.dots.length - 1){
				this.dots.pop();
			} else {
				for (let m = k; m < this.dots.length - 1; ++m) {
					this.dots[m] = this.dots[m + 1]
				}
				--this.dots.length;
				--k;
			}
		}
		return { k: k};
	}

	renderer() {
		this.rendrer.render(this.scene, this.camera.getCamera());
	}

}
