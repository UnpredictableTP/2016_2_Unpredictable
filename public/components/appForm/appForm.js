'use strict';

import Form from '../form/form';
import Input from '../input/input';
import Button from '../button/button';
import Block from '../block/block';
import User from '../../models/UserModel';
import Link from '../link/link';
import './appForm.scss';


export default class AppForm extends Form {
	constructor(options) {
		super(options);
		this._header = new Block('h1', {
			attrs: {
				class: 'header'
			}
		});
		this._header._get().innerText = `TechnoOsmos`;

		this._logoutButton = new Button('Log out', {});

		this._singleplayer = new Link('SinglePlayer', {attrs: {href: '/singleplayer'}});
		this._multiplayer = new Link('MultiPlayer', {attrs: {href: '/multiplayer'}});
		this._score = new Link('ScoreBoard', {attrs: {href: '/score'}});

		this.append(this._header._get());
		this._header2 = new Block('h2', {});
		this._header2._get().innerText = `Hello, ${this._options.name || 'Anon'}`;
		this.append(this._header2._get());
		this.append(this._singleplayer._get());
		this.append(this._multiplayer._get());
		this.append(this._score._get());
		this.append(this._logoutButton._get());
	}

	onLogout(callback, options = {}) {
		// TODO !!!!!
	}
}

