'use strict';

console.log('require');
const { Game, Level, Hero } = require('..');

console.log('test Game()');
const game = new Game();

console.log('test Hero()');
for (let l = 0; l < 99; l++) {
	const heros = {};
	const hero = new Hero();
	hero.goto(0, 0);
	heros[hero.id] = hero;
	const level = new Level({ heros });
	game.levels.push(level);
}

console.log('test loop()');
game.onUpdate = () => {
	console.log('loop works');
};
game.loop();
