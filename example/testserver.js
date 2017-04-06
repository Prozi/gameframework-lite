'use strict';

const { Game, Level, Hero } = require('../es6');

class MyGame extends Game {
	constructor () {
		super(20);
		this.levels.push(new Level());
		for (let x = 0; x < 10; x++) {
			this.levels[0].addHero([null, Math.random() * 48 + 5, Math.random() * 24 + 5]);
		}
		// start game
		this.loop();
	}
	onUpdate () {
		const level = this.levels[0];
		postMessage(level.toArray());
		// level.eachHero((hero) => {
		// 	if (Math.random() < 0.1) {
		// 		hero.goto({
		// 			x: (Math.random() - 0.499) * 10,
		// 			y: (Math.random() - 0.499) * 10,
		// 		});
		// 	}
		// });
	}
}

new MyGame();
