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
		this.physics = new Physics(options);
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
		this.physics.step(delta);
	}
	toArray () {
		const array = [[]];
		this.eachHero((hero) => array[0].push(hero.toArray()));
		return array;
	}
	fromArray (array = [], HeroClass = Hero) {
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
				this.addHero(heroArray, {}, HeroClass);
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
	addHero (heroArray = [], bodyProperties = {}, HeroClass = Hero) {
		const id = heroArray[HERO_ID] || randomId();
		heroArray[HERO_X] = heroArray[HERO_X] || this.width * random();
		heroArray[HERO_Y] = heroArray[HERO_Y] || 0;
		this.heros[id] = new HeroClass({ id });
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
		new Body(this.physics, { type: 'static', x: -1, y: this.height / 2, height: this.height, width: 1 });
		new Body(this.physics, { type: 'static', x: this.width, y: this.height / 2, height: this.height, width: 1 });
		new Body(this.physics, { type: 'static', x: this.width / 2, y: -1, height: 1, width: this.width });
		new Body(this.physics, { type: 'static', x: this.width / 2, y: this.height, height: 1, width: this.width });
	}
}

class Hero {
	constructor ({ id = randomId(), maxSpeed = 10, jumpHeight = 25, jumpInterval = 1000, sprite = null }) {
		this.id = id;
		this.maxSpeed = maxSpeed;
		this.jumpHeight = jumpHeight;
		this.jumpInterval = jumpInterval;
		this.sprite = sprite;
		this.lastJump = 0;
	}
	get x () {
		return this.body ? this.body.GetPosition().x : undefined;
	}
	get y () {
		return this.body ? this.body.GetPosition().y : undefined;
	}
	addBody (physics, details = {}) {
		this.body = new Body(physics, details);
		this.body.SetFixedRotation(true);
		this.gravity = !!physics.gravity.y;
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
	speedLimit (x) {
		if (x < 0) {
			return Math.max(x, -this.maxSpeed);
		} else {
			return Math.min(x, this.maxSpeed);
		}
	}
	goto ({ x, y }) {
		const d = this.maxSpeed / distance(x, y);
		let newx = 0;
		let newy = 0;
		if (!this.gravity) {
			this.body.m_force.SetZero();
			newx = x * d;
			newy = y * d;
		} else {
			newx = this.speedLimit(x);
		}
		this.body.ApplyImpulse({ 
			x: newx, 
			y: newy,
		}, this.body.GetWorldCenter(), true);
	}
	jump (x = 0) {
		const now = NOW();
		// (this.body.m_force.y > 0) && 
		if (this.gravity && (now > this.lastJump + this.jumpInterval)) {
			this.lastJump = now;
			this.body.ApplyImpulse({ 
				x: x ? (this.gravity ? this.speedLimit(x) : x) : 0, 
				y: -this.jumpHeight 
			}, this.body.GetWorldCenter(), true);
		} else {
			this.goto({ x, y: 0 });
		}
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
	return md5(random()).slice(0, 7);
}

function distance (dx, dy) {
	return Math.sqrt(dx * dx + dy * dy);
}

function random () {
	return Math.floor(Math.random() * 1001) / 1000;
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
		random,
	};
}

})();
