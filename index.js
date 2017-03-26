'use strict';

const md5 = require('md5');
const FMath = require('fmath');
const fmath = new FMath();

// function constants
const DEFER = (typeof process !== 'undefined') ? process.nextTick : setTimeout;
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
		this.delta = (now - this.now) / 10;
		this.now = now;
		this.levels.forEach((map) => {
			DEFER(map.tick.bind(map, this));
		});
	}
}

class Level {
	constructor (props = {}) {		
		this.heros = props.heros || {};
		this.blocks = props.blocks || {};
		// defaults
		this.accuracy = 10;
		this.gravity = 0;
	}
	spawn ({ body }) {
		body.x = Math.random() * this.width;
		body.y = 0;
	}
	isFreeCell (x, y) {
		// use override since
		// map not compatible
		if (!this.stops) {
			return true;
		}
		if (x < 0 || y < 0 || x + 1 > this.width || y + 1 > this.height) {
			return false;
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
		this.physics();
	}
	distance (dx, dy) {
		return Math.sqrt(dx * dx + dy * dy);
	}
	physics () {
		this.distances = {};
		this.eachHero((hero1) => {
			this.eachHero((hero2) => {
				if (hero1.id !== hero2.id) {
					const key = [hero1.id, hero2.id].sort().join(':');
					if (!this.distances[key]) {
						this.distances[key] = this.distance(
							hero1.body.x - hero2.body.x, 
							hero1.body.y - hero2.body.y
						);
					}
				}
			});
		});
		// spread heros
		for (let key in this.distances) {
			if (this.distances.hasOwnProperty(key)) {
				const distance = this.distances[key];
				if (distance < SPREAD_HEROS) {
					const split = key.split(':');
					const hero1 = this.heros[split[0]];
					const hero2 = this.heros[split[1]];
					if (hero1 && hero2) {
						const r = Math.atan2(
							hero1.body.y - hero2.body.y, 
							hero1.body.x - hero2.body.x
						);
						const diff = (distance - SPREAD_HEROS) / 2;
						const cos = diff * fmath.cos(r);
						const sin = diff * fmath.sin(r);
						hero1.move({ level: this, x: hero1.body.x - cos, y: hero1.body.y - sin, d: 1 });
						hero2.move({ level: this, x: hero2.body.x + cos, y: hero2.body.y + sin, d: 1 });
					}
				}
			}
		}
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
			// position
			x: undefined,
			y: undefined,
			// direction
			atan2: BOTTOM,
			// acceleration
			vx: 0,
			vy: 0,
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
		];
	}
	fromArray (array = [], force = false) {
		if (force) {
			this.id = array[HERO_ID];
		}
		if (force || (this.id === array[HERO_ID])) {
			this.body.x = array[HERO_X];
			this.body.y = array[HERO_Y];
		}
		return this;
	}
	tick ({ level, delta }) {
		if (this.onTick) {
			this.onTick();
		}
		const d = delta / level.accuracy;
		const x = this.body.x + this.body.vx * d;
		const y = this.body.y + this.body.vy * d;
		this.move({ level, x, y, d });
	}
	move ({ level, x, y, d }) {
		let fall = true;
		if (level.isFreeCell(Math.floor(x), Math.floor(y))) {
			// exact
			this.body.x = x;
			this.body.y = y;
		} else if (level.isFreeCell(Math.floor(this.body.x), Math.floor(y))) {
			// vertical
			this.body.y = y;
		} else if (level.isFreeCell(Math.floor(x), Math.floor(this.body.y))) {
			// horizontal
			this.body.x = x;
		} else {
			fall = false;
		}
		if (fall && level.gravity) {
			this.body.vy += level.gravity * d;
		} else {
			this.body.vy = 0;
		}		
	}
	goto ({ x, y }) {
		this.body.atan2 = atan2(y, x);
		this.body.vx = fmath.cos(this.body.atan2);
		this.body.vy = fmath.sin(this.body.atan2);
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
		Hero,
		atan2
	};
}
