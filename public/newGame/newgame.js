'use strict';

import THREELib from "three-js";
import Ball from "./ball";
import Camera from "./camera";
import KeyMaster from "./keymaster";
import Light from "./light";
// import Socket from "../models/socketModel";
import pointerLock from "./pointerLock"
var THREE = THREELib(); // return THREE JS

export default class DGame {
	constructor() {
		this.width = 1200;
		this.height = 800;

		/*this.socket = new Socket();
		 this.key
		 this.socket.init(this.key);
		 */
		this.players = [];
		this.dots = [];

		this.key = new KeyMaster();
		this.key.init();

		this.rendrer = new THREE.WebGLRenderer({antialias: true});
		this.rendrer.setSize(this.width, this.height);

	}


	init(element) {
		element.appendChild(this.rendrer.domElement);

		this.camera = new Camera({x: 0, y: 150, z: 300});
		this.camera.setCamera(this.width, this.height);

		this.pointerLock = new pointerLock(this.rendrer, this.camera);

		this.scene = new THREE.Scene();

		this.players = [];
		this.dots = [];
		let sphere = new Ball({x: 100, y: 0, z: 100, r: 40, color: 'blue'});
		sphere.setCamera(this.camera.getCamera());
		sphere.draw(this.scene);

		let randsphere = new Ball({x: 50, y: 0, z: 100, r: 50, color: 'red'});
		randsphere.draw(this.scene);
		this.dots.push(randsphere);
		let randsphere1 = new Ball({x: 150, y: 0, z: 10, r: 10, color: 'red'});
		randsphere1.draw(this.scene);
		this.dots.push(randsphere1);
		let randsphere2 = new Ball({x: 300, y: 0, z: 150, r: 70, color: 'red'});
		randsphere2.draw(this.scene);
		this.dots.push(randsphere2);
		this.dots.push(sphere);

		this.light = new Light({x: 0, y: 150, z: 100});
		this.light.setLight(this.scene);

		let calcSpeed = this.calcSpeed.bind(this);
		document.addEventListener('mouseup', calcSpeed, false);
		this.rendrer.setClearColor('grey');
	}

	// cicle() {
	// 	let array = [];
	// 	let count = 0;
	// 	let angle = 0;
	// 	for (angle = 0; angle <= 0.1; angle += 0.001) {
	// 		let obj = {};
	// 		obj.x = 150 * Math.cos(angle * 180 / Math.PI);
	// 		obj.z = 150 * Math.sin(angle * 180 / Math.PI);
	// 		console.log(obj);
	// 		array[count] = obj;
	// 		++count;
	// 	}
	// 	let pred = count;
	// 	count = 0;
	// 	let doAnimate = () => {
	// 		if (count === pred) {
	// 			count = 0;
	// 		}
	// 		this.camera.position.y = array[count].x;
	// 		this.camera.position.z = array[count].z;
	// 		++count;
	// 		console.log(this.camera.position);
	// 		this.light.lookAt(this.floormesh.position);
	// 		this.renderer();
	// 		requestAnimationFrame(doAnimate);
	// 	};
	// 	doAnimate();
	// }

	animate() {
		let date = Date.now();
		let doAnimate = () => {
			let localdate = Date.now();
			// console.log(this.dots[3].r);
			// let r = this.dots[3].r -  1;
			// console.log(r);
			// this.dots[3].removeFromScene(this.scene);
			// this.dots[3] = new Ball({x: 75, y: 0, z: 75, r: r, color: 'blue'});
			// this.dots[3].setCamera(this.camera.getCamera());
			// this.dots[3].draw(this.scene);
			this.doKeys();
			this.dots[3].decreaseAll();
			this.dots[3].update(localdate - date);
			console.log(this.camera.getPosition());
			this.dots[3].setCamera(this.camera.getCamera());
			this.renderer();
			date = localdate;
			requestAnimationFrame(doAnimate);
		};
		doAnimate();
	}

	calcSpeed(event){
		let coordinates = this.camera.getPosition();
		let sum = Math.sqrt(coordinates.z ** 2 + coordinates.x ** 2);
		let Sin = coordinates.x / sum;
		let Cos = coordinates.z / sum;
		console.log(Sin, Cos);
		this.dots[3].changeSpeed(Sin, Cos);
	}

	doKeys() {
		if (this.key.is('w') || this.key.is('ц')) {
			this.dots[3].dvzDecrease();
		}
		if (this.key.is('s') || this.key.is('ы')) {
			this.dots[3].dvzIncrease();
		}
		if (this.key.is('a') || this.key.is('ф')) {
			this.dots[3].dvxDecrease();
		}
		if (this.key.is('d') || this.key.is('в')) {
			this.dots[3].dvxIncrease();
		}
		let coordinates = this.camera.getPosition();
		let ballCoordinates = this.dots[3].getPosition();
		let newCoor = {
			x: coordinates.x + ballCoordinates.x,
			y: coordinates.y + ballCoordinates.y,
			z: coordinates.z + ballCoordinates.z
		};
		this.camera.changePosition(newCoor);
		this.light.changePosition(newCoor);
	}

	checkR() {
		let i;
		for (i = 0; i < this.dots.length; ++i) {

		}
	}

	renderer() {
		this.rendrer.render(this.scene, this.camera.getCamera());
	}

}

