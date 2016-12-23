'use strict';

import View from '../modules/view';
import DGame from '../newGame/singleplayer';
import Preloader from '../components/preloader';
import '../css/main.scss';


export default class SinglePlayView extends View {
	constructor(tag, user) {
		super('js-play, js-background');
		let size = user.backgroundView.getSize();
		this.game = new DGame(size);
		this.user = user;
	}


	init(options = {}) {
		this.game.init(this.getElement(), this.goBack.bind(this), this.rego.bind(this));
	}

	resume(){
		const preloader = document.getElementById('preload');
		this.preload = new Preloader();
		this.preload.init(preloader);
		setTimeout(() => {
			this.preload.setHide(preloader);
		}, 2000);
		this.user.backgroundView.pause();
		this.show();
		this.game.animate();
	}

	goBack(){
		this.game.stopAnimation();
		this.hide();
		this.user.backgroundView.resume();
		this.router.go('/');
	}

	rego(){
		this.game.stopAnimation();
		this.game.init(this.getElement(), this.goBack.bind(this), this.rego.bind(this));
		this.game.animate();
	}

}