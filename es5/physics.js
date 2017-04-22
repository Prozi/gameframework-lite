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
/******/ 	return __webpack_require__(__webpack_require__.s = 195);
/******/ })
/************************************************************************/
/******/ ({

/***/ 195:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
	'use strict';

	// special thanks to
	// http://buildnewgames.com/box2dweb/
	// wrapped up by me Jacek Pietal <prozi85@gmail.com>

	var Box2D = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"box2dweb\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	// box2d
	var b2Vec2 = Box2D.Common.Math.b2Vec2;
	var b2BodyDef = Box2D.Dynamics.b2BodyDef;
	var b2Body = Box2D.Dynamics.b2Body;
	var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	var b2Fixture = Box2D.Dynamics.b2Fixture;
	var b2World = Box2D.Dynamics.b2World;
	var b2MassData = Box2D.Collision.Shapes.b2MassData;
	var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
	var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

	var GRAVITY = 9.8;
	var BODIES_SLEEP = true;

	var Physics = function () {
		function Physics(_ref) {
			var _ref$scale = _ref.scale,
			    scale = _ref$scale === undefined ? 30 : _ref$scale,
			    _ref$gravity = _ref.gravity,
			    gravity = _ref$gravity === undefined ? GRAVITY : _ref$gravity;

			_classCallCheck(this, Physics);

			this.gravity = new b2Vec2(0, gravity);
			this.world = new b2World(this.gravity, BODIES_SLEEP);
			this.scale = scale;
			this.dtRemaining = 0;
			this.stepAmount = 1 / 60;
		}

		_createClass(Physics, [{
			key: 'step',
			value: function step() {
				var dt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

				this.dtRemaining += dt;
				while (this.dtRemaining > this.stepAmount) {
					this.dtRemaining -= this.stepAmount;
					this.world.Step(this.stepAmount, 8, // velocity iterations
					3); // position iterations
				}
				if (this.debugDraw) {
					this.world.DrawDebugData();
				}
			}
		}, {
			key: 'debug',
			value: function debug(context) {
				if (context) {
					this.debugDraw = new b2DebugDraw();
					this.debugDraw.SetSprite(context);
					this.debugDraw.SetDrawScale(this.scale);
					this.debugDraw.SetFillAlpha(0.3);
					this.debugDraw.SetLineThickness(1.0);
					this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
					this.world.SetDebugDraw(this.debugDraw);
				}
			}
		}]);

		return Physics;
	}();

	;

	var BODY_DEFAULTS = {
		shape: "block",
		width: 1,
		height: 1,
		radius: 0.5
	};

	var BODY_FIXTURE_DEFAULTS = {
		density: 2,
		friction: 1,
		restitution: 0.2
	};

	var BODY_DEFINITION_DEFAULTS = {
		active: true,
		allowSleep: true,
		angle: 0,
		angularVelocity: 0,
		awake: true,
		bullet: false,
		fixedRotation: false
	};

	var Body = function Body(physics) {
		var details = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		_classCallCheck(this, Body);

		// Create the definition
		var definition = new b2BodyDef();

		// Set up the definition
		for (var k in BODY_DEFINITION_DEFAULTS) {
			definition[k] = details[k] || BODY_DEFINITION_DEFAULTS[k];
		}
		definition.position = new b2Vec2(details.x || 0, details.y || 0);
		definition.linearVelocity = new b2Vec2(details.vx || 0, details.vy || 0);
		definition.userData = {};
		definition.type = details.type == "static" ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;

		// Create the Body
		var body = physics.world.CreateBody(definition);

		// Create the fixture
		var fixtureDef = new b2FixtureDef();
		for (var l in BODY_FIXTURE_DEFAULTS) {
			fixtureDef[l] = details[l] || BODY_FIXTURE_DEFAULTS[l];
		}

		details.shape = details.shape || BODY_DEFAULTS.shape;

		switch (details.shape) {
			case "circle":
				details.radius = details.radius || BODY_DEFAULTS.radius;
				fixtureDef.shape = new b2CircleShape(details.radius);
				break;
			case "polygon":
				fixtureDef.shape = new b2PolygonShape();
				fixtureDef.shape.SetAsArray(details.points, details.points.length);
				break;
			case "block":
			default:
				details.width = details.width || BODY_DEFAULTS.width;
				details.height = details.height || BODY_DEFAULTS.height;

				fixtureDef.shape = new b2PolygonShape();
				fixtureDef.shape.SetAsBox(details.width / 2, details.height / 2);
				break;
		}

		body.CreateFixture(fixtureDef);

		return body;
	};

	;

	if (true) {
		module.exports = {
			Physics: Physics,
			Body: Body,
			b2Vec2: b2Vec2
		};
	}
})();

/***/ })

/******/ });