'use strict';

const View = require('../es6/view');

// this is how you should use View
class MyView extends View {
	// override example
	onCreateHero (hero) {
		hero.sprite = PIXI.Sprite.fromImage('bunny.png');
		hero.sprite.anchor.set(0.5);
	}
}

// initialize server example
// normally you should run
// node example/testserver
if (typeof Worker !== 'undefined') {
	if (!window.server) {
		window.server = true;
		window.server = new Worker('../dist/example/testserver.js');
		window.server.onmessage = (event) => {
			view.level.fromArray(event.data);
		};
	}
} else {
	// oops sorry you cant run this example this way
	// switch to a NORMAL browser like Chrome or Firefox
	document.body.innerHTML = 'Sorry! No Web Worker support.';
}

// so you can access from console
window.view = new MyView();
