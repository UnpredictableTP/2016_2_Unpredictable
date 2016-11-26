'use strict';


export default class Model {

	constructor(attributes = {}) {
		this.attributes = Object.assign({}, this.defaults, this._clean(attributes));
	}

	get defaults() {
		return {};
	}

	get url() {
		return '/';
	}

	_clean(attributes) {
		Object.keys(attributes).forEach(key => {
			if (attributes[key] === undefined) {
				delete attributes[key];
			}

			if (typeof attributes[key] === 'object' && attributes[key] !== null) {
				this._clean(attributes[key]);
			}
		});
		return attributes;
	}

	_send(url, method, params) {
		return fetch('https://warm-fortress-86891.herokuapp.com/' + url, {
			method,
			body: JSON.stringify(params.body),
			mode: 'cors',
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			}
		}).then(function (resp) {
			if (resp.status < 300) {
				return resp.json();
			}
			return Promise.reject(resp.json());
		}).then((answer) => {
			console.log(answer);
			params.attrs.forEach(name => {
				this.info[name.toLowerCase()] = answer[name];
			});
			if (this.info['userid'] === '101') {
				this.clear();
				throw new Error();
			}
			if (params.oneMore) {
				let newUrl = 'api/sessions';
				params.attrs = ['sessionid'];
				params.body = {
					login: params.body.login,
					password: params.body.password
				};
				params.oneMore = false;
				this.save(newUrl, params)
			}
			return {};
		}).catch((data) => {
			if (params.func === 'signin') {
				this._errorTextServer = 'Такого пользователя не существует. Попробуйте еще раз';
				console.log('lol');
			} else {
				this._errorTextServer = 'Такой пользователя существует. Попробуйте еще раз';
			}
			return Promise.reject();
		});
	}

	save(url, params) {
		const method = 'POST';
		return this._send(url, method, params);
	}

	getInfo(url, params) {
		const method = 'GET';
		return this._send(url, method, params);
	}

	deleteInfo(sessionid) {
		return fetch('https://morning-hamlet-29496.herokuapp.com/api/sessions/' + sessionid, {
			method: 'DELETE',
			mode: 'cors'
		}).then(function () {
			window.localStorage.clear();
		}).catch(function (resp) {
			this._errorText = 'Неизвестная ошибка. Попробуйте позже';
		});
	}

	getError() {
		if (this._errorText)
			return this._errorText;
	}

	clearErrors() {
		this._errorText = {};
	}
}

