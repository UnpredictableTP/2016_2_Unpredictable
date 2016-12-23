'use strict';

import View from '../modules/view';
import Background from '../components/background/background';

export default class backgroundView extends View {
	constructor(options = {}) {
		super('js-background');
	}

	init(options = {}) {
	}

	_initCanvas() {
		this.canvas = this._el.querySelector('.js-canvas-background');
		this.canvas.width = this._el.clientWidth;
		this.canvas.height = this._el.clientHeight;
	}

	resume() {
		this._initCanvas();
		this.canvas.hidden = false;

		this._background = new Background({
			ctx: this.canvas.getContext('2d'),
			width: this.canvas.width,
			height: this.canvas.height
		});

		this._background.start();
		window.addEventListener('resize', function () {
			this.canvas.width = this._el.clientWidth;
			this.canvas.height = this._el.clientHeight;
			this._background.setSize(this._el.clientWidth, this._el.clientHeight);
		}.bind(this));
	}

	pause() {
		this._background.stop();
		this._background.stopAnimation();
		this.canvas.hidden = true;
	}

	getSize(){
		return {
			width: this._el.clientWidth,
			height: this._el.clientHeight
		}
	}
}
