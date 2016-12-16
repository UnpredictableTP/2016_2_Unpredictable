'use strict';

import THREELib from 'three-js';
import KeyMaster from '../newGame/keymaster';

const THREE = THREELib(); // return THREE JS

export default class Socket {
	constructor() {
		this.socket = new WebSocket('wss://warm-fortress-86891.herokuapp.com/game');
		this.Message = {
			type: 'ru.mail.park.mechanics.requests.JoinGame$Request',
			content: "{}",
		};
		this.answer = {};
	}

	init(animate) {
		this.animate = animate;
		this.workOpen();
		this.workMessage();
		this.workClose();
	}

	workOpen() {
		this.socket.onopen = (event) => {
			console.log('socket open');
			this.send();
		};
	}

	send(){
		this.socket.send(JSON.stringify(this.Message));
	}

	workMessage(event) {
		this.socket.onmessage = function (event) {
			console.log('socket answer');
			this.animate(event.message);
		};
	}

	workClose(event) {
		this.socket.onerror = function (event) {

		};
	}
}
