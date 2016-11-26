'use strict';

import View from '../modules/view';
import DGame from '../newGame/newgame';

export default class PlayView extends View {

	constructor() {
		super('js-play');
		this.game = new DGame();
	}


	init(options = {}) {
		this.game.init(this.getElement());
		this.user = options;
	}

	resume(options = {}) {
		this.show();
	}

	show() {
		this.getElement().hidden = false;
		this.game.animate();
	}
}

// 'use strict';
//
// import View from '../modules/view';
// import Game from '../game/game';
//
//
// export default class PlayView extends View {
// 	constructor() {
// 		super('js-play');
// 	}
//
// 	init() {
// 		this.canvas = this.getElement().querySelector('.js-canvas');
// 		this.canvas.width = '1024';
// 		this.canvas.height = '512';
// 		this.ctx = this.canvas.getContext('2d');
// 	}
//
// 	resume() {
// 		this._game = new Game({
// 			height: 512,
// 			width: 1024,
// 			ctx: this.ctx
// 		});
// 		this._game.start();
// 		super.resume();
// 	}
//
// }
