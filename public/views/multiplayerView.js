'use strict';

import View from '../modules/view';
import DGame from '../newGame/multiplayer';
import Preloader from '../components/preloader';


export default class SinglePlayView extends View {
	constructor(tag, user) {
		console.log("multiplayerView constructor");
		super('js-play, js-background');
		let size = user.backgroundView.getSize();
		this.game = new DGame(size);
		this.user = user;
	}

	init(options = {}) {
		console.log("multiplayerView init");
		// this.game.initSocket(this.getElement(), this.goBack.bind(this), this.rego.bind(this), this.hidePreload.bind(this));
	}

	resume(){
		console.log("multiplayerView resume");
		this.game.initSocket(this.getElement(), this.goBack.bind(this), this.rego.bind(this), this.hidePreload.bind(this));

		const preloader = document.getElementById('preload');
		this.preload = new Preloader();
		this.preload.init(preloader);
		this.user.backgroundView.pause();
		this.show();
	}

	hidePreload(){
		console.log("multiplayerView hidePreload");
		setTimeout(() => {
			console.log('lololol');
			this.preload.setHide(preloader);
		}, 2000);
	}

	goBack(){
		console.log("multiplayerView goBack");
		this.game.stopAnimation();
		this.game.finishConnection();
		this.game.initPointerLock();
		this.hide();
		this.user.backgroundView.resume();
		this.router.go('/app');
	}

	rego(){
		console.log("multiplayerView rego");
		this.game.stopAnimation();
		this.game.init(this.getElement(), this.goBack.bind(this), this.rego.bind(this));
		this.game.animate();
	}

}