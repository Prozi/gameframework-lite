(function () {
'use strict';

const { Physics, Body, b2Vec2 } = require('./physics');
const FMath = require('fmath');
const md5 = require('md5');

const fmath = new FMath();

// function constants
const DEFER = (typeof process !== 'undefined') ? process.nextTick.bind(process) : setTimeout;
const NOW = (typeof performance !== 'undefined') ? performance.now.bind(performance) : Date.now.bind(Date);

// just constants
const HALF_PI = Math.PI / 2;

const HERO_ID = 0;
const HERO_X = 1;
const HERO_Y = 2;

const BOTTOM = atan2(10, 0);
const SPREAD_HEROS = 2;

class Game {
	constructor (interval = 10) {
		this.levels = [];
		this.interval = interval;
		this.now = NOW();
	}
	loop () {
		DEFER(this.tick.bind(this));
		if (this.onUpdate) {
			DEFER(this.onUpdate.bind(this));
		}
		setTimeout(() => DEFER(this.loop.bind(this)), this.interval);	
	}
	tick () {
		const now = NOW();
		this.delta = (now - this.now) / 1000;
		this.now = now;
		this.levels.forEach((map) => {
			DEFER(map.tick.bind(map, this.delta));
		});
	}
}

class Level {
	constructor (props = {}) {		
		const options = {};
		if (props.gravity) {
			options.gravity = props.gravity;
		}
		this.physics = new Physics(props);
		this.heros = props.heros || {};
		this.blocks = props.blocks || {};
		this.accuracy = 10;
	}
	spawn ({ body }) {
		body.x = Math.random() * this.width;
		body.y = 0;
	}
	eachHero (callback) {
		for (let hero in this.heros) {
			if (this.heros.hasOwnProperty(hero)) {
				callback(this.heros[hero]);
			}
		}
	}
	tick (delta) {
		this.physics.step(delta);
	}
	toArray () {
		const array = [[]];
		this.eachHero((hero) => array[0].push(hero.toArray()));
		return array;
	}
	fromArray (array = []) {
		this.eachHero((hero) => {
			if (!array[0].find((heroArray) => heroArray[HERO_ID] === hero.id)) {
				if (this.onRemoveHero) {
					this.onRemoveHero(hero);
				}
				delete this.heros[hero.id];
			}
		});
		array[0].forEach((heroArray) => {
			const id = heroArray[HERO_ID];
			if (this.heros[id]) {
				this.updateHero(id, heroArray);
			} else {
				this.addHero(heroArray);
			}
		});
	}
	updateHero (id, heroArray = []) {
		this.heros[id].fromArray(heroArray);
		if (this.onUpdateHero) {
			this.onUpdateHero(this.heros[id]);
		}
	}
	addHero (heroArray = [], bodyProperties = {}) {
		const id = heroArray[HERO_ID] || randomId();
		heroArray[HERO_X] = heroArray[HERO_X] || this.width * Math.random();
		heroArray[HERO_Y] = heroArray[HERO_Y] || 0;
		this.heros[id] = new Hero({}, id);
		this.heros[id].addBody(this.physics, Object.assign({
			shape: 'circle',
			x: heroArray[HERO_X],
			y: heroArray[HERO_Y],
			radius: 0.5,
		}, bodyProperties));
		this.heros[id].fromArray(heroArray);
		if (this.onCreateHero) {
			this.onCreateHero(this.heros[id]);
		}
		return this.heros[id];
	}
	fromTiled (tiled = {}) {
		this.width  = tiled.width;
		this.height = tiled.height;
		this.blocks = {};
		this.stops  = {};
		this.tileset = {
			tilewidth: tiled.tilesets[0].tilewidth,
			imagewidth: tiled.tilesets[0].imagewidth,
		};
		this.accuracy = this.tileset.tilewidth;
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				const pos = y * this.width + x;
				const offset = `${x}:${y}`;
				this.blocks[offset] = [
					tiled.layers[0].data[pos], 
					tiled.layers[1].data[pos]
				];
				this.stops[offset] = tiled.layers[2].data[pos];
				if (this.stops[offset]) {
					new Body(this.physics, { type: 'static', x, y, width: 1, height: 1 });
				}
			}
		}
		// boundaries
		new Body(this.physics, { type: 'static', x: -1, y: -1, height: this.height + 1, width: 1 });
		new Body(this.physics, { type: 'static', x: this.width + 1, y: -1, height: this.height + 1, width: 1 });
		new Body(this.physics, { type: 'static', x: -1, y: -1, height: 1, width: this.width + 1 });
		new Body(this.physics, { type: 'static', x: -1, y: this.height + 1, height: 1, width: this.width + 1 });
	}
}

class Hero {
	constructor (props = {}, id = randomId()) {
		this.id = id;
		this.speed = 10;
		// for drawing
		this.sprite = null;
	}
	get x () {
		return this.body ? this.body.GetPosition().x : undefined;
	}
	get y () {
		return this.body ? this.body.GetPosition().y : undefined;
	}
	addBody (physics, details = {}) {
		this.body = new Body(physics, details);
	}
	toArray () {
		return [
			this.id,
			this.x,
			this.y,
		];
	}
	fromArray (array = [], force = false) {
		if (force) {
			this.id = array[HERO_ID];
		}
		if (force || (this.id === array[HERO_ID])) {
			this.move(array[HERO_X], array[HERO_Y]);
		}
	}
	move (x, y) {
		if (this.body) {
			this.body.SetPosition(new b2Vec2(x, y));
		}
	}
	goto ({ x, y }) {
		const distance = Math.sqrt(x * x + y * y);
		const d = this.speed / distance;
		this.body.ApplyForce({ 
			x: x * d, 
			y: y * d 
		}, this.body.GetWorldCenter(), true);
	}
}

function atan2 (y, x) {
	if (x > 0) {
		return fmath.atan(y / x);
	}
	if (x < 0) {
		if (y >= 0) {
			return fmath.atan(y / x) + Math.PI;
		}
		return fmath.atan(y / x) - Math.PI;
	}
	if (x === 0) {
		if (y === 0) {
			return undefined;
		}
		if (y > 0) {
			return HALF_PI;
		}
		if (y < 0) {
			return -HALF_PI;
		}
	}
}

function randomId () {
	return md5(Math.random()).slice(0, 7);
}

function distance (dx, dy) {
	return Math.sqrt(dx * dx + dy * dy);
}

if (typeof module !== 'undefined') {
	module.exports = {
		DEFER,
		Game,
		Level,
		Hero,
		atan2,
		randomId,
		distance,
	};
}

})();
