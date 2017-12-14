'use strict';

import Form from '../form/form';
import Input from '../input/input';
import Button from '../button/button';
import Block from '../block/block';
import './signForm.scss';


export default class SignForm extends Form {
	constructor(options) {
		console.log("SignForm constructor");
		super(options);
		debugger;
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
			errorTextLogin: this._errorTextLogin,
			errorTextPassword: this._errorTextPassword
		};
	}

	// TODO комментарии в стиле JSDoc

	onSignup(callback, options = {}) {
		console.log("MainForm onSignup");
		this._upButton.on('click', function (button) {
			button.preventDefault();
			// options.clearErrors();
			callback();
		});
	}

	onSignin(callback, options = {}) {
		console.log("MainForm onSignin");
		this._inButton.on('click', function (e) {
			e.preventDefault();
			const body = {
				login: this._inputLogin.getValue(),
				password: this._inputPassword.getValue()
			};
			options.setUserInfo(body);
			const result = options.signin();
			if (options.getError()) {
				const errors = options.getError();
				for (const key in errors) {
					this[key]._get().innerText = errors[key];
				}
			} else if (result) {
				result.then(function () {
					callback();
				}).catch(function () {
					this._errorText._get().innerText = options.getError();
					return {};
				}.bind(this));
			}

		}.bind(this));
		// options.clearErrors();
	}

	clearInputErrors() {
		console.log("MainForm clearInputErrors");
		for (const key in this.errors) {
			this.errors[key]._get().innerText = '';
		}
	}
}
