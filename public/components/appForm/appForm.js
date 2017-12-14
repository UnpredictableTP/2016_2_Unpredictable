'use strict';

import Form from '../form/form';
import Button from '../button/button';
import Block from '../block/block';
import Link from '../link/link';
import './appForm.scss';

export default class AppForm extends Form {
	constructor(options, callback) {
		console.log("AppForm constructor");
		super(options);
		this._user = options;
		this.callback = callback;
		this._header = new Block('h1', {
			attrs: {
				class: 'header'
			}
		});
		this._header._get().innerText = `TechnoOsmos`;

		this._logoutButton = new Button('Log out', {});
		this._logoutButton._get().addEventListener('click', this.onLogout.bind(this));

		this._singleplayer = new Link('SinglePlayer', {attrs: {href: '/singleplayer'}});
		this._multiplayer = new Link('MultiPlayer', {attrs: {href: '/multiplayer'}});
		this._score = new Link('ScoreBoard', {attrs: {href: '/score'}});

		this.append(this._header._get());
		this._header2 = new Block('h2', {});
		this._header2._get().innerText = `Hello, ${this._user.login || 'Anon'}`;
		this._errorHeader = new Block('h2', {});
		this.append(this._header2._get());
		this.append(this._singleplayer._get());
		this.append(this._multiplayer._get());
		this.append(this._score._get());
		this.append(this._logoutButton._get());
		this.append(this._errorHeader._get());

	}

	onLogout(event) {
		console.log("AppForm onLogout");
		event.preventDefault();
		this._user.logout()
			.then(() => {
				this.callback();
			}).catch((err) => {
				console.log(err);
				this._errorHeader._get().innerText = 'There are some problems with your logout. Please try again later';
			});
	}
}
