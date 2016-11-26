'use strict';

const fest = require('fest');

function compile(template, options) {
	const context = options.context || '';
	let name = template.replace(context, '').replace('.xml', '');
	const exclude = options.exclude || [];

	name = exclude.reduce(function (res, item) {
		return res.replace(item, '');
	}, name);

	const compiled = fest.compile(template);

	return [
		'',
		'/** ',
		' * =============================================================',
		' * ' + name + ' template',
		' * =============================================================',
		' */',
		'',
		'module.exports = ' + compiled
	].join('\n');
}

function parseQuery(queryStr) {
	try {
		return JSON.parse(queryStr.replace('?', ''));
	} catch (ex) {
		return {};
	}
}

module.exports = function festLoader(source, inputSourceMap) {
	const file = this.request.split('!')[1];
	const options = parseQuery(this.query);

	this.cacheable();
	this.callback(null, compile(file, options), inputSourceMap);
};
