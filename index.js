'use strict';

const FMath = require('fmath');
const fmath = new FMath();

// function constants
const DEFER = (typeof process !== 'undefined') ? process.nextTick : setTimeout;
const NOW = (typeof performance !== 'undefined') ? performance.now.bind(performance) : Date.now.bind(Date);

// variable constants
const HALF_PI = Math.PI / 2;

class Game {
	constructor (interval) {
		this.levels = [];
		this.interval = 100;
		this.now = NOW();
	}
	loop () {
		DEFER(this.tick.bind(this));
		setTimeout(this.loop.bind(this), this.interval);	
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
		this.heros = props.heros || [];
		this.blocks = props.blocks || {};
	}
	isFreeCell (x, y) {
		const block = this.blocks[`${x}:${y}`];
		if (block) {
			return !block.body.blocked;
		}
		return false;
	}
	tick ({ delta }) {
		this.heros.forEach((hero) => {
			DEFER(hero.tick.bind(hero, { level: this, delta }));
		})
	}
}

class Hero {
	constructor (props = {}) {
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
	tick ({ level, delta }) {
		if (this.body.speed) {
			const x = this.body.x + this.body.speed * fmath.cos(this.body.atan2) * delta;
			const y = this.body.y + this.body.speed * fmath.sin(this.body.atan2) * delta;
			if (level.isFreeCell(x, y)) {
				this.body.x = x;
				this.body.y = y;
			} else {
				this.speed = 0;
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
			return fmath.atan(y / x) + PI;
		}
		return fmath.atan(y / x) - PI;
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
