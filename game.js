'use strict';

const View = require('./view');
const view = new View();

let server;

if (typeof Worker !== 'undefined') {
	server = new Worker('dist/testserver.js');
	server.onmessage = (event) => {
		view.level.fromArray(event.data);
	};
} else {
	document.body.innerHTML = 'Sorry! No Web Worker support.';
}

window.view = view;
window.server = server;