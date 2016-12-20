'use strict';

import Block from '../block/block';
import './button.scss';

export default class Button extends Block {
	constructor(text, options) {
		super('button', options);
		this._el.innerText = text;
		this._el.classList.add('button');
	}
}
