'use strict';

/**
 * Класс представляет собой view
 */
export default class View {
	/**
	 * Создаёт новую view
	 * @param {Object} [options={}] - Объект с параметрами
	 */
	constructor(tag, options = {}) {
		console.log("View constructor");

		if (tag && document.querySelector('.' + tag)) {
			this._el = document.querySelector('.' + tag);
		} else {
			this.tagName = options.tagName || 'div';
			this._el = document.createElement(this.tagName);
		}

		this.__interval = null;
	}

	/**
	 * Инициализация параметров view (выполняется сразу после создания)
	 * Необходимо перепределять
	 * @param {Object} [options={}] - Объект с параметрами
	 */
	init(options = {}) {
		console.log("View init");
		this.setAttrs(options.attrs);
	}

	/**
	 * Вызывается при приостановке работы view (при скрытии view или переходе на другую view)
	 * Необходимо переопределять своей логикой
	 * @param {Object} [options={}] - Объект с параметрами
	 */
	pause(options = {}) {
		console.log("View pause");
		this.hide();
	}

	/**
	 * Вызывается при начале или продолжении работы view (после того, как view была скрыта)
	 * Необходимо переопределять своей логикой
	 * @param {Object} [options={}] - Объект с параметрами
	 */
	resume(options = {}) {
		console.log("View resume");
		this.show();
	}

	/**
	 * Показывает view
	 * @param {Object} [options={}] - Объект с параметрами
	 */
	show(options = {}) {
		console.log("View show");
		this.__interval = setTimeout(() => {
			this._el.style = 'opacity:0';
			this._el.style = 'animation-name: fadeInDown;';
			this.__interval = null;
		}, 301);
	}

	/**
	 * Скрывает view
	 * @param {Object} [options={}] - Объект с параметрами
	 */
	hide(options = {}) {
		console.log("View hide");
		if (this.__interval) {
			clearTimeout(this.__interval);
			this.__interval = null;
		}
		this._el.style = 'animation-name: fadeOutDown;';
	}

	/**
	 * Рендерит view
	 * Необходимо переопределять
	 * @param {Object} [options={}] - Объект с параметрами
	 */
	render(options = {}) {

	}

	/**
	 * Вставляет текущую view в переданный элемент
	 * @param {HTMLElement} el - HTML-элемент, к которому добавляется элемент текущей view
	 */
	appendTo(el) {
		console.log("View appendTo");
		debugger;
		el.appendChild(this._el);
	}

	/**
	 * Удаляет элемент текущей view
	 */
	remove() {
		console.log("View remove");
		if (this._el) {
			this._el.remove();
		}
	}

	/**
	 * Заменяет элемент текущей view
	 * @param {HTMLElement} el - HTML-элемент, который становится элементом текущей view
	 */
	setElement(el) {
		console.log("View setElement");
		if (this._el) {
			this._el.remove();
		}
		this._el = el;
	}

	/**
	 * Устанавливает текущей view набор атрибутов
	 * @param {Object} [attrs={}] - Объект с атрибутами, которые будут установлены у текущего элемента view
	 */
	setAttrs(attrs = {}) {
		console.log("View setAttrs");
		Object.keys(attrs).forEach(name => {
			console.log(name + ": " + attrsp[name]);
			debugger;
			this._el.setAttribute(name, attrs[name]);
		});
	}

	/**
	 * Возвращает строку, содержашую текстовое представление текущей view
	 * @returns {string}
	 */
	toString() {
		return this._el.outerHTML;
	}

	/**
	 * Устанавливает текущей view роутер
	 * @param {Router} router - инстанс роутера
	 */
	setRouter(router) {
		console.log("View setRouter");
		this.router = router;
	}

	getElement() {
		return this._el;
	}

}
