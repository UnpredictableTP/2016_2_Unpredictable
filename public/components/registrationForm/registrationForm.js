'use strict';

import Form from '../form/form';
import Input from '../input/input';
import Button from '../button/button';
import Block from '../block/block';
import User from '../../models/UserModel';
import Link from '../link/link';


export default class RegistrationForm extends Form {
	constructor(options) {
		super(options);

		this._header = new Block('h3', {
			attrs: {
				class: 'header'
			}
		});
		this._header._get().innerText = 'Registration';
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

		this._inputEmail = new Input({
			attrs: {
				type: 'text',
				name: 'email',
				placeholder: 'Введите свой email'
			}
		});
		this._inputName = new Input({
			attrs: {
				type: 'text',
				name: 'name',
				placeholder: 'Введите свое имя'
			}
		});
		this._inputPassword = new Input({
			attrs: {
				type: 'password',
				name: 'password',
				placeholder: 'Введите пароль'
			}
		});
		this._errorTextPassword = new Block('div', {
			attrs: {
				class: 'error'
			}
		});

		this._inputRepeatPassword = new Input({
			attrs: {
				type: 'password',
				name: 'reppassword',
				placeholder: 'Подтвердите пароль'
			}
		});
		this._errorTextRepeat = new Block('div', {
			attrs: {
				class: 'error'
			}
		});
		this._errorText = new Block('div', {
			attrs: {
				class: 'error'
			}
		});

		this._regButton = new Button('SignUp', {});
		this.append(this._header._get());
		this.append(this._inputLogin._get());
		this.append(this._errorTextLogin._get());
		this.append(this._inputEmail._get());
		this.append(this._inputName._get());
		this.append(this._inputPassword._get());
		this.append(this._errorTextPassword._get());
		this.append(this._inputRepeatPassword._get());
		this.append(this._errorTextRepeat._get());
		this.append(this._errorText._get());
		this.append(this._regButton._get());
		this.errors = {
			_errorTextLogin: this._errorTextLogin,
			_errorTextPassword: this._errorTextPassword,
			_errorRepeatPassword: this._errorTextRepeat,
			_errorText: this._errorText
		};
	}

	onRegistration(callback, options = {}) {
		this._regButton.on('click', (button) => {
			button.preventDefault();
			const body = {
				login: this._inputLogin.getValue(),
				email: this._inputName.getValue(),
				// name : this._inputName.getValue(),
				password: this._inputPassword.getValue(),
				repeat: this._inputRepeatPassword.getValue()
			};
			console.log(body);
			options.setUserInfo(body);
			options.clearErrors();
			this.clearInputErrors();
			const result = options.signup(callback, options, this.errors);
		})
	}

	clearInputErrors() {
		for (const key in this.errors) {
			this.errors[key]._get().innerText = '';
		}
	}
}

