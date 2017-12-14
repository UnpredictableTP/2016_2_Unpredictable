'use strict';

import THREELib from "three-js";
import Ball from "./ball";
import Camera from "./camera";
import KeyMaster from "./keymaster";
import Light from "./light";
import Socket from "../models/Socket";
import pointerLock from "./pointerLock"
var THREE = THREELib(); // return THREE JS

export default class DGame {
	constructor({width, height}) {
		console.log("DGame constructor");
		this.width = width;
		this.height = height;

		this.key = new KeyMaster();

		this.players = [];
		this.dots = [];

		this.rendrer = new THREE.WebGLRenderer({canvas: document.querySelector('.js-canvas'), antialias: true});
		this.rendrer.setSize(this.width, this.height);
	}

	initSocket(element, goBack, reGo, hidePreload){
		console.log("DGame initSocket");
        this.socket = new Socket();
        this.socket.init({
        	animate : this.animate.bind(this),
        	addBall : this.addBall.bind(this),
        	removeBall : this.removeBall.bind(this),
			init: this.init.bind(this),
			animateCamera: this.animateCamera.bind(this),
	        hidePreload: hidePreload,
			element: element
        });
		this.goBack = goBack;
		this.rego = reGo;
	}

	init(element, content, id) {
		console.log("DGame init");
		console.log(content);
		this.id = id;
		element.appendChild(this.rendrer.domElement);

		this.key.init();

		this.i = 0;

		this.isExit = false;

		this.scene = new THREE.Scene();

		this.players = [];
		this.dots = [];
		this.r = 40;
		for(let i = 0; i < content.players.length; ++i){
            let body = content.players[i].playerSquare.partSnaps[0].body;
            console.log(body);
            if(this.id === content.players[i].userId) {
            	this.players[i] = new Ball({x: body.x, y: 0, z: body.y, r: content.players[i].playerSquare.partSnaps[0].radius, color: 'blue'});
            }else{
            	this.players[i] = new Ball({x: body.x, y: 0, z: body.y, r: content.players[i].playerSquare.partSnaps[0].radius, color: 'blue'});
       		 }
            if(this.id === content.players[i].userId) {
	            this.position = i;
	            this.camera = new Camera({x: body.x, y: 100, z: body.y + 300});
                this.camera.setCamera(this.width, this.height);
                this.players[i].setCamera(this.camera.getCamera());
                this.light = new Light({x: body.x + 0, y: 150, z: 100 + body.y});
            }
            this.players[i].draw(this.scene);
		}

		for(let j = 0; j < content.gameStatics.length; j++){
			this.dots[j] = new Ball({x: content.gameStatics[j].coords.x, y: 0, z: content.gameStatics[j].coords.y,
				r: content.gameStatics[j].radius, color: 'green'});
            this.dots[j].draw(this.scene);
        }

        this.pointerLock = new pointerLock(this.rendrer, this.camera,  this.removeList.bind(this), this.goBack, this.rego,
			this.stopAnimation.bind(this), this.animateCamera.bind(this));

        this.grid = new THREE.GridHelper(2000, 50, 'grey', 'grey');
		this.scene.add(this.grid);

		this.Sin = 0;
		this.Cos = 0;

		this.light.setLight(this.scene);

		let calcSpeed = this.calcSpeed.bind(this);
		document.addEventListener('mouseup', calcSpeed, false);
		this.rendrer.setClearColor('#F5F5F5');
		this.date = Date.now;
	}

	initPointerLock(){
		this.pointerLock.destroyGameOver();
	}

	addBall(content, id){
		let body;
		let index;
		for(let i = 0; content.players.length; ++i){
			if(content.players[i].userId === id){
				body = content.players[i].playerSquare.partSnaps[0].body;
				index = i;
				break;
			}
		}
		this.players[content.players.length-1] = new Ball({x: body.x, y: 0, z: body.y, r: content.players[index].playerSquare.partSnaps[0].radius, color: 'blue'});
        this.players[content.players.length-1].draw(this.scene);
	}

	removeBall(content, id){
		for(let i = 0; content.players.length; ++i){
				this.players.splice(i, 1);
				break;
		}
	}

	animate(content) {
		console.log(this.players);
		for(let i =0, j= 0; i < content.players.length; ++i, ++j){
            let body = content.players[i].playerSquare.partSnaps[0].body;
            if(content.players[i].playerSquare.partSnaps[0].touch !== 0){
                this.redraw(j, content);
            } else {
                this.players[j].updateCoor({x: body.x, z: body.y});
            }

        	if(!content.players[i].exist){
        		console.log(content.players[i]);
        		this.players[j].removeFromScene(this.scene);
        		this.players.splice(j,1);
        			--j;
        		if(this.position!==0){
        			this.position--;
        		}
        		if(this.id === content.players[i].userId && this.isExit === false){
        			debugger;
        			this.pointerLock.gameOver(this.setNullScene.bind(this));
        		}
        		continue;
            }
            if(this.id === this.players[j].userId) {
                this.players[j].setCamera(this.camera.getCamera());
            }
        }
		this.renderer();
	}

