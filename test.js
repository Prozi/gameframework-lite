'use strict';

console.log('require');
const { Game, Level, Hero, Block } = require('.');

console.log('test Game()');
const g = new Game();

console.log('test Block()');
const blocks = {};
for (let y = 0; y < 999; y++) {
	for (let x = 0; x < 999; x++) {
		blocks[`${x}:${y}`] = new Block({ x, y, blocked: false })
	}
}

console.log('test Hero()');
for (let l = 0; l < 99; l++) {
	const h = new Hero();
	h.goto(0, 0);
	const heros = [h];
	const level = new Level({ heros, blocks });
	g.levels.push(level);
}

console.log('test loop()');
g.loop();
