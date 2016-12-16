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
		this.width = 1200;
		this.height = 800;

		this.socket = new Socket();
		this.key = new KeyMaster();

		this.players = [];
		this.dots = [];

		this.key.init();

		this.rendrer = new THREE.WebGLRenderer({antialias: true});
		this.rendrer.setSize(this.width, this.height);
	}


	init(element) {
		this.socket.init(this.key, this.animate());
		element.appendChild(this.rendrer.domElement);

		this.camera = new Camera({x: 0, y: 200, z: 300});
		this.camera.setCamera(this.width, this.height);

		this.pointerLock = new pointerLock(this.rendrer, this.camera);
		this.i = 0;

		this.scene = new THREE.Scene();

		this.players = [];
		this.dots = [];
		this.r = 40;
		this.sphere = new Ball({x: 100, y: 0, z: 100, r: this.r, color: 'blue'});
		this.sphere.setCamera(this.camera.getCamera());
		this.sphere.draw(this.scene);

		this.grid = new THREE.GridHelper(2000, 50, 'grey', 'grey');
		this.scene.add(this.grid);

		this.Sin = 0;
		this.Cos = 0;

		this.light = new Light({x: 0, y: 150, z: 100});
		this.light.setLight(this.scene);

		let calcSpeed = this.calcSpeed.bind(this);
		document.addEventListener('mouseup', calcSpeed, false);
		this.rendrer.setClearColor('#F5F5F5');
		this.date = Date.now;
	}

	animate(message) {
		debugger;
		let localdate = Date.now();
		this.doKeys();
		this.sphere.update(localdate - this.date);
		this.sphere.decreaseAll();
		this.sphere.setCamera(this.camera.getCamera());
		this.sphere.decreaseR(this.scene);
		this.checkR();
		this.renderer();
		//this.socket.send();
		this.date = localdate;
	}

	calcSpeed(event) {
		// this.calcSinCos();
		// this.dots[this.i].removeFromScene(this.scene);
		// let coor = this.dots[this.i].getPosition();
		// this.dots.pop();
		// let food = new Ball({x: coor.x, z: coor.z, r: 7, color: 'green'});
		// food.draw(this.scene);
		// this.dots.push(food);
		// this.food.push(this.i);
		// this.dots[this.i].changeSpeed(-this.Sin, -this.Cos);
		// ++this.i;
		// this.r -= 3;
		// let sphere = new Ball({x: coor.x, z: coor.z, r: this.r, color: 'blue'});
		// sphere.draw(this.scene);
		// this.dots.push(sphere);
		// this.dots[this.i].changeSpeed(this.Sin, this.Cos);
		// this.dots[this.i].changeOpacity();
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
			this.sphere.moveForward(this.Sin, this.Cos);
		}
		if (this.key.is('s') || this.key.is('ы')) {
			this.calcSinCos();
			this.sphere.moveBackward(this.Sin, this.Cos);
		}
		if (this.key.is('a') || this.key.is('ф')) {
			this.calcSinCos();
			this.sphere.moveLeft(this.Sin, this.Cos);
		}
		if (this.key.is('d') || this.key.is('в')) {
			this.calcSinCos();
			this.sphere.moveRight(this.Sin, this.Cos);
		}
		if (this.key.is(' ')) {
			this.sphere.increaseR(this.scene);
		}
		let coordinates = this.camera.getPosition();
		let ballCoordinates = this.sphere.getPosition();
		let newCoor = {
			x: coordinates.x + ballCoordinates.x,
			y: coordinates.y + ballCoordinates.y,
			z: coordinates.z + ballCoordinates.z
		};
		this.camera.changePosition(newCoor);
		this.light.changePosition(newCoor);

	}

	checkR() {
		// let i;
		// let check = this.dots[this.i].getR().r;
		// for (i = 0; i < this.dots.length - 1; ++i) {
		// 	let checkColor = this.dots[i].getColor();
		// 	if (this.dots[i].getR().r < check && checkColor === 'red') {
		// 		this.dots[i].redraw(this.scene, 'green');
		// 	} else if (this.dots[i].getR().r > check && checkColor === 'green') {
		// 		this.dots[i].redraw(this.scene, 'red');
		// 	}
		// }
	}

	renderer() {
		this.rendrer.render(this.scene, this.camera.getCamera());
	}

}
