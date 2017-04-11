/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 196);
/******/ })
/************************************************************************/
/******/ ({

/***/ 17:
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ 196:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = __webpack_require__(22),
    Game = _require.Game,
    Level = _require.Level,
    Hero = _require.Hero;

var MyGame = function (_Game) {
	_inherits(MyGame, _Game);

	function MyGame() {
		_classCallCheck(this, MyGame);

		var _this = _possibleConstructorReturn(this, (MyGame.__proto__ || Object.getPrototypeOf(MyGame)).call(this, 20));

		_this.levels.push(new Level());
		for (var x = 0; x < 10; x++) {
			_this.levels[0].addHero([null, Math.random() * 48 + 5, Math.random() * 24 + 5]);
		}
		// start game
		_this.loop();
		return _this;
	}

	_createClass(MyGame, [{
		key: 'onUpdate',
		value: function onUpdate() {
			var level = this.levels[0];
			postMessage(level.toArray());
			// level.eachHero((hero) => {
			// 	if (Math.random() < 0.1) {
			// 		hero.goto({
			// 			x: (Math.random() - 0.499) * 10,
			// 			y: (Math.random() - 0.499) * 10,
			// 		});
			// 	}
			// });
		}
	}]);

	return MyGame;
}(Game);

new MyGame();

/***/ }),

/***/ 22:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
	'use strict';

	var FMath = __webpack_require__(23);
	var md5 = __webpack_require__(24);

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

	if (true) {
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(17)))

/***/ }),

/***/ 23:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
	if (true) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
			return (root.FMath = factory());
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory();
	} else {
		root.FMath = factory();
	}
}(this, function () {
	var PI2 = Math.PI * 2;

	FMath.DEFAULT_PARAMS = {
		resolution: 360,
		minAtan: -40,
		maxAtan: 40
	};

	/**
	 * FMath constructor
	 * @param {Object} params - passed to the constructor
	 * @param {number} [params.resolution] - # of cached values for any function. Is overriden by optional specific values
	 * @param {number} [params.nbSin] - # of cached values for FMath#sin (defaults to the resolution)
	 * @param {number} [params.nbCos] - # of cached values for FMath#cos (defaults to the resolution)
	 * @param {number} [params.nbAtan] - # of caches values for FMath#atan (defaults to the resolution)
	 * @param {number} [params.minAtan] - Minimal value for the caching of atan (default: -20) - If asking a lower value, will return the lowest known
	 * @param {number} [params.maxAtan] - Maximal value for the caching of atan (default: 20) - If asking ahigher value, will return the highest known
	 */
	function FMath (params) {
		this.params = FMath._assign(null, FMath.DEFAULT_PARAMS, params);
		FMath._setDefaultValues(this.params);

		this.cosTable = new Float32Array(this.params.nbCos);
		this.cosFactor = this.params.nbCos / PI2;
		FMath._fillCache(this.cosTable, this.cosFactor, Math.cos);

		this.sinTable = new Float32Array(this.params.nbSin);
		this.sinFactor = this.params.nbSin / PI2;
		FMath._fillCache(this.sinTable, this.sinFactor, Math.sin);

		this.atanTable = new Float32Array(this.params.nbAtan);
		this.atanFactor = this.params.nbAtan / (this.params.maxAtan - this.params.minAtan)
		FMath._fillAtanCache(this.atanTable, this.atanFactor, this.params.minAtan);
	};

	FMath.prototype.cos = function (angle) {
		angle %= PI2;
		if (angle < 0) angle += PI2;
		return this.cosTable[(angle * this.cosFactor) | 0];
	};
	FMath.prototype.sin = function (angle) {
		angle %= PI2;
		if (angle < 0) angle += PI2;
		return this.sinTable[(angle * this.sinFactor) | 0];
	};
	FMath.prototype.atan = function (tan) {
		var index = ((tan - this.params.minAtan) * this.atanFactor) | 0;
		if (index < 0) {
			return - Math.PI / 2;
		} else if (index >= this.params.nbAtan) {
			return Math.PI / 2;
		}
		return this.atanTable[index];
	};

	FMath._setDefaultValues = function (params) {
		var functionNames = ["nbSin", "nbCos", "nbAtan"];
		for (var i = functionNames.length - 1; i >= 0; i--) {
			var key = functionNames[i];
			params[key] = params[key] || params.resolution;
		}
	};

	FMath._fillAtanCache = function (array, factor, min) {
		for (var i = 0; i < array.length; i++) {
			var tan = min + i / factor;
			array[i] = Math.atan(tan);
		}
	};

	FMath._fillCache = function (array, factor, mathFunction) {
		var length = array.length;
		for (var i = 0; i < length; i++) {
			array[i] = mathFunction(i / factor);
		}
	};

	FMath._assign = function (dst, src1, src2, etc) {
		return [].reduce.call(arguments, function (dst, src) {
			src = src || {};
			for (var k in src) {
				if (src.hasOwnProperty(k)) {
					dst[k] = src[k];
				}
			}
			return dst;
		}, dst || {});
	};

	return FMath;
}));


