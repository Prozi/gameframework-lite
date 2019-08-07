(function () {
'use strict';

// special thanks to
// http://buildnewgames.com/box2dweb/
// wrapped up by me Jacek Pietal <prozi85@gmail.com>

const Box2D = require('box2d-es6');

// box2d
const b2Vec2 = Box2D.Common.Math.b2Vec2;
const b2BodyDef = Box2D.Dynamics.b2BodyDef;
const b2Body = Box2D.Dynamics.b2Body;
const b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
const b2Fixture = Box2D.Dynamics.b2Fixture;
const b2World = Box2D.Dynamics.b2World;
const b2MassData = Box2D.Collision.Shapes.b2MassData;
const b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
const b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
const b2DebugDraw = Box2D.Dynamics.b2DebugDraw;	

const GRAVITY = 9.8;
const BODIES_SLEEP = true;

class Physics {
	constructor ({ scale = 30, gravity = GRAVITY }) {
		this.gravity = new b2Vec2(0, gravity);
		this.world = new b2World(this.gravity, BODIES_SLEEP);
		this.scale = scale;
		this.dtRemaining = 0;
		this.stepAmount = 1 / 60;
	}
	step (dt = 0) {
		this.dtRemaining += dt;
		while (this.dtRemaining > this.stepAmount) {
			this.dtRemaining -= this.stepAmount;
			this.world.Step(this.stepAmount,
			8, // velocity iterations
			3); // position iterations
		}
		if (this.debugDraw) {
			this.world.DrawDebugData();
		}
	}
	debug (context) {
		if (context) {
			this.debugDraw = new b2DebugDraw();
			this.debugDraw.SetSprite(context);
			this.debugDraw.SetDrawScale(this.scale);
			this.debugDraw.SetFillAlpha(0.3);
			this.debugDraw.SetLineThickness(1.0);
			this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			this.world.SetDebugDraw(this.debugDraw);
		}
	};
};

const BODY_DEFAULTS = {
	shape: "block",
	width: 1,
	height: 1,
	radius: 0.5
};

const BODY_FIXTURE_DEFAULTS = {
	density: 2,
	friction: 1,
	restitution: 0.2
};

const BODY_DEFINITION_DEFAULTS = {
	active: true,
	allowSleep: true,
	angle: 0,
	angularVelocity: 0,
	awake: true,
	bullet: false,
	fixedRotation: false
};

class Body {
	constructor (physics, details = {}) {

		// Create the definition
		const definition = new b2BodyDef();

		// Set up the definition
		for (let k in BODY_DEFINITION_DEFAULTS) {
			definition[k] = details[k] || BODY_DEFINITION_DEFAULTS[k];
		}
		definition.position = new b2Vec2(details.x || 0, details.y || 0);
		definition.linearVelocity = new b2Vec2(details.vx || 0, details.vy || 0);
		definition.userData = {};
		definition.type = details.type == "static" ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;

		// Create the Body
		const body = physics.world.CreateBody(definition);

		// Create the fixture
		const fixtureDef = new b2FixtureDef();
		for (let l in BODY_FIXTURE_DEFAULTS) {
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
				fixtureDef.shape.SetAsBox(
					details.width / 2,
					details.height / 2
				);
				break;
		}

		body.CreateFixture(fixtureDef);

		return body;
	}
};

if (typeof module !== 'undefined') {
	module.exports = {
		Physics,
		Body,
		b2Vec2
	};
}

})();
