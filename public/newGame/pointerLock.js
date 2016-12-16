'use strict';


import DGame from './singleplayer';

export default class pointerLock{
	constructor(rendrer, camera){
		this.lockChangeAlert = this.lockChangeAlert.bind(this);
		this.oldPosition = 0;
		this.locked = false;
		this.canCalcSpeed = false;
		this.camera = camera;

		this.canvas = rendrer.domElement;
		this.pauseMenu();
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
			this.pauseMenu();
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

	pauseMenu(){
		this.ctx = this.canvas.getContext('3d');
		console.log(this.canvas);
		this.ctx.fillText("LOLOLOLOL", 10, 10);
	}
}