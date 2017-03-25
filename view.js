'use strict';

const PIXI = require('pixi.js');
const Level = require('.').Level;

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
		this.pixi.stage.addChild(this.camera);
		document.body.appendChild(this.pixi.view);

		this.level = new Level();
		this.level.onCreateHero = this.onCreateHero.bind(this);
		this.cameraLookAt = {
			x: window.innerWidth / 2,
			y: window.innerHeight / 2
		};

		window.addEventListener('resize', this.onResize.bind(this), true);
	}
	onCreateHero (hero) {
		hero.sprite = PIXI.Sprite.fromImage('bunny.png');
		hero.sprite.anchor.set(0.5);
		hero.sprite.x = hero.x;
		hero.sprite.y = hero.y;
		this.camera.addChild(hero.sprite);
	}
	onResize (event) {
		this.scale = this.getScale();
		this.pixi.renderer.resize(window.innerWidth, window.innerHeight);
	}
	getScale () {
	    return +(Math.sqrt(window.innerWidth * window.innerHeight) / this.screenSize).toFixed(2);
	}
}

if (typeof module !== 'undefined') {	
	module.exports = View;
}
