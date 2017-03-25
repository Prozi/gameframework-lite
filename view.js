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
		this.cameraLookAt = {
			x: window.innerWidth / 2,
			y: window.innerHeight / 2
		};
		this.pixi.stage.addChild(this.camera);
		this.level = new Level();
		this.level.onUpdateHero = this.onUpdateHero.bind(this);
		this.level.onCreateHero = this.onCreateHero.bind(this);
		this.level.onRemoveHero = this.onRemoveHero.bind(this);
		document.body.appendChild(this.pixi.view);
		window.addEventListener('resize', this.onResize.bind(this), true);
		this.pixi.start();
	}
	onUpdateHero (hero) {
		hero.sprite.x = hero.x;
		hero.sprite.y = hero.y;
	}
	onCreateHero (hero) {
		hero.sprite = PIXI.Sprite.fromImage('bunny.png');
		hero.sprite.anchor.set(0.5);
		hero.sprite.x = hero.body.x;
		hero.sprite.y = hero.body.y;
		this.camera.addChild(hero.sprite);
	}
	onRemoveHero (hero) {
		if (hero.sprite && hero.sprite.parent) {
			hero.sprite.parent.removeChild(hero.sprite);
		}
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
