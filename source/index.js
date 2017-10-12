import FMath from 'fmath';
import md5 from 'md5';

const fmath = new FMath();

// function constants
const DEFER = (typeof process !== 'undefined') ? process.nextTick.bind(process) : setTimeout;
const NOW = (typeof performance !== 'undefined') ? performance.now.bind(performance) : Date.now.bind(Date);

// just constants
const HALF_PI = Math.PI / 2;

const HERO_ID = 0;
const HERO_X = 1;
const HERO_Y = 2;

export class Game {
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

export class Level {
	constructor (props = {}) {		
		const options = {};
		if (props.gravity) {
			options.gravity = props.gravity;
		}
		this.heros = props.heros || {};
		this.blocks = props.blocks || {};
		this.accuracy = 10;
	}
	spawn ({ body }) {
		body.x = random() * this.width;
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
		console.log(delta);
	}
	toArray () {
		const array = [[]];
		this.eachHero((hero) => array[0].push(hero.toArray()));
		return array;
	}
	removeHero (hero) {
		if (this.onRemoveHero) {
			this.onRemoveHero(hero);
		}
		this.heros[hero.id] = null;
		delete this.heros[hero.id];		
	}
	fromArray (array = [], HeroClass = Hero) {
		this.eachHero((hero) => {
			if (!array[0].find((heroArray) => heroArray[HERO_ID] === hero.id)) {
				this.removeHero(hero);
			}
		});
		array[0].forEach((heroArray) => {
			const id = heroArray[HERO_ID];
			if (this.heros[id]) {
				this.updateHero(id, heroArray);
			} else {
				this.addHero(heroArray, HeroClass);
			}
		});
		if (this.fromArrayExtension) {
			this.fromArrayExtension(array);
		}
	}
	updateHero (id, heroArray = []) {
		this.heros[id].fromArray(heroArray);
		if (this.onUpdateHero) {
			this.onUpdateHero(this.heros[id]);
		}
	}
	addHero (heroArray = [], HeroClass = Hero) {
		const id = heroArray[HERO_ID] || randomId();
		this.heros[id] = new HeroClass({ id });
		this.heros[id].x = heroArray[HERO_X] || this.width * random();
		this.heros[id].y = heroArray[HERO_Y] || 0;
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
			}
		}
	}
}

export class Hero {
	constructor ({ id = randomId(), sprite = null }) {
		this.id = id;
		this.sprite = sprite;
		this.x = undefined;
		this.y = undefined;
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
		this.x = x;
		this.y = y;
	}
}

export function atan2 (y, x) {
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

export function randomId () {
	return md5(random()).slice(0, 7);
}

export function distance (dx, dy) {
	return Math.sqrt(dx * dx + dy * dy);
}

export function random () {
	return Math.floor(Math.random() * 1001) / 1000;
}
