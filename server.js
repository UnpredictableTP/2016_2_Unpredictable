'use strict';

const express = require('express');
const parser = require('body-parser');
const technoDoc = require('techno-gendoc');
const path = require('path');

const users = new Map();
const sessions = new Map();
let id = 0;

technoDoc.generate(require('./api'), 'dist');

const app = express();
app.use('/', express.static('dist', {maxAge: 1}));
app.use('/app', express.static('dist', {maxAge: 1}));
app.use('/sign', express.static('dist', {maxAge: 1}));
app.use('/score', express.static('dist', {maxAge: 1}));
app.use('/score/:page', express.static('dist', {maxAge: 1}));
app.use('/authorization', express.static('dist', {maxAge: 1}));
app.use('/singleplayer', express.static('dist', {maxAge: 1}));
app.use('/multiplayer', express.static('dist', {maxAge: 1}));

app.use(parser.json());

app.use(function (req, res, next) {
	console.log(`${req.method}  ${req.originalUrl}`);
	if (req.method === 'POST') {
		console.dir(req.body);
	}
	next();
});

// получение списка всех пользователей
app.get('/api/users', function (req, res) {
	const r = [...users.values()].map(user => {
		user.password = undefined;
		return user;
	});
	res.json(r);
});

// получение информации о конкретном пользователе
app.get('/api/users/:id', function (req, res) {
	if (users.has(+req.params.id)) {
		res.json(users.get(+req.params.id));
	} else {
		res.status(404).json({error: 'Пользователь с таким id не найден'});
	}
});

// создание нового пользователя
app.post('/api/users', function (req, res) {
	const body = req.body;
	if (body.login && body.password) {
		const userId = id;
		id += 1;
		users.set(userId, {
			id: userId,
			login: body.login,
			password: body.password
		});
		return res.json({id: userId});
	}
	return res.status(400).json({error: 'Неверные имя пользователя и/или пароль'});
});

// авторизация пользователя
app.post('/api/sessions', function (req, res) {
	const body = req.body;
	let result;

	[...users.values()].forEach(user => {
		if ((user.login === body.login) && (user.password === body.password)) {
			result = user;
		}
	});

	if (!result) {
		return res.status(404).json({error: 'Неверная пара логин/пароль'});
	}
	const sessionId = id;
	id += 1;
	const session = {
		sessionid: sessionId,
		userid: result.id
	};
	sessions.set(sessionId, session);
	res.json(session);
});

// разлогинивание пользователя
app.delete('/api/sessions/:sessionid', function (req, res) {
	sessions.delete(req.params.sessionid);
	res.status(200).end();
});


app.listen(process.env.PORT || 3000, () => {
	console.log(`App started on port ${process.env.PORT || 3000}`);
});
