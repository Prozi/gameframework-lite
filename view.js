'use strict';

const PIXI = require('pixi.js');

class View {
	constructor (screenSize = 480) {
		this.screenSize = screenSize;
		this.scale = this.getScale();
		this.pixi = new PIXI.Application(window.innerWidth, window.innerHeight, {
			autoResize: false,
			roundPixels: true,
			clearBeforeRender: false,
			resolution: Math.ceil(this.scale)
		});
		this.camera = new PIXI.Container();
		this.cameraLookAt = {
			x: window.innerWidth / 2,
			y: window.innerHeight / 2
		};
		this.pixi.stage.addChild(this.camera);
		document.body.appendChild(this.pixi.view);
		window.addEventListener('resize', this.onResize.bind(this), true);
	}
	onResize (event) {
		this.scale = this.getScale();
		this.pixi.renderer.resize(window.innerWidth, window.innerHeight);
		this.camera.x = this.pixi.renderer.width / 2 - this.cameraLookAt.x;
		this.camera.y = this.pixi.renderer.height / 2 - this.cameraLookAt.x;
	}
	getScale () {
	    return +(Math.sqrt(window.innerWidth * window.innerHeight) / this.screenSize).toFixed(2);
	}
}

if (typeof module !== 'undefined') {	
	module.exports = View;
}
