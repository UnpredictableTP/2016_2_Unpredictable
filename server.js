'use strict';

const express = require('express');
const parser = require('body-parser');
const technoDoc = require('techno-gendoc');
const path = require('path');

const users = new Map();
const sessions = new Map();

technoDoc.generate(require('./api'), 'dist');

const app = express();
app.use('/', express.static('dist', {maxAge: 1}));
app.use('/app', express.static('dist', {maxAge: 1}));
app.use('/sign', express.static('dist', {maxAge: 1}));
app.use('/score', express.static('dist', {maxAge: 1}));
app.use('/score/:page', express.static('dist', {maxAge: 1}));
app.use('/singleplayer', express.static('dist', {maxAge: 1}));

app.listen(process.env.PORT || 3000, () => {
	console.log(`App started on port ${process.env.PORT || 3000}`);
});
