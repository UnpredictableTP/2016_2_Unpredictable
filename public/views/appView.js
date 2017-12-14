'use strict';

import View from '../modules/view';
import AppForm from '../components/appForm/appForm';


export default class AppView extends View {
	constructor(tag, {user}) {
		console.log("Appview constructor");
		console.log("AppView constructor");
		super('js-app');
		this._user = user;
	}

	init() {
		console.log("AppView init");
		this.appForm = new AppForm(this._user, this.goMain.bind(this));
		this.appForm.renderTo(this.getElement());
	}

	resume() {
		console.log("AppView resume");
		if (!this._user.checked) {
			this.show();
		}
	}

	goMain() {
		console.log("AppView goMain");
		this.router.go('/');
	}

}
