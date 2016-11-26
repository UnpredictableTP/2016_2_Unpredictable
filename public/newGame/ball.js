'use strict';

import THREELib from "three-js";
var THREE = THREELib(); // return THREE JS

export default class Ball {

	constructor({x = 0, y = 0, z = 0, vx = 0, vy = 0, vz = 0, r = 0, color = '#FF4500'}) {
		this.x = x;
		this.y = y;
		this.z = z;

		this.vx = vx;
		this.vy = vy;
		this.vz = vz;

		this.r = r;
		this.color = color;
	}

	draw(scene) {
		this.object = new THREE.SphereGeometry(this.r, 32, 32);
		this.objectmesh = new THREE.Mesh(this.object, new THREE.MeshPhongMaterial({color: this.color}));
		this.objectmesh.position.set(this.x, this.y, this.z);
		scene.add(this.objectmesh);
	}

	removeFromScene(scene) {
		scene.remove(this.objectmesh);
	}

	getPosition() {
		return {
			x: this.x,
			y: this.y,
			z: this.z
		}
	}

	setCamera(camera) {
		camera.lookAt(new THREE.Vector3(this.x, this.y, this.z));
	}

	update(dt) {
		this.x += (this.vx / 100 * dt) | 0;
		this.z += (this.vz / 100 * dt) | 0;
		this.objectmesh.position.set(this.x, this.y, this.z);
		//console.log({x: this.x, y: this.y, z: this.z});
	}

	changeSpeed(Sin, Cos){
		this.vx = -1 * ((80 * Sin) | 0);
		this.vz = -1 * ((80 * Cos) | 0);
		console.log(this.vx, this.vz);
	}

	dvzIncrease() {
		if (this.vz <= 100) {
			this.vz += 6;
			this.objectmesh.rotation.z = 10;

		}
	}

	dvzDecrease() {
		if (this.vz >= -100) {
			this.vz -= 6;
			this.objectmesh.rotation.z = -10;
		}
	}

	dvxIncrease() {
		console.log('lolol');
		if (this.vx <= 100) {
			this.vx += 6;
			this.objectmesh.rotation.x = 10;
		}
		console.log(this.vx);
	}

	dvxDecrease() {
		if (this.vx >= -100) {
			this.vx -= 6;
			this.objectmesh.rotation.x = 10;
		}
	}

	decreaseAll() {
		if (this.vz !== 0) {
			if (0 < this.vz && this.vz <= 100) {
				this.vz -= 1;
			} else if (0 > this.vz && this.vz >= -100) {
				this.vz += 1;
			}
		}
		if (this.vx !== 0) {
			if (0 < this.vx && this.vx <= 100) {
				this.vx -= 1;
			} else if (0 > this.vx && this.vx >= -100) {
				this.vx += 1;
			}
		}
	}


}


