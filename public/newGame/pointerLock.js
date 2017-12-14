'use strict';

import Block from '../components/block/block';

export default class pointerLock{
	constructor(rendrer, camera, removeList, goBack, reGo, stopAnimation, animate){
		console.log("pointerLock constructor");
		this.lockChangeAlert = this.lockChangeAlert.bind(this);
		this.oldPosition = 0;
		this.locked = false;
		this.camera = camera;
		this.canvas = rendrer.domElement;
		this.removeList = removeList;
		this.goBack = goBack;
		this.reGo = reGo;
		this.stopAnimation = stopAnimation;
		this.animate = animate;
		this.first = true;
		this.notPause = false;
		this.backActive = false;
		this.contButton = new Block('div', {});
		this.continue = this.contButton._get();
		this.exitButton = new Block('div', {});
		this.exit = this.exitButton._get();
		this.back = new Block('div', {});
		this.isgameover = false;

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
		console.log("pointerLock lockChangeAlert");
		if (document.pointerLockElement === this.continue ||
			document.mozPointerLockElement === this.continue) {
			console.log('The pointer lock status is now locked');
			this.continue.removeEventListener('click', this.destroy);
			this.updatePosition = this.updatePosition.bind(this);
			document.addEventListener("mousemove", this.updatePosition, false);
		} else {
			this.removeList();
			if(!this.notPause){
				this.continue.addEventListener('click', this.destroy);
				this.setPauseMenu();
			}
			this.exit.addEventListener('click', this.goBack);
			document.removeEventListener("mousemove", this.updatePosition, false);
			console.log('The pointer lock status is now unlocked');
			this.locked = false;
		}
	}

	getLocked(){
		return {
			locked: this.locked,
		}
	}

	updatePosition(mousePosition) {
		console.log("pointerLock updatePosition");
		let coordinates = this.camera.getPosition();
		let d = mousePosition.movementX - this.oldPosition;
		this.camera.countCircle(d);
	}

	setPauseMenu(){
		console.log("pointerLock setPauseMenu");
		this.divCont = document.querySelector('.js-play');
		if(!this.first) {
			debugger;
			this.continue.classList.add('button');
			this.continue.classList.add('js-button2');
			this.continue.innerHTML = 'Continue';
			this.exit.classList.add('button');
			this.exit.classList.add('js-button1');
			this.exit.innerHTML = 'Exit';
			this.back._get().classList.add('gamebackground');
			this.divCont.appendChild(this.back._get());
			this.backActive = true;
			this.stopAnimation();
		} else {
			this.continue.classList.add('button');
			this.continue.classList.add('js-button2');
			this.continue.innerHTML = 'Click to start playing';
			this.first = false;
		}
		this.divCont.appendChild(this.canvas);
		this.divCont.appendChild(this.continue);
		this.divCont.appendChild(this.exit);
	}
	



	destroy(){
		console.log("pointerLock destroy");
		this.animate();
		this.locked = true;
		this.continue.removeEventListener('click', this.destroy);
		this.continue.innerHTML = '';
		this.continue.classList.remove('button');
		this.continue.classList.remove('js-button2');
		this.exit.removeEventListener('click', this.goBack);
		this.exit.innerHTML = '';
		this.exit.classList.remove('button');
		this.exit.classList.remove('js-button1');
		if(this.backActive) {
			this.back._get().classList.remove('gamebackground');
			this.divCont.removeChild(this.back._get());
			this.backActive = false;
		}
		this.continue.requestPointerLock();
	}

	destroyGameOver(){
		console.log("pointerLock destroy");
		this.locked = true;
		this.animate();
		this.continue.removeEventListener('click', this.destroy);
		this.continue.innerHTML = '';
		this.continue.classList.remove('button');
		this.continue.classList.remove('js-button2');
		this.exit.removeEventListener('click', this.goBack);
		this.exit.innerHTML = '';
		this.exit.classList.remove('button');
		this.exit.classList.remove('js-button1');


		debugger;
		// console.log('hello---------------------------------------------------------------------------------------------------------------------------');
		if(this.isgameover === true){
			this.gameover._get().innerHTML = '';
			this.gameover._get().classList.remove('gameover');
			this.restart._get().innerHTML = '';
			this.restart._get().classList.remove('restart');
			this.back._get().classList.remove('gamebackground');
			this.divCont.removeChild(this.gameover._get());
			this.divCont.removeChild(this.restart._get());
			this.isgameover = false
		}

		if(this.backActive) {
			this.back._get().classList.remove('gamebackground');
			this.divCont.removeChild(this.back._get());
			this.backActive = false;
		}
		// this.continue.requestPointerLock();
		this.locked = false;
		window.hell = false;

		// document.addEventListener('pointerlockchange', this.lockChangeAlert, false);
		// document.addEventListener('mozpointerlockchange', this.lockChangeAlert, false);
	}

	gameOver(setNullScene){
		console.log("pointerLock gameOver");
		document.exitPointerLock();
		this.notPause = true;
		this.removeList();
		this.setNullScene = setNullScene;
		let tryOneMore = this.tryOneMore.bind(this);
		this.continue.addEventListener('click', tryOneMore);
		this.continue.innerHTML = "Try again";
		this.continue.classList.add('button');
		this.continue.classList.add('js-button2');
		this.exit.classList.add('button');
		this.exit.classList.add('js-button1');
		this.exit.innerHTML = 'Exit';
		document.removeEventListener("mousemove", this.updatePosition, false);
		this.gameover = new Block('div', {});
		this.gameover._get().innerHTML = "Game Over.";
		this.gameover._get().classList.add('gameover');
		this.restart = new Block('div', {});
		this.restart._get().innerHTML = "Would you like to try again?";
		this.restart._get().classList.add('restart');
		this.back = new Block('div', {});
		this.back._get().classList.add('gamebackground');
		this.backActive = false;
		this.isgameover = true;
		this.divCont.appendChild(this.back._get());
		this.divCont.appendChild(this.gameover._get());
		this.divCont.appendChild(this.restart._get());
		this.divCont.appendChild(this.continue);
		this.divCont.appendChild(this.exit);
	}

	tryOneMore() {
		console.log("pointerLock tryOneMore");
		this.continue.removeEventListener('click', this.tryOneMore);
		this.continue.innerHTML = '';
		this.continue.classList.remove('button');
		this.continue.classList.remove('js-button2');
		this.exit.removeEventListener('click', this.goBack);
		this.exit.innerHTML = '';
		this.exit.classList.remove('button');
		this.exit.classList.remove('js-button1');
		this.back._get().classList.remove('gamebackground');
		this.divCont.removeChild(this.restart._get());
		this.divCont.removeChild(this.gameover._get());
		this.divCont.removeChild(this.back._get());
		this.setNullScene();
		this.reGo();
	}
}