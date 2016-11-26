'use strict';

import Model from '../modules/model';

export default class User extends Model {

	constructor(body = {}, attributes = {}) {
		super(attributes);
		this.body = body;
	}

	validateLogin(login) {
		if (!login || login.length === 0) {
			return {
				errorText: 'Логин не должен быть пустым',
			};
		}
		if (!login.match(/^[a-zA-Z0-9]{1,20}$/)) {
			return {
				errorText: 'Логин должен состоять из латинских букв или цифр и иметь длину не более 20 символов',
			};
		}
		return {};
	}

	validatePassword(password, repeat = null) {
		if (!password || password.length === 0) {
			return {
				errorText: 'Пароль не должен быть пустым',
			};
		}
		if (!password.match(/^[a-z0-9]{6,20}$/i)) {
			return {
				errorText: 'Пароль должен состоять из латинских букв или цифр и иметь длину от 6 до 20 символов',
			};
		}
		return {};
	}

	checkRepeat(password, repeat = null) {
		if (repeat && repeat !== password) {
			return {
				errorText: 'Пароли не совпадают',
			};
		}
		return {};
	}

	validate() {
		const isLoginValid = this.validateLogin(this.info.login);
		const isPasswordValid = this.validatePassword(this.info.password);
		const isRepeat = this.checkRepeat(this.info.password, this.info.repeat);
		this._errorText = {};
		this.error = false;
		if (isLoginValid.errorText) {
			this.error = true;
			this._errorText._errorTextLogin = isLoginValid.errorText;
		}
		if (isPasswordValid.errorText) {
			this.error = true;
			console.log(this._errorText);
			this._errorText._errorTextPassword = isPasswordValid.errorText;
		}
		if (isRepeat.errorText) {
			this.error = true;
			this._errorText._errorRepeatPassword = isRepeat.errorText;
		}
	}

	signin(callback, options, errors) {
		this.validate();
		if (this.error) {
			for (let key in this._errorText) {
				errors[key]._get().innerText = this._errorText[key];
			}
			return {};
		}
		let params = {
			attrs: ['userId', 'sessionid'],
			body: this.info,
			oneMore: false,
			func: 'signin'
		};
		let url = 'api/sessions';
		return this.save(url, params)
			.then(() => {
				callback();
			}).catch(() => {
				errors._errorText._get().innerText = this._errorTextServer;
				return {};
			});
	}

	signup(callback, options, errors) {
		this.validate();
		if (this.error) {
			for (let key in this._errorText) {
				errors[key]._get().innerText = this._errorText[key];
			}
			return {};
		}
		let params = {
			attrs: ['userid'],
			body: this.info,
			oneMore: true,
			func: 'signup'
		};
		let url = 'api/users';
		return this.save(url, params)
			.then(() => {
				callback();
			}).catch(() => {
				errors._errorText._get().innerText = this._errorTextServer;
				return {};
			});

	}

	chec(){
		return this.check('api/auth');
	}

	logout(sessionid) {
		return this.deleteInfo(sessionid);
	}

	setUserInfo(newInfo) {
		this.info = newInfo;
	}

	clear() {
		this.info = {};
	}

	getLogin() {
		return this.info.login;
	}

}