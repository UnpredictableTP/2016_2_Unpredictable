'use strict';

import THREELib from "three-js";
var THREE = THREELib(); // return THREE JS

export default class Camera {

	constructor({x = 0, y = 0, z = 0, rCam = 50}) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.rCam = rCam;
		this.changeX = -2;
		this.changeZ = -2;
	}

	setCamera(width, height) {
		this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 5000);
		this.camera.position.set(this.x, this.y, this.z);
		this.camera.rotation.x = 90 * Math.PI / 180;
	}

	getCamera() {
		return this.camera;
	}

	changePosition({x, y, z}) {
		this.camera.position.set(x, y, z);
	}

	getPosition() {
		return {
			x: this.x,
			y: this.y,
			z: this.z
		}
	}

	countCircle(d) {
		if (this.x >= 400 || this.x <= -400) {
			this.changeX *= -1;
		}
		if (this.z >= 400 || this.z <= -400) {
			this.changeZ *= -1;
		}
		this.x += this.changeX * d;
		this.z += this.changeZ * d;
		if (this.x >= 400) {
			this.x = 400;
		} else if (this.x <= -400) {
			this.x = -400;
		}
		if (this.z >= 400) {
			this.z = 400;
		} else if (this.z <= -400) {
			this.z = -400;
		}
	}
}