/***/ }),

/***/ 24:
/***/ (function(module, exports, __webpack_require__) {

(function(){
  var crypt = __webpack_require__(26),
      utf8 = __webpack_require__(9).utf8,
      isBuffer = __webpack_require__(27),
      bin = __webpack_require__(9).bin,

  // The core
  md5 = function (message, options) {
    // Convert to byte array
    if (message.constructor == String)
      if (options && options.encoding === 'binary')
        message = bin.stringToBytes(message);
      else
        message = utf8.stringToBytes(message);
    else if (isBuffer(message))
      message = Array.prototype.slice.call(message, 0);
    else if (!Array.isArray(message))
      message = message.toString();
    // else, assume byte array already

    var m = crypt.bytesToWords(message),
        l = message.length * 8,
        a =  1732584193,
        b = -271733879,
        c = -1732584194,
        d =  271733878;

    // Swap endian
    for (var i = 0; i < m.length; i++) {
      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
             ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
    }

    // Padding
    m[l >>> 5] |= 0x80 << (l % 32);
    m[(((l + 64) >>> 9) << 4) + 14] = l;

    // Method shortcuts
    var FF = md5._ff,
        GG = md5._gg,
        HH = md5._hh,
        II = md5._ii;

    for (var i = 0; i < m.length; i += 16) {

      var aa = a,
          bb = b,
          cc = c,
          dd = d;

      a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
      d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
      c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
      b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
      a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
      d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
      c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
      b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
      a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
      d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
      c = FF(c, d, a, b, m[i+10], 17, -42063);
      b = FF(b, c, d, a, m[i+11], 22, -1990404162);
      a = FF(a, b, c, d, m[i+12],  7,  1804603682);
      d = FF(d, a, b, c, m[i+13], 12, -40341101);
      c = FF(c, d, a, b, m[i+14], 17, -1502002290);
      b = FF(b, c, d, a, m[i+15], 22,  1236535329);

      a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
      d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
      c = GG(c, d, a, b, m[i+11], 14,  643717713);
      b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
      a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
      d = GG(d, a, b, c, m[i+10],  9,  38016083);
      c = GG(c, d, a, b, m[i+15], 14, -660478335);
      b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
      a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
      d = GG(d, a, b, c, m[i+14],  9, -1019803690);
      c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
      b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
      a = GG(a, b, c, d, m[i+13],  5, -1444681467);
      d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
      c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
      b = GG(b, c, d, a, m[i+12], 20, -1926607734);

      a = HH(a, b, c, d, m[i+ 5],  4, -378558);
      d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
      c = HH(c, d, a, b, m[i+11], 16,  1839030562);
      b = HH(b, c, d, a, m[i+14], 23, -35309556);
      a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
      d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
      c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
      b = HH(b, c, d, a, m[i+10], 23, -1094730640);
      a = HH(a, b, c, d, m[i+13],  4,  681279174);
      d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
      c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
      b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
      a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
      d = HH(d, a, b, c, m[i+12], 11, -421815835);
      c = HH(c, d, a, b, m[i+15], 16,  530742520);
      b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

      a = II(a, b, c, d, m[i+ 0],  6, -198630844);
      d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
      c = II(c, d, a, b, m[i+14], 15, -1416354905);
      b = II(b, c, d, a, m[i+ 5], 21, -57434055);
      a = II(a, b, c, d, m[i+12],  6,  1700485571);
      d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
      c = II(c, d, a, b, m[i+10], 15, -1051523);
      b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
      a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
      d = II(d, a, b, c, m[i+15], 10, -30611744);
      c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
      b = II(b, c, d, a, m[i+13], 21,  1309151649);
      a = II(a, b, c, d, m[i+ 4],  6, -145523070);
      d = II(d, a, b, c, m[i+11], 10, -1120210379);
      c = II(c, d, a, b, m[i+ 2], 15,  718787259);
      b = II(b, c, d, a, m[i+ 9], 21, -343485551);

      a = (a + aa) >>> 0;
      b = (b + bb) >>> 0;
      c = (c + cc) >>> 0;
      d = (d + dd) >>> 0;
    }

    return crypt.endian([a, b, c, d]);
  };

  // Auxiliary functions
  md5._ff  = function (a, b, c, d, x, s, t) {
    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._gg  = function (a, b, c, d, x, s, t) {
    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._hh  = function (a, b, c, d, x, s, t) {
    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._ii  = function (a, b, c, d, x, s, t) {
    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };

  // Package private blocksize
  md5._blocksize = 16;
  md5._digestsize = 16;

  module.exports = function (message, options) {
    if (message === undefined || message === null)
      throw new Error('Illegal argument ' + message);

    var digestbytes = crypt.wordsToBytes(md5(message, options));
    return options && options.asBytes ? digestbytes :
        options && options.asString ? bin.bytesToString(digestbytes) :
        crypt.bytesToHex(digestbytes);
  };

})();


/***/ }),

/***/ 26:
/***/ (function(module, exports) {

(function() {
  var base64map
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

  crypt = {
    // Bit-wise rotation left
    rotl: function(n, b) {
      return (n << b) | (n >>> (32 - b));
    },

    // Bit-wise rotation right
    rotr: function(n, b) {
      return (n << (32 - b)) | (n >>> b);
    },

    // Swap big-endian to little-endian and vice versa
    endian: function(n) {
      // If number given, swap endian
      if (n.constructor == Number) {
        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
      }

      // Else, assume array and swap all items
      for (var i = 0; i < n.length; i++)
        n[i] = crypt.endian(n[i]);
      return n;
    },

    // Generate an array of any length of random bytes
    randomBytes: function(n) {
      for (var bytes = []; n > 0; n--)
        bytes.push(Math.floor(Math.random() * 256));
      return bytes;
    },

    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function(bytes) {
      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
        words[b >>> 5] |= bytes[i] << (24 - b % 32);
      return words;
    },

    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function(words) {
      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: function(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
      }
      return hex.join('');
    },

    // Convert a hex string to a byte array
    hexToBytes: function(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    },

    // Convert a byte array to a base-64 string
    bytesToBase64: function(bytes) {
      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++)
          if (i * 8 + j * 6 <= bytes.length * 8)
            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
          else
            base64.push('=');
      }
      return base64.join('');
    },

    // Convert a base-64 string to a byte array
    base64ToBytes: function(base64) {
      // Remove non-base-64 characters
      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
          imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
      }
      return bytes;
    }
  };

  module.exports = crypt;
})();


/***/ }),

/***/ 27:
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),

/***/ 9:
/***/ (function(module, exports) {

var charenc = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },

  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
        bytes.push(str.charCodeAt(i) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        str.push(String.fromCharCode(bytes[i]));
      return str.join('');
    }
  }
};

module.exports = charenc;


/***/ })

/******/ });