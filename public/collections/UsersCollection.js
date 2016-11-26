'use strict';


export default class UsersCollection {
	constructor() {
		this._data = [];
	}

	setHost(host) {
		this.host = host;
	}

	fetchUsers() {
		console.log('fetchUsers() {');
		return new Promise(function (resolve, reject) {
			// 'https://nameless-wildwood-32323.herokuapp.com/api/scoreboard?limit=10'
			fetch(this.host + 'api/users', {
				method: 'GET',
				mode: 'cors',
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				}
			}).then(resp => {
				if (resp.status !== 200) {
					reject(resp);
				}
				return resp.json();
			}).then(json => {
				this._data = json;
				resolve();
			}).catch(reject);
		}.bind(this));
	}

	sort() {
		this._data = this._data.sort((a, b) => b.score - a.score);
	}

	getData() {
		return this._data;
	}

}
