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
		this.user.backgroundView.pause();
		this.game.init(this.getElement(), this.goBack.bind(this));
		this.game.animate();
	}

	goBack(){
		this.router.go('/');
	}

}