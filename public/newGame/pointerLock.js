'use strict';

export default class pointerLock{
	constructor(rendrer, camera){
		this.lockChangeAlert = this.lockChangeAlert.bind(this);
		this.oldPosition = 0;
		this.camera = camera;

		this.canvas = rendrer.domElement;
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
		} else {
			document.removeEventListener("mousemove", this.updatePosition, false);
		}
	}

	updatePosition(mousePosition) {
		let coordinates = this.camera.getPosition();
		let d = mousePosition.movementX - this.oldPosition;
		console.log(d);
		this.camera.countCircle(d);
	}
}