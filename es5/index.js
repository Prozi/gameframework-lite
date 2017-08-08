'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
	'use strict';

	var FMath = require('fmath');
	var md5 = require('md5');

	var fmath = new FMath();

	// function constants
	var DEFER = typeof process !== 'undefined' ? process.nextTick.bind(process) : setTimeout;
	var NOW = typeof performance !== 'undefined' ? performance.now.bind(performance) : Date.now.bind(Date);

	// just constants
	var HALF_PI = Math.PI / 2;

	var HERO_ID = 0;
	var HERO_X = 1;
	var HERO_Y = 2;

	var Game = function () {
		function Game() {
			var interval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;

			_classCallCheck(this, Game);

			this.levels = [];
			this.interval = interval;
			this.now = NOW();
		}

		_createClass(Game, [{
			key: 'loop',
			value: function loop() {
				var _this = this;

				DEFER(this.tick.bind(this));
				if (this.onUpdate) {
					DEFER(this.onUpdate.bind(this));
				}
				setTimeout(function () {
					return DEFER(_this.loop.bind(_this));
				}, this.interval);
			}
		}, {
			key: 'tick',
			value: function tick() {
				var _this2 = this;

				var now = NOW();
				this.delta = (now - this.now) / 1000;
				this.now = now;
				this.levels.forEach(function (map) {
					DEFER(map.tick.bind(map, _this2.delta));
				});
			}
		}]);

		return Game;
	}();

	var Level = function () {
		function Level() {
			var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			_classCallCheck(this, Level);

			var options = {};
			if (props.gravity) {
				options.gravity = props.gravity;
			}
			this.heros = props.heros || {};
			this.blocks = props.blocks || {};
			this.accuracy = 10;
		}

		_createClass(Level, [{
			key: 'spawn',
			value: function spawn(_ref) {
				var body = _ref.body;

				body.x = random() * this.width;
				body.y = 0;
			}
		}, {
			key: 'eachHero',
			value: function eachHero(callback) {
				for (var hero in this.heros) {
					if (this.heros.hasOwnProperty(hero)) {
						callback(this.heros[hero]);
					}
				}
			}
		}, {
			key: 'tick',
			value: function tick(delta) {
				console.log(delta);
			}
		}, {
			key: 'toArray',
			value: function toArray() {
				var array = [[]];
				this.eachHero(function (hero) {
					return array[0].push(hero.toArray());
				});
				return array;
			}
		}, {
			key: 'removeHero',
			value: function removeHero(hero) {
				if (this.onRemoveHero) {
					this.onRemoveHero(hero);
				}
				this.heros[hero.id] = null;
				delete this.heros[hero.id];
			}
		}, {
			key: 'fromArray',
			value: function fromArray() {
				var _this3 = this;

				var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
				var HeroClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Hero;

				this.eachHero(function (hero) {
					if (!array[0].find(function (heroArray) {
						return heroArray[HERO_ID] === hero.id;
					})) {
						_this3.removeHero(hero);
					}
				});
				array[0].forEach(function (heroArray) {
					var id = heroArray[HERO_ID];
					if (_this3.heros[id]) {
						_this3.updateHero(id, heroArray);
					} else {
						_this3.addHero(heroArray, HeroClass);
					}
				});
				if (this.fromArrayExtension) {
					this.fromArrayExtension(array);
				}
			}
		}, {
			key: 'updateHero',
			value: function updateHero(id) {
				var heroArray = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

				this.heros[id].fromArray(heroArray);
				if (this.onUpdateHero) {
					this.onUpdateHero(this.heros[id]);
				}
			}
		}, {
			key: 'addHero',
			value: function addHero() {
				var heroArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
				var HeroClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Hero;

				var id = heroArray[HERO_ID] || randomId();
				this.heros[id] = new HeroClass({ id: id });
				this.heros[id].x = heroArray[HERO_X] || this.width * random();
				this.heros[id].y = heroArray[HERO_Y] || 0;
				this.heros[id].fromArray(heroArray);
				if (this.onCreateHero) {
					this.onCreateHero(this.heros[id]);
				}
				return this.heros[id];
			}
		}, {
			key: 'fromTiled',
			value: function fromTiled() {
				var tiled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

				this.width = tiled.width;
				this.height = tiled.height;
				this.blocks = {};
				this.stops = {};
				this.tileset = {
					tilewidth: tiled.tilesets[0].tilewidth,
					imagewidth: tiled.tilesets[0].imagewidth
				};
				this.accuracy = this.tileset.tilewidth;
				for (var y = 0; y < this.height; y++) {
					for (var x = 0; x < this.width; x++) {
						var pos = y * this.width + x;
						var offset = x + ':' + y;
						this.blocks[offset] = [tiled.layers[0].data[pos], tiled.layers[1].data[pos]];
						this.stops[offset] = tiled.layers[2].data[pos];
					}
				}
			}
		}]);

		return Level;
	}();

	var Hero = function () {
		function Hero(_ref2) {
			var _ref2$id = _ref2.id,
			    id = _ref2$id === undefined ? randomId() : _ref2$id,
			    _ref2$sprite = _ref2.sprite,
			    sprite = _ref2$sprite === undefined ? null : _ref2$sprite;

			_classCallCheck(this, Hero);

			this.id = id;
			this.sprite = sprite;
			this.x = undefined;
			this.y = undefined;
		}

		_createClass(Hero, [{
			key: 'toArray',
			value: function toArray() {
				return [this.id, this.x, this.y];
			}
		}, {
			key: 'fromArray',
			value: function fromArray() {
				var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
				var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

				if (force) {
					this.id = array[HERO_ID];
				}
				if (force || this.id === array[HERO_ID]) {
					this.move(array[HERO_X], array[HERO_Y]);
				}
			}
		}, {
			key: 'move',
			value: function move(x, y) {
				this.x = x;
				this.y = y;
			}
		}]);

		return Hero;
	}();

	function atan2(y, x) {
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

	function randomId() {
		return md5(random()).slice(0, 7);
	}

	function distance(dx, dy) {
		return Math.sqrt(dx * dx + dy * dy);
	}

	function random() {
		return Math.floor(Math.random() * 1001) / 1000;
	}

	if (typeof module !== 'undefined') {
		module.exports = {
			DEFER: DEFER,
			Game: Game,
			Level: Level,
			Hero: Hero,
			atan2: atan2,
			randomId: randomId,
			distance: distance,
			random: random
		};
	}
})();