'use strict';

const { Game, Level, Hero } = require('..');

class MyGame extends Game {
	constructor (interval = null) {
		super(interval);

		console.log('test Hero()');
		const heros = {};
		for (let x = 0; x < 99; x++) {
			const hero = new Hero({
				x: Math.random() * 64,
				y: Math.random() * 48,
			});
			heros[hero.id] = hero;
		}

		console.log('test Level()');
		const level = new Level({ heros });
		this.levels.push(level);

		// start game
		this.loop();
	}
	onUpdate () {
		const level = this.levels[0];
		postMessage(level.toArray());
		level.eachHero((hero) => {
			if (Math.random() < 0.1) {
				hero.goto({
					x: Math.random() * 64,
					y: Math.random() * 48,
				});
			}
		});		
	}
}

new MyGame();
