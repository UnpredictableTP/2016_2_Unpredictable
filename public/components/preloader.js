'use strict';

export default class Preloader{
	constructor(){
		console.log("Preloader constructor");
		this.hide = false;
	}

	init(el){
		console.log("Preloader init");
		if (!el) {
			return;
		}
		el.style.display = 'initial';
		el.style.opacity = 1;
		if(this.hide) {
			const interpreloader = setInterval(function () {
				el.style.opacity -= 0.05;
				if (el.style.opacity < 0.05) {
					clearInterval(interpreloader);
					preloader.style.display = 'none';
				}
			}, 16);
		}
	}

	initSign(el){
		console.log("Preloader initSign");
		if (!el) {
			return;
		}
		el.style.opacity = 0.5;
		if(this.hide) {
			const interpreloader = setInterval(function () {
				el.style.opacity -= 0.1;
				if (el.style.opacity < 0.1) {
					clearInterval(interpreloader);
					preloader.style.display = 'none';
				}
			}, 16);
		}
	}



	setHide(el, bool){
		console.log("setHide");
		this.hide = true;
		if(bool === true){
			this.initSign(el);
		} else {
			this.init(el);
		}
	}

}
