'use strict';

import Form from '../form/form';
import Input from '../input/input';
import Button from '../button/button';
import Block from '../block/block';
import User from '../../models/UserModel';
import Link from '../link/link';


export default class SignForm extends Form {
	constructor(options) {
		super(options);
		this._header1 = new Block('h3', {});
		this._header1._get().innerText = `Log In`;
		this._loginBlock = new Block('div', {});
		this._inputLogin = new Input({
			attrs: {
				type: 'text',
				name: 'login',
				placeholder: 'Введите свой логин'
			}
		});
		this._errorTextLogin = new Block('div', {
			attrs: {
				class: 'error'
			}
		});
		this._passwordBlock = new Block('div', {});
		this._inputPassword = new Input({
			attrs: {
				type: 'password',
				name: 'password',
				placeholder: 'Введите свой пароль'
			}
		});
		this._inButton = new Button('Sign In', {});
		this._errorTextPassword = new Block('div', {
			attrs: {
				class: 'error'
			}
		});
		this._errorText = new Block('div', {
			attrs: {
				class: 'error'
			}
		});

		this._inputLogin.renderTo(this._loginBlock._get());
		this._errorTextLogin.renderTo(this._loginBlock._get());
		this._inputPassword.renderTo(this._passwordBlock._get());
		this._errorTextPassword.renderTo(this._passwordBlock._get());
		this.append(this._header1._get());
		this.append(this._loginBlock._get());
		this.append(this._passwordBlock._get());
		this.append(this._errorText._get());
		this.append(this._inButton._get());
		this.errors = {
			_errorTextLogin: this._errorTextLogin,
			_errorTextPassword: this._errorTextPassword,
			_errorText: this._errorText
		};
	}

	// TODO комментарии в стиле JSDoc

	onSignin(callback, options = {}) {
		this._inButton.on('click', (e) => {
			e.preventDefault();
			const body = {
				login: this._inputLogin.getValue(),
				password: this._inputPassword.getValue()
			};
			options.setUserInfo(body);
			options.clearErrors();
			this.clearInputErrors();
			const result = options.signin(callback, options, this.errors);
		});
	}

	clearInputErrors() {
		for (const key in this.errors) {
			this.errors[key]._get().innerText = '';
		}
	}
}
