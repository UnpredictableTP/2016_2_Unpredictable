'use strict';

import './css/main.scss';
import User from './models/UserModel';
import Router from './modules/router';
import AppView from './views/appView';
import SignView from './views/signView';
import ScoreboardView from './views/scoreboardView';
import MainView from './views/mainView';
import PlayView from './views/playView';


const options = {
	user: new User()
};


const eventListener = function (event) {
	const el = event.target;
	if (el.tagName === 'A' && (el.getAttribute('data-nav') || el.getAttribute('href'))) {
		const url = el.getAttribute('data-nav') || el.getAttribute('href');
		if (el.target !== '_blank' && el.target !== '_self') {
			if (url === 'back') {
				console.log('go back');
				new Router().back();
			}
			event.preventDefault();
			new Router().go(url);
		}
	}
};

window.addEventListener('click', eventListener);
window.addEventListener('tap', eventListener);

// TIP: роуты нужно указывать от наиболее специфичного к наименее специфичному
// З.Ы. чтобы более ранние роуты не были префиксами более поздних ;]

(new Router())
	.addRoute('/sign', SignView, options)
	.addRoute('/app', AppView, options)
	.addRoute('/score/', ScoreboardView, options)
	.addRoute('/score/:page', ScoreboardView, options)
	.addRoute('/singleplayer', PlayView, options)
	.addRoute('/multiplayer', PlayView, options)
	.addRoute('/', MainView, options)
	.start();
