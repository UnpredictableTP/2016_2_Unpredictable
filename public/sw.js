// наименование для нашего хранилища кэша
const CACHE_NAME = 'app_serviceworker_v_1';
// ссылки на кэшируемые файлы
const cacheUrls = [
	'/',

	'/collections/UsersCollections.js',

	'/components/appForm/appForm.js',
	'/components/appForm/appForm.scss',
	'/components/block/block.js',
	'/components/block/block.scss',
	'/components/button/button.js',
	'/components/button/button.scss',
	'/components/form/form.js',
	'/components/form/form.scss',
	'/components/form/form.tmpl.js',
	'/components/input/input.js',
	'/components/input/input.scss',
	'/components/link/link.js',
	'/components/link/link.scss',
	'/components/mainForm/mainForm.js',
	'/components/mainForm/mainForm.scss',

	'/css/main.css',
	'/css/scoreboard.css',
	'/css/sign-view.css',

	'/game/ball.js',
	'/game/game.js',
	'/game/keymaster.js',

	'/models/userModel.js',
	'/models/отвратительное имя переименовать!!!.js',

	'/modules/pathToRegex.js',
	'/modules/router.js',
	'/modules/route.js',
	'/modules/view.js',

	'/templates/record.tmpl.js',
	'/templates/scoreboard.tmpl.js',
	'/templates/sign.tmpl.js',

	'/views/appView.js',
	'/views/mainView.js',
	'/views/playView.js',
	'/views/scoreboardView.js',
	'/views/signView.js',

	'/main.js'
];

this.addEventListener('install', function (event) {
	// задержим обработку события
	// если произойдёт ошибка, serviceWorker не установится
	event.waitUntil(
		// находим в глобальном хранилище Cache-объект с нашим именем
		// если такого не существует, то он будет создан
		caches.open(CACHE_NAME)
			.then(function (cache) {
				// загружаем в наш cache необходимые файлы
				return cache.addAll(cacheUrls);
			})
	);
});

this.addEventListener('fetch', function (event) {
	// console.log(event);
	event.respondWith(
		// ищем запрашиваемый ресурс в хранилище кэша
		caches.match(event.request).then(function (cachedResponse) {

			// выдаём кэш, если он есть
			if (cachedResponse) {
				return cachedResponse;
			}

			// иначе запрашиваем из сети как обычно
			return fetch(event.request);
		})
	);
});

