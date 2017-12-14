'use strict';

import THREELib from "three-js";
import Ball from "./ball";
import Camera from "./camera";
import KeyMaster from "./keymaster";
import Light from "./light";
import Socket from "../models/Socket";
import pointerLock from "./pointerLock"
var THREE = THREELib(); // return THREE JS

export default class DGame {
	constructor() {
		console.log("XDGame constructor");
		this.width = 1200;
		this.height = 800;

		//this.socket = new Socket();
		this.key = new KeyMaster();
		//this.socket.init(this.key);

		this.players = [];
		this.dots = [];

		this.key.init();

		this.rendrer = new THREE.WebGLRenderer({antialias: true});
		this.rendrer.setSize(this.width, this.height);

	}


	init(element) {
		console.log("XDGame init");
		element.appendChild(this.rendrer.domElement);

		this.camera = new Camera({x: 0, y: 200, z: 300});
		this.camera.setCamera(this.width, this.height);

		this.canChange = true;
		this.pointerLock = new pointerLock(this.rendrer, this.camera);
		this.i = 0;

		this.scene = new THREE.Scene();

		this.players = [];
		this.dots = [];
		this.r = 40;
		let sphere = new Ball({x: 100, y: 0, z: 100, r: this.r, color: 'blue'});
		sphere.setCamera(this.camera.getCamera());
		sphere.draw(this.scene);

		let randsphere = new Ball({x: 50, y: 0, z: 100, r: 50, color: 'red'});
		randsphere.draw(this.scene);
		this.dots.push(randsphere);
		let randsphere1 = new Ball({x: 150, y: 0, z: 10, r: 10, color: 'green'});
		randsphere1.draw(this.scene);
		this.dots.push(randsphere1);
		let randsphere2 = new Ball({x: 300, y: 0, z: 150, r: 70, color: 'red'});
		randsphere2.draw(this.scene);
		this.dots.push(randsphere2);
		this.dots.push(sphere);
		this.dots[3].changeOpacity();

		this.grid = new THREE.GridHelper(1000, 50, 'grey', 'grey');
		this.scene.add(this.grid);

		this.scene.add(this.shape);
		this.Sin = 0;
		this.Cos = 0;
		this.food = [];
		this.i = 3;

		this.light = new Light({x: 0, y: 150, z: 100});
		this.light.setLight(this.scene);

		let calcSpeed = this.calcSpeed.bind(this);
		document.addEventListener('mouseup', calcSpeed, false);
		this.rendrer.setClearColor('#F5F5F5');
	}

	animate() {
		console.log("XDGame animate");
		let date = Date.now();
		let doAnimate = () => {
			let localdate = Date.now();
			this.doKeys();
			this.dots[this.i].update(localdate - date);
			for (let j = 0; j < this.food.length; ++j) {
				this.dots[this.food[j]].update(localdate - date);
				this.dots[this.food[j]].decreaseAll();
			}
			if (this.food.length > 0) {
				let v = this.dots[this.food[0]].getSpeed();
				if (v.vx <= 0 && v.vz <= 0) {
					this.food.shift()
				}
			}
			this.dots[this.i].decreaseAll();
				this.dots[this.i].setCamera(this.camera.getCamera());
			this.dots[this.i].decreaseR(this.scene);
			this.checkR();
			this.renderer();
			date = localdate;
			requestAnimationFrame(doAnimate);
		};
		doAnimate();
	}

	calcSpeed(event) {
		console.log("XDGame calcSpeed");
		this.calcSinCos();
		this.dots[this.i].removeFromScene(this.scene);
		let coor = this.dots[this.i].getPosition();
		this.dots.pop();
		let food = new Ball({x: coor.x, z: coor.z, r: 7, color: 'green'});
		food.draw(this.scene);
		this.dots.push(food);
		this.food.push(this.i);
		this.dots[this.i].changeSpeed(-this.Sin, -this.Cos);
		++this.i;
		this.r -= 3;
		let sphere = new Ball({x: coor.x, z: coor.z, r: this.r, color: 'blue'});
		sphere.draw(this.scene);
		this.dots.push(sphere);
		this.dots[this.i].changeSpeed(this.Sin, this.Cos);
		this.dots[this.i].changeOpacity();
	}

	calcSinCos() {
		console.log("XDGame calcSinCos");
		let coordinates = this.camera.getPosition();
		let sum = Math.sqrt(coordinates.z ** 2 + coordinates.x ** 2);
		this.Sin = coordinates.x / sum;
		this.Cos = coordinates.z / sum;
	}

	doKeys() {
		console.log("XDGame DoKeys");
		if (this.key.is('w') || this.key.is('ц')) {
			this.calcSinCos();
			this.dots[this.i].moveForward(this.Sin, this.Cos);
		}
		if (this.key.is('s') || this.key.is('ы')) {
			this.calcSinCos();
			this.dots[this.i].moveBackward(this.Sin, this.Cos);
		}
		if (this.key.is('a') || this.key.is('ф')) {
			this.calcSinCos();
			this.dots[this.i].moveLeft(this.Sin, this.Cos);
		}
		if (this.key.is('d') || this.key.is('в')) {
			this.calcSinCos();
			this.dots[this.i].moveRight(this.Sin, this.Cos);
		}
		if (this.key.is(' ')) {
			this.dots[this.i].increaseR(this.scene);
		}
		let coordinates = this.camera.getPosition();
		let ballCoordinates = this.dots[this.i].getPosition();
		let newCoor = {
			x: coordinates.x + ballCoordinates.x,
			y: coordinates.y + ballCoordinates.y,
			z: coordinates.z + ballCoordinates.z
		};
		this.camera.changePosition(newCoor);
		this.light.changePosition(newCoor);

	}


	checkR() {
		console.log("XDGame CheckR");
		let i;
		let check = this.dots[this.i].getR().r;
		for (i = 0; i < this.dots.length - 1; ++i) {
			let checkColor = this.dots[i].getColor();
			if (this.dots[i].getR().r < check && checkColor === 'red') {
				this.dots[i].redraw(this.scene, 'green');
			} else if (this.dots[i].getR().r > check && checkColor === 'green') {
				this.dots[i].redraw(this.scene, 'red');
			}
		}
	}

	renderer() {
		this.rendrer.render(this.scene, this.camera.getCamera());
	}

}

