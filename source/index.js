const FMath = require('fmath')
const fmath = new FMath()
const gameloop = require('node-gameloop')

// for universal time processing functions
const IS_BACKEND = (typeof window === 'undefined')

// next cycle run universal function
const nextCycle = IS_BACKEND ? setImmediate : setTimeout

// get current time in nano seconds universal
const getTime = IS_BACKEND ? getTimeNode : getTimeBrowser

class Game {
	constructor (interval = 16) {
		this.levels = []
		this.loopId = gameloop.setGameLoop(this.loop.bind(this), interval)
		this.interval = interval
	}
	tickLevel (level) {
		level.tick(delta)
	}
	loop (delta) {
		this.levels.forEach(this.tickLevel.bind(this))
	}
}

class Level {
	constructor (props = {}) {
		this.heros = props.heros || {}
		this.blocks = props.blocks || {}
	}
	each (set, callback) {
		Object.keys(set).forEach((id) => callback(set[id]))
	}
	eachHero (callback) {
		this.each(this.heros, callback)
	}
	tick (delta) {
		console.log(delta)
	}
	toArray () {
		const array = [[]]
		this.eachHero((hero) => array[0].push(hero.toArray()))
		return array
	}
	removeHero (hero) {
		if (this.onRemoveHero) {
			this.onRemoveHero(hero)
		}
		this.heros[hero.id] = null
		delete this.heros[hero.id]		
	}
	fromArray (array = [], HeroClass = Hero) {
		this.eachHero((hero) => {
			if (!array[0].find((heroArray) => heroArray[HERO_ID] === hero.id)) {
				this.removeHero(hero)
			}
		})
		array[0].forEach((heroArray) => {
			const id = heroArray[HERO_ID]
			if (this.heros[id]) {
				this.updateHero(id, heroArray)
			} else {
				this.addHero(heroArray, HeroClass)
			}
		})
		if (this.fromArrayExtension) {
			this.fromArrayExtension(array)
		}
	}
	updateHero (id, heroArray = []) {
		this.heros[id].fromArray(heroArray)
		if (this.onUpdateHero) {
			this.onUpdateHero(this.heros[id])
		}
	}
	addHero (heroArray = [], HeroClass = Hero) {
		const id = heroArray[HERO_ID] || randomId()
		this.heros[id] = new HeroClass({ id })
		this.heros[id].x = heroArray[HERO_X] || this.width * random()
		this.heros[id].y = heroArray[HERO_Y] || 0
		this.heros[id].fromArray(heroArray)
		if (this.onCreateHero) {
			this.onCreateHero(this.heros[id])
		}
		return this.heros[id]
	}
	fromTiled (tiled = {}) {
		this.width  = tiled.width
		this.height = tiled.height
		this.blocks = {}
		this.stops  = {}
		this.tileset = {
			tilewidth: tiled.tilesets[0].tilewidth,
			imagewidth: tiled.tilesets[0].imagewidth,
		}
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				const pos = y * this.width + x
				const offset = `${x}:${y}`
				this.blocks[offset] = [
					tiled.layers[0].data[pos], 
					tiled.layers[1].data[pos]
				]
				this.stops[offset] = tiled.layers[2].data[pos]
			}
		}
	}
}

class Hero {
	constructor ({ id = randomId() }) {
		this.id = id
		this.x = undefined
		this.y = undefined
	}
	toArray () {
		return [
			this.id,
			this.x,
			this.y,
		]
	}
	fromArray (array = [], force = false) {
		if (force) {
			this.id = array[HERO_ID]
		}
		if (force || (this.id === array[HERO_ID])) {
			this.move(array[HERO_X], array[HERO_Y])
		}
	}
	move (x, y) {
		this.x = x
		this.y = y
	}
}

// time specific constants
const s2nano = 1e9
const s2ms = 1e3
const ms2s = 1 / s2ms
const nano2s = 1 / s2nano
const ms2nano = 1e6

// gameframework-lite specific
const HERO_ID = 0
const HERO_X = 1
const HERO_Y = 2

// optimisations
const HALF_PI = Math.PI / 2

// returns in ms
function getTimeNode() {
	var hrtime = process.hrtime()
	return (hrtime[0] + hrtime[1] * nano2s) * s2ms
}

// returns in ms
function getTimeBrowser() {
	return Date.now()
}

function atan2 (y, x) {
	if (x > 0) {
		return fmath.atan(y / x)
	}
	if (x < 0) {
		if (y >= 0) {
			return fmath.atan(y / x) + Math.PI
		}
		return fmath.atan(y / x) - Math.PI
	}
	if (x === 0) {
		if (y === 0) {
			return undefined
		}
		if (y > 0) {
			return HALF_PI
		}
		if (y < 0) {
			return -HALF_PI
		}
	}
}

function random () {
	return Math.floor(Math.random() * 1001) / 1000
}

function randomId () {
	return Math.random().toString(36).slice(2, 7)
}

exports.getTime = getTime
exports.nextCycle = nextCycle
exports.Game = Game
exports.Level = Level
exports.Hero = Hero
exports.sin = fmath.sin.bind(fmath)
exports.cos = fmath.cos.bind(fmath)
exports.atan2 = atan2
exports.random = random
exports.randomId = randomId
