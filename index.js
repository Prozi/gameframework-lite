'use strict';

const md5 = require('md5');
const FMath = require('fmath');
const fmath = new FMath();

// function constants
const DEFER = (typeof process !== 'undefined') ? process.nextTick : setTimeout;
const NOW = (typeof performance !== 'undefined') ? performance.now.bind(performance) : Date.now.bind(Date);

// variable constants
const HALF_PI = Math.PI / 2;
const HERO_ID = 0;
const HERO_X = 1;
const HERO_Y = 2;
const HERO_ATAN2 = 3;

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
			DEFER(map.tick.bind(map, this));
		});
	}
}

class Block {
	constructor (props = {}) {
		// for moving
		this.body = Object.assign({ 
			x: undefined,
			y: undefined,
			blocked: undefined
		// extend with props
		}, props);
		// for drawing
		this.sprite = null;
	}
}

class Level {
	constructor (props = {}) {		
		this.heros = props.heros || {};
		this.blocks = props.blocks || {};
		this.accuracy = 10; // default
	}
	isFreeCell (x, y) {
		// use override since
		// map not compatible
		if (!this.stops) {
			return true;
		}
		// map imported fromTiled()
		// and it has stop there
		if (this.stops[`${x}:${y}`]) {
			return false;
		}
		// otherwise its ok
		return true;
	}
	eachHero (callback) {
		for (let hero in this.heros) {
			if (this.heros.hasOwnProperty(hero)) {
				callback(this.heros[hero]);
			}
		}
	}
	tick ({ delta }) {
		this.eachHero((hero) => DEFER(hero.tick.bind(hero, { level: this, delta })));
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
				this.heros[id].fromArray(heroArray);
				if (this.onUpdateHero) {
					this.onUpdateHero(this.heros[id]);
				}
			} else {
				this.heros[id] = new Hero({}, id);
				this.heros[id].fromArray(heroArray);
				if (this.onCreateHero) {
					this.onCreateHero(this.heros[id]);
				}
			}
		});
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
			}
		}
	}
}

class Hero {
	constructor (props = {}, id = randomId()) {
		this.id = id;
		// for moving
		this.body = Object.assign({ 
			speed: 0,
			x: undefined,
			y: undefined,
			atan2: undefined,
		// extend with props
		}, props);
		// for drawing
		this.sprite = null;
	}
	toArray () {
		return [
			this.id,
			this.body.x,
			this.body.y,
			this.body.atan2
		];
	}
	fromArray (array = [], force = false) {
		if (force) {
			this.id = array[HERO_ID];
		}
		if (force || (this.id === array[HERO_ID])) {
			this.body.x = array[HERO_X];
			this.body.y = array[HERO_Y];
			this.body.atan2 = array[HERO_ATAN2];
		}
		return this;
	}
	tick ({ level, delta }) {
		if (this.body.speed) {
			const x = this.body.x + this.body.speed * fmath.cos(this.body.atan2) * delta / level.accuracy;
			const y = this.body.y + this.body.speed * fmath.sin(this.body.atan2) * delta / level.accuracy;
			if (level.isFreeCell(Math.floor(x), Math.floor(y))) {
				this.body.x = x;
				this.body.y = y;
			} else {
				this.body.speed = 0;
			}
		}
	}
	goto ({ x, y }) {
		this.body.atan2 = atan2(y, x);
		this.body.speed = 1;
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

if (typeof module !== 'undefined') {	
	module.exports = {
		DEFER,
		Game,
		Level,
		Block,
		Hero,
		atan2
	};
}
