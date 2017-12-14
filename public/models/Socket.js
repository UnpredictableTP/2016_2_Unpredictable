'use strict';

import THREELib from 'three-js';
import KeyMaster from '../newGame/keymaster';

const THREE = THREELib(); // return THREE JS

export default class Socket {
	constructor() {
		console.log("Socket constructor");
		//wss://guarded-oasis-31621.herokuapp.com/game
		this.socket = new WebSocket('ws://localhost:8080/game');
		this.Message = {
			type: 'ru.mail.park.mechanics.requests.JoinGame$Request',
			content: "{}",
		};
		this.answer = {};
	}

	init({animate, init, element, animateCamera, hidePreload, addBall}) {
		console.log("Socket init");
		this.animate = animate;
		this.gameinit = init;
		this.element = element;
		this.animateCamera = animateCamera;
		this.hidePreload = hidePreload;
		this.addBall = addBall;
		this.workOpen();
		this.workMessage();
		this.workClose();
	}

	workOpen() {
		console.log("Socket workOpen");
		this.socket.onopen = (event) => {
			this.send();
		};
	}

	send(){
		console.log("Socket send");
		this.socket.send(JSON.stringify(this.Message));
	}

	workMessage(event) {
		console.log("Socket workMessage");
		this.socket.onmessage = (event) => {
			// console.log('socket answer', event);
			let data = JSON.parse(event.data);
            let content = JSON.parse(data.content);
            console.log(data.type);
            console.log(content);
			if(data.type === "ru.mail.park.mechanics.base.ServerSnap"){
				console.log("ServerSanp");
				this.animate(content);
			}
			if(data.type === "ru.mail.park.mechanics.requests.InitGame$Request"){
				console.log("InitGameRequest");
				this.hidePreload();
                this.gameinit(this.element, content, content.self);
                this.animateCamera();
			}
			if(data.type === "ru.mail.park.mechanics.requests.InitJoinGame$Request"){
				console.log("InitJoinGame OLOLOOLOLOLOLO")
				this.addBall(content, content.self);
				this.animate(content);
			}
		};
	}

	workClose(event) {
		console.log("Socket workClose");
		this.socket.onerror = function (event) {

		};
	}

	prepareMessageCloseSocket(){
		this.Message = {
			type: "ru.mail.park.mechanics.requests.CloseGame",
			content: "{}"
		}
	}

	prepareMessage({sin, cos, button, time}){
		console.log("Socket prepareMessage");
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
