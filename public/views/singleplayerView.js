'use strict';

import View from '../modules/view';
import DGame from '../newGame/singleplayer';

export default class SinglePlayView extends View {
	constructor(tag, user) {
		super('js-play, js-background');
		let size = user.backgroundView.getSize();
		this.game = new DGame(size);
		this.user = user;
	}


	init(options = {}) {
		this.game.init(this.getElement(), this.goBack.bind(this));
	}

	resume(){
		this.user.backgroundView.pause();
		this.show();
		this.game.animate();
	}

	goBack(){
		this.hide();
		this.user.backgroundView.resume();
		this.router.go('/');
	}

}