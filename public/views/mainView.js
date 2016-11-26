'use strict';

import View from '../modules/view';
import MainForm from '../components/mainForm/mainForm';
import swLoader from '../modules/swLoader';


export default class MainView extends View {
	constructor(tag, {user}) {
		super('js-main');
		this._user = user;
	}

	init() {

		this.mainForm = new MainForm();
		// this.sw = new swLoader();
		this.mainForm.renderTo(this.getElement());
	}
}