	removeList() {
		console.log("DGame renderer");
		document.removeEventListener('click', this.calcSpeed);
		this.added = false;
	}

	animateCamera(){
		console.log("DGame animateCamera");
        let doAnimate = () => {
            this.condition = this.pointerLock.getLocked();
            if (this.condition.locked) {
                let localdate = Date.now();
                this.doKeys(localdate - this.date);
                let coordinates = this.camera.getPosition();
                console.log(this.players);
                console.log(this.position);
                let ballCoordinates = this.players[this.position].getPosition();
                let newCoor = {
                    x: (coordinates.x + ballCoordinates.x) | 0,
                    y: coordinates.y + ballCoordinates.y,
                    z: (coordinates.z + ballCoordinates.z)| 0
                };
                this.camera.changePosition(newCoor);
                this.players[this.position].setCamera(this.camera.getCamera());
                this.light.changePosition(newCoor);
                this.renderer();
                this.date = localdate;
            }
	        this.animation = requestAnimationFrame(doAnimate);
        };
        doAnimate();
	}

	calcSpeed(event) {
	}

	calcSinCos() {
		console.log("DGame calcSinCos");
		let coordinates = this.camera.getPosition();
		let sum = Math.sqrt(coordinates.z ** 2 + coordinates.x ** 2);
		this.Sin = coordinates.x / sum;
		this.Cos = coordinates.z / sum;
	}

	doKeys(time) {
		if (this.key.is('w') || this.key.is('ц')) {
			this.calcSinCos();
			this.socket.prepareMessage({
				sin: this.Sin,
				cos: this.Cos,
				button: 'w',
				time: time
			});
			this.socket.send();
		}
		if (this.key.is('s') || this.key.is('ы')) {
			this.calcSinCos();
            this.socket.prepareMessage({
                sin: this.Sin,
                cos: this.Cos,
                button: 's',
                time: time
            });
            this.socket.send();
		}
		if (this.key.is('a') || this.key.is('ф')) {
			this.calcSinCos();
            this.socket.prepareMessage({
                sin: this.Sin,
                cos: this.Cos,
                button: 'a',
                time: time
            });
            this.socket.send();
		}
		if (this.key.is('d') || this.key.is('в')) {
            this.calcSinCos();
            this.socket.prepareMessage({
                sin: this.Sin,
                cos: this.Cos,
                button: 'd',
                time: time
            });
            this.socket.send();
		}
		if (this.key.is(' ')) {
            this.socket.prepareMessage({
                sin: this.Sin,
                cos: this.Cos,
                button: 'space',
                time: time
            });
            this.socket.send();
		}
		// let coordinates = this.camera.getPosition();
		// let ballCoordinates = this.players[this.id].getPosition();
		// let newCoor = {
		// 	x: coordinates.x + ballCoordinates.x,
		// 	y: coordinates.y + ballCoordinates.y,
		// 	z: coordinates.z + ballCoordinates.z
		// };
		// this.camera.changePosition(newCoor);
		// this.light.changePosition(newCoor);

	}

	checkR() {
		// let i;
		// let check = this.dots[this.i].getR().r;
		// for (i = 0; i < this.dots.length - 1; ++i) {
		// 	let checkColor = this.dots[i].getColor();
		// 	if (this.dots[i].getR().r < check && checkColor === 'red') {
		// 		this.dots[i].redraw(this.scene, 'green');
		// 	} else if (this.dots[i].getR().r > check && checkColor === 'green') {
		// 		this.dots[i].redraw(this.scene, 'red');
		// 	}
		// }
	}

	redraw(i, content){
		this.players[i].removeFromScene(this.scene);
        let body = content.players[i].playerSquare.partSnaps[0].body;
        this.players[i] = new Ball({x: body.x, y: 0, z: body.y, r: content.players[i].playerSquare.partSnaps[0].radius, color: 'blue'});
        if(this.id === content.players[i].userId) {
            this.players[i].setCamera(this.camera.getCamera());
        }
        this.players[i].draw(this.scene);
	}

	setNullScene() {
		for(let i = 0 ; i < 19; ++i){
			this.dots[i].removeFromScene(this.scene);
		}
		this.scene = null;
		this.camera = null;
		this.light = null;
		this.divCont.removeChild(this.scoreLable);
	}

	stopAnimation() {
		console.log("DGame stopAnimation");
		cancelAnimationFrame(this.animation);
	}

	finishConnection(){
		this.isExit = true;
		console.log("DGame finishConnection");
		this.socket.prepareMessageCloseSocket();
		this.socket.send();
	}

	renderer() {
		this.rendrer.render(this.scene, this.camera.getCamera());
	}

}
