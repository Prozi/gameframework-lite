'use strict';

const { Game, Level, Hero } = require('..');

class MyGame extends Game {
	constructor (interval = null) {
		super(interval);

		console.log('test Hero()');
		const heros = {};
		for (let x = 0; x < 99; x++) {
			const bunny = new Hero({
				x: Math.random() * 1024,
				y: Math.random() * 1024,
			});
			heros[bunny.id] = bunny;
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
					x: (Math.random() - 0.5) * 1024,
					y: (Math.random() - 0.5) * 1024,
				});
			}
		});		
	}
}

new MyGame();
