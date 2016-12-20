'use strict';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/main.scss';
import User from './models/UserModel';
import Router from './modules/router';
import AppView from './views/appView';
import SignView from './views/signView';
import BackgroundView from './views/backgroundView';
import ScoreboardView from './views/scoreboardView';
import MainView from './views/mainView';
import SinglePlayView from './views/singleplayerView';
import MultiPlayView from './views/multiplayerView';


// const serviceWorker = function () {
//
// 	if (!navigator.serviceWorker) {
// 		return;
// 	}
// 	navigator.serviceWorker.register(
// 		'/sw.js'
// 	).then(function (registration) {
// 		// при удачной регистрации имеем объект типа ServiceWorkerRegistration
// 		console.log('ServiceWorker registration', registration);
// 		// строкой ниже можно прекратить работу serviceWorker’а
// 		// registration.unregister();
// 	}).catch(function (err) {
// 		throw new Error('ServiceWorker error: ' + err);
// 	});
// };

const options = {
	user: new User(),
	host: 'https://guarded-oasis-31621.herokuapp.com/',
	backgroundView: new BackgroundView(),
};

options.backgroundView.init();
options.backgroundView.resume();

options.user.setHost(options.host);


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
const preloader = document.getElementById('preload');
// let preloader = document.getElementsByClassName("preload");

const preloaderFunc = function (el) {
	if (!el) {
		return;
	}
	el.style.opacity = 1;
	const interpreloader = setInterval(function () {
		el.style.opacity -= 0.05;
		if (el.style.opacity <= 0.05) {
			clearInterval(interpreloader);
			preloader.style.display = 'none';
		}
	}, 16);
};


window.onload = function () {
	setTimeout(function () {
		preloaderFunc(preloader);
	}, 1000);
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
	.addRoute('/singleplayer', SinglePlayView, options)
	.addRoute('/multiplayer', MultiPlayView, options)
	.addRoute('/', MainView, options)
	.start({}, options);

options.user.checkAuth()
	.then((checked) => {
		checked = true;
	}).catch((checked) => {
		new Router().go('/');
		checked = true;
	});
