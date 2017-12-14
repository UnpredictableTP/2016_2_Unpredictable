'use strict';

import Route from './route';

/** Класс роутера */
export default class Router {
	/**
	 * Создаёт новый роутер или возвращает уже созданный инстанс
	 */
	constructor() {
		console.log("Router constructor");
		if (Router.__instance) {
			return Router.__instance;
		}

		this.routes = [];
		this.pathsHistory = [];
		this.activeRoute = null;

		this.history = window.history;

		Router.__instance = this;
	}

	/**
	 * Добавляет новый Route в роутер
	 * @param {string} pathname - Шаблон пути
	 * @param {View} view - Класс конкретной View
	 * @param {Object} [options={}] - Дополнительные параметры, которые будут переданы во view при её создании и инициализации
	 * @returns {Router}
	 */
	addRoute(pathname, view, options = {}) {
		console.log("Router addRoute");
		const route = new Route(pathname, view, options);
		route.setRouter(this);
		this.routes.push(route);
		return this;
	}

	/**
	 * Запускает роутер и переходит по текущему пути в приложении
	 * @param {Object} [state={}] - Объект state, который передаётся в первый вызов onroute
	 */
	start(state = {}, options) {
		console.log("Router start");
		window.onpopstate = (event) => {
			const status = event.state;
			const pathname = window.location.pathname;
			this.pathsHistory.push(pathname);
			this.onroute(pathname, status);
		};
		this.started = true;
		const pathname = window.location.pathname;
		this.pathsHistory.push(pathname);
		this.onroute(pathname, state);

	}

	/**
	 * Функция, вызываемая при переходе на новый роут в приложении
	 * @param {string} pathname - Путь, по которому происходит переход
	 * @param {Object} [state={}] - Объект state, который передаётся в вызов метода navigate
	 */
	onroute(pathname, state = {}) {
		console.log("Router onroute");
		const route = this.routes.find(r => r.match(pathname));
		if (!route) {
			return;
		}
		if (this.activeRoute) {
			this.activeRoute.leave();
		}

		this.activeRoute = route;
		this.activeRoute.navigate(pathname, state);
	}

	/**
	 * Программный переход на новый путь
	 * @param {string} pathname - Путь
	 * @param {Object} [state={}] - Объект state, который передаётся в вызов history.pushState
	 */
	go(pathname, state = {}) {
		console.log("Router go");
		if (!this.started) {
			return;
		}
		if (window.location.pathname === pathname) {
			return;
		}
		this.history.pushState(state, '', pathname);
		this.pathsHistory.push(pathname);
		this.onroute(pathname, state);
	}

	/**
	 * Позволяет установить свою собственную реализацию History API
	 * @param {Object} history - должен предоставлять реализацию методов back(), forward(), pushState()
	 */
	setHistory(history) {
		console.log("Router setHistory");
		this.history = history;
	}

	/**
	 * Возврат на один шаг назад в истории браузера
	 */
	back() {
		console.log(this.history);
		this.history.go(-1);
	}

	/**
	 * Переход на один шаг вперёд в истории браузера
	 */
	forward() {
		this.history.forward();
	}
}
