'use strict';

const { Game, Level, Hero } = require('../es6');

class MyLevel extends Level {
	tick () {}
}

class MyGame extends Game {
	constructor () {
		super(20);
		this.levels.push(new MyLevel());
		for (let x = 0; x < 10; x++) {
			this.levels[0].addHero([null, Math.random() * 48 + 5, Math.random() * 24 + 5]);
		}
		// start game
		this.loop();
	}
	onUpdate () {
		this.levels[0].eachHero((hero) => {
			if (Math.random() < 0.1) {
				hero.x += (Math.random() - 0.499) / 10;
				hero.y += (Math.random() - 0.499) / 10;
			}
		});
		postMessage(this.levels[0].toArray());
	}
}

new MyGame();
