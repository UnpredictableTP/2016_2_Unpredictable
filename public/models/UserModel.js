'use strict';

export default class User {
	constructor() {
		console.log("User constructor");
		this.info = {
			login: null,
			score: null
		};
		this.checked = false;
	}

	validateLogin(login) {
		console.log("User validateLogin");
		if (!login || login.length === 0) {
			return {
				errorText: 'Login shouldn\'t be empty',
			};
		}
		if (!login.match(/^[a-zA-Z0-9]{1,20}$/)) {
			return {
				errorText: 'Login consists from latin letters and it\'s length should be more than 1 and less than 20',
			};
		}
		return {};
	}

	validatePassword(password, repeat = null) {
		console.log("User validatePassword");
		if (!password || password.length === 0) {
			return {
				errorText: 'Passwords shouldn\'t be empty',
			};
		}
		if (!password.match(/^[a-z0-9]{6,20}$/i)) {
			return {
				errorText: 'Password consists from latin letters and it\'s length should be more than 6 and less than 20',
			};
		}
		return {};
	}

	checkRepeat(password, repeat = null) {
		console.log("User checkRepeat");
		if (repeat && repeat !== password) {
			return {
				errorText: 'Passwords are not equals',
			};
		}
		return {};
	}

	validate() {
		console.log("User validate");
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
			this._errorText._errorTextPassword = isPasswordValid.errorText;
		}
		if (isRepeat.errorText) {
			this.error = true;
			this._errorText._errorRepeatPassword = isRepeat.errorText;
		}
	}

	signin({login, password}) {
		console.log("User signin");
		this.info.login = login;
		this.info.password = password;
		this.validate();
		if (this.error) {
			return Promise.reject(this._errorText);
		}
		return fetch(this.host + 'api/sessions', {
			credentials: 'include',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({login, password}),
			mode: 'cors'
		}).then(res => {
			if (res.status >= 300) {
				throw new Error();
			}
			return Promise.resolve();
		}).catch(err => {
			this.errors = {};
			this.errors._errorText = 'No such user. Please try again';
			return Promise.reject(this.errors);
		});
	}

	signup({login, name, email, password, passwordRepeat}, errors) {
		console.log("User signup");
		this.info.login = login;
		this.info.name = name;
		this.info.email = email;
		this.info.password = password;
		this.info.repeat = passwordRepeat;
		this.validate();
		if (this.error) {
			return Promise.reject(this._errorText);
		}
		delete this.info.repeat;
		this.errors = errors;
		return fetch(this.host + 'api/users', {
			credentials: 'include',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(this.info),
			mode: 'cors'
		}).then(res => {
			if (res.status >= 300) {
				throw new Error();
			}
			delete this.info.email;
			delete this.info.name;
			return fetch(this.host + 'api/sessions', {
				credentials: 'include',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'POST',
				body: JSON.stringify(this.info),
				mode: 'cors'
			}).then(res => {
				if (res.status >= 300) {
					throw new Error();
				}
				return Promise.resolve();
			}).catch(err => {
				throw new Error(this.errors);
			});
		}).catch(err => {
			this.errors = {};
			this.errors._errorText = 'User with this login already exist. Please try again';
			return Promise.reject(this.errors);
		});
	}

	logout() {
		console.log("User logout");
		return fetch(this.host + 'api/sessions', {
			credentials: 'include',
			method: 'DELETE',
			mode: 'cors',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}).then(res => {
			if (res.status >= 300) {
				throw new Error();
			}
			return Promise.resolve();
		}).catch(err => {
			return Promise.reject(err);
		});
	}

	get login() {
		return this.info.login;
	}

	get score() {
		return this.info.score;
	}

	set score(value) {
		this.info.score = value;
	}

	set login(value) {
		this.info.login = value;
	}

	checkAuth() {
		console.log("User checkAuth");
		return fetch(this.host + 'api/auth', {
			credentials: 'include',
			method: 'GET',
			mode: 'cors'
		}).then(res => {
			if (res.status >= 300) {
				throw new Error();
			}
			return Promise.resolve(this.checked);
		}).catch(() => {
			return Promise.reject(this.checked);
		});
	}

	setHost(host) {
		console.log("User setHost");
		this.host = host;
	}
}
