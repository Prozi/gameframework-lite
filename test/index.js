'use strict';

console.log('require');
const { Game, Level, Hero } = require('../es2015');
const express = require('express');
const app = express();

app.use(express.static('example'));
app.listen(3000);

class MyLevel extends Level {
	tick() {}
}

console.log('test Game()');
const game = new Game();

console.log('test Hero()');
for (let l = 0; l < 99; l++) {
	const heros = {};
	const hero = new Hero({});
	hero.x = 0;
	hero.y = 0;
	heros[hero.id] = hero;
	const level = new MyLevel({ heros });
	game.levels.push(level);
}

console.log('test loop()');
game.onUpdate = () => {
	console.log('loop works');
};
game.loop();
