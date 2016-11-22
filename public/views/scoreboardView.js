'use strict';

import View from '../modules/view';
import Link from '../components/link/link';
import template from '../templates/scoreboard.tmpl.xml';
import UsersCollection from '../collections/UsersCollection';
import '../css/scoreboard.scss';

export default class ScoreboardView extends View {
	constructor(tag, {user}) {
		super('js-score');
		this._user = user;
		this._back = new Link('Go Back', {attrs: {href: 'back'}});
		this._users = new UsersCollection();
		this.pageNumber = 1;
	}

	init() {
		this._el.innerHTML = '';
	}

	resume({page = 1}) {
		console.log('resume({page = 1}) {');
		this._users.fetchUsers()
			.then(() => {
				console.log('fetch resolved');
				this._users.sort();
				this.usersArray = this._users.getData();
				this.takePart(page);
				this._el.innerHTML = template({items: this._ourUsers});
				this._back.renderTo(this.getElement());
				this._next.renderTo(this.getElement());
				this._prev.renderTo(this.getElement());
				super.resume();
			});
	}

	takePart(pageNumber) {
		const part = 3;
		this._next = new Link('Next', {attrs: {href: `/score/${+pageNumber + 1}`}});
		this._prev = new Link('Prev', {attrs: {href: `/score/${+pageNumber - 1}`}});
		if (pageNumber <= 1) {
			this._prev._get().setAttribute('style', 'display: none;');
			pageNumber = 1;
			this._ourUsers = this.usersArray.slice(0, part);
		} else {
			this._ourUsers = this.usersArray.slice(pageNumber * part, pageNumber * part + part);
		}

	}
}
