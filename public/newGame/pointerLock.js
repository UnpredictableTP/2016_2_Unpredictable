'use strict';

import Button from '../components/button/button';

export default class pointerLock{
	constructor(rendrer, camera){
		this.lockChangeAlert = this.lockChangeAlert.bind(this);
		this.oldPosition = 0;
		this.locked = false;
		this.canCalcSpeed = false;
		this.camera = camera;
		this.canvas = rendrer.domElement;
		// this.setPauseMenu();
		this.canvas.requestPointerLock = this.canvas.requestPointerLock || this.canvas.mozRequestPointerLock;
		document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
		this.canvas.onclick = () => {
			this.canvas.requestPointerLock();
		};
		document.addEventListener('pointerlockchange', this.lockChangeAlert, false);
		document.addEventListener('mozpointerlockchange', this.lockChangeAlert, false);
	}

	lockChangeAlert() {
		if (document.pointerLockElement === this.canvas ||
			document.mozPointerLockElement === this.canvas) {
			console.log('The pointer lock status is now locked');
			this.updatePosition = this.updatePosition.bind(this);
			document.addEventListener("mousemove", this.updatePosition, false);
			this.locked = true;
		} else {
			document.removeEventListener("mousemove", this.updatePosition, false);
			console.log('The pointer lock status is now unlocked');
			this.locked = false;
			this.canCalcSpeed = false;
		}
	}

	getLocked(){
		return {
			locked: this.locked,
			canCalcSpeed: this.canCalcSpeed
		}
	}

	setConditionCalc(){
		this.canCalcSpeed = true;
	}

	updatePosition(mousePosition) {
		let coordinates = this.camera.getPosition();
		let d = mousePosition.movementX - this.oldPosition;
		this.camera.countCircle(d);
	}

	setPauseMenu(){
		this.contButton = new Button('Continue', {});
		console.log(this.contButton);
		this.canvas.appendChild(this.contButton._get());
	}

}