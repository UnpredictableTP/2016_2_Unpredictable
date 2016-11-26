'use strict';

import View from '../modules/view';
import AppForm from '../components/appForm/appForm';


export default class AppView extends View {
	constructor(tag, {user}) {
		super('js-app');
		this._user = user;
	}

	init() {
		this.appForm = new AppForm();
		this.appForm.renderTo(this.getElement());
	}

}
