'use strict';

import THREELib from "three-js";
var THREE = THREELib(); // return THREE JS

export default class Light{
	constructor({x = 0, y = 0, z = 0}){
		this.x = x;
		this.y = y;
		this.z = z;
	}

	setLight(scene) {
		this.light = new THREE.PointLight(0xffffff, 5, 1500);
		this.light.position.set(this.x, this.y, this.z);
		scene.add(this.light);
	}

	changePosition({x, y, z}){
		this.light.position.set(x, y ,z);
		this.light.lookAt(new THREE.Vector3(x, y, z));
	}
}
