'use strict';

console.log('require');
const { Game, Level, Hero, Block } = require('..');

console.log('test Game()');
const game = new Game();

console.log('test Block()');
const blocks = {};
for (let y = 0; y < 999; y++) {
	for (let x = 0; x < 999; x++) {
		blocks[`${x}:${y}`] = new Block({ x, y, blocked: false })
	}
}

console.log('test Hero()');
for (let l = 0; l < 99; l++) {
	const heros = {};
	const hero = new Hero();
	hero.goto(0, 0);
	heros[hero.id] = hero;
	const level = new Level({ heros, blocks });
	game.levels.push(level);
}

console.log('test loop()');
game.onUpdate = () => {
	console.log('loop works');
};
game.loop();
