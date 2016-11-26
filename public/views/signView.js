'use strict';

import View from '../modules/view';
import SignForm from '../components/signForm/signForm';
import RegistrationForm from '../components/registrationForm/registrationForm';
import Link from '../components/link/link';
import Block from '../components/block/block';


export default class SignView extends View {
	constructor() {
		super('js-group');
		this.signForm = new SignForm();
		this.signForm._get().classList.add('js-sign');
		this.regForm = new RegistrationForm();
		this.regForm._get().classList.add('js-reg');
	}

	/**
	 * Инициализация вьюшки
	 * @param model - модкль юзера
	 */
	init(model = {}) {
		this.user = model.user;
		this._header2 = new Block('h1', {
			attrs: {
				class: 'header'
			}
		});
		this._header2._get().innerText = `TechnoOsmos`;
		this.signForm.onSignin(this.showAppForm.bind(this), this.user);
		this.regForm.onRegistration(this.showAppForm.bind(this), this.user);
		this.getElement().appendChild(this._header2._get());
		this.signForm.renderTo(this.getElement());
		this.regForm.renderTo(this.getElement());
		this._back = new Link('Go Back', {attrs: {href: 'back'}});
		this.getElement().appendChild(this._back._get());
	}

	showAppForm() {
		return this.router.go('/app');
	}

	resume(options = {}) {
		this.show();
	}


	pause() {
		this.hide();
	}

}
