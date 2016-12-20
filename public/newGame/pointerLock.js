'use strict';

import Block from '../components/block/block';

export default class pointerLock{
	constructor(rendrer, camera, removeList, goBack){
		this.lockChangeAlert = this.lockChangeAlert.bind(this);
		this.oldPosition = 0;
		this.locked = false;
		this.canCalcSpeed = false;
		this.camera = camera;
		this.canvas = rendrer.domElement;
		this.removeList = removeList;
		this.goBack = goBack;
		this.contButton = new Block('div', {});
		this.continue = this.contButton._get();
		this.exitButton = new Block('div', {});
		this.exit = this.exitButton._get();
		this.setPauseMenu();

		this.continue.requestPointerLock = this.continue.requestPointerLock || this.canvas.mozRequestPointerLock;
		document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
		this.destroy = this.destroy.bind(this);
		this.continue.addEventListener('click', this.destroy);
		this.exit.addEventListener('click', this.goBack);
		document.addEventListener('pointerlockchange', this.lockChangeAlert, false);
		document.addEventListener('mozpointerlockchange', this.lockChangeAlert, false);
	}

	lockChangeAlert() {
		if (document.pointerLockElement === this.continue ||
			document.mozPointerLockElement === this.continue) {
			console.log('The pointer lock status is now locked');
			this.continue.removeEventListener('click', this.destroy);
			this.updatePosition = this.updatePosition.bind(this);
			document.addEventListener("mousemove", this.updatePosition, false);
		} else {
			this.removeList();
			this.continue.addEventListener('click', this.destroy);
			this.exit.addEventListener('click', this.goBack);
			document.removeEventListener("mousemove", this.updatePosition, false);
			console.log('The pointer lock status is now unlocked');
			this.locked = false;
			this.canCalcSpeed = false;
			this.setPauseMenu();
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
		let divCont = document.querySelector('.js-play');
		this.continue.classList.add('button');
		this.continue.classList.add('js-button1');
		this.continue.innerHTML = 'Continue';
		this.exit.classList.add('button');
		this.exit.classList.add('js-button2');
		this.exit.innerHTML = 'Exit';

		divCont.appendChild(this.canvas);
		divCont.appendChild(this.continue);
		divCont.appendChild(this.exit);
	}

	destroy(){
		this.locked = true;
		this.continue.removeEventListener('click', this.destroy);
		this.continue.innerHTML = '';
		this.continue.classList.remove('button');
		this.continue.classList.remove('js-button1');
		this.exit.removeEventListener('click', this.goBack);
		this.exit.innerHTML = '';
		this.exit.classList.remove('button');
		this.exit.classList.remove('js-button1');

		this.continue.requestPointerLock();
	}
}