'use strict';

import View from '../modules/view';
import DGame from '../newGame/multiplayer';
import Preloader from '../components/preloader';


export default class SinglePlayView extends View {
	constructor(tag, user) {
		super('js-play, js-background');
		let size = user.backgroundView.getSize();
		this.game = new DGame(size);
		this.user = user;
	}

	init(options = {}) {
		this.game.initSocket(this.getElement(), this.goBack.bind(this), this.rego.bind(this), this.hidePreload.bind(this));
	}

	resume(){
		const preloader = document.getElementById('preload');
		this.preload = new Preloader();
		this.preload.init(preloader);
		this.user.backgroundView.pause();
		this.show();
	}

	hidePreload(){
		setTimeout(() => {
			console.log('lololol');
			this.preload.setHide(preloader);
		}, 2000);
	}

	goBack(){
		this.game.stopAnimation();
		this.hide();
		this.user.backgroundView.resume();
		this.router.go('/app');
	}

	rego(){
		this.game.stopAnimation();
		this.game.init(this.getElement(), this.goBack.bind(this), this.rego.bind(this));
		this.game.animate();
	}

}