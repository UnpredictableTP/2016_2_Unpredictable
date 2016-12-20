'use strict';

import THREELib from 'three-js';
import KeyMaster from '../newGame/keymaster';

const THREE = THREELib(); // return THREE JS

export default class Socket {
	constructor() {
		//wss://guarded-oasis-31621.herokuapp.com/game
		this.socket = new WebSocket('wss://guarded-oasis-31621.herokuapp.com/game');
		this.Message = {
			type: 'ru.mail.park.mechanics.requests.JoinGame$Request',
			content: "{}",
		};
		this.answer = {};
	}

	init({animate, init, element, animateCamera}) {
		this.animate = animate;
		this.gameinit = init;
		this.element = element;
		this.animateCamera = animateCamera;
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
		this.socket.onmessage = (event) => {
			// console.log('socket answer', event);
			let data = JSON.parse(event.data);
            let content = JSON.parse(data.content);
			if(data.type === "ru.mail.park.mechanics.base.ServerSnap"){
				this.animate(content);
			}
			if(data.type === "ru.mail.park.mechanics.requests.InitGame$Request"){
                this.gameinit(this.element, content, content.self - 1);
                this.animateCamera();
			}
		};
	}

	workClose(event) {
		this.socket.onerror = function (event) {

		};
	}

	prepareMessage({sin, cos, button, time}){
        let clientSnapMessage = {
        	sincos : {
        		sin: sin,
				cos: cos
			},
			button: button,
			frameTime: time
		};
		this.Message = {
        	type : "ru.mail.park.mechanics.base.ClientSnap",
        	content : JSON.stringify(clientSnapMessage)
		};
	}
}
