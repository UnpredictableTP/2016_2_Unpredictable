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

	init(animate, init) {
		this.animate = animate;
		this.gameinit = init;
		this.workOpen();
		this.workMessage();
		this.workClose();
	}

	workOpen() {
		this.socket.onopen = (event) => {
			this.send();
		};
	}

	send(){
		this.socket.send(JSON.stringify(this.Message));
	}

	workMessage(event) {
		this.socket.onmessage = function (event) {
			console.log('socket answer', event);
			let data = JSON.parse(event.data);
			if(data.type === "ru.mail.park.mechanics.base.ServerSnap"){
				this.animate(JSON.parse(data.content));
			}
			if(data.type === "ru.mail.park.mechanics.requests.InitGame$Request"){
				this.gameinit(JSON.parse(data.content));
			}
		};
	}

	workClose(event) {
		this.socket.onerror = function (event) {

		};
	}
}
