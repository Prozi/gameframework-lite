## gameframework

This is still under development.

I use it with success tho, feel free to open any issues/pull requests.

## examples (non-MIT)

Game made on it:

* [http://www.mini.ninja/vikings/](http://www.mini.ninja/vikings/)

### documentation

[https://prozi.github.io/gameframework-lite/](https://prozi.github.io/gameframework-lite/)

### installation

`npm install gameframework-lite@latest --save`

or

`yarn add gameframework-lite@latest --save`

### testing

* `yarn test`

* open `http://localhost:3000`

### usage

require 'gameframework/es6' for:

- DEFER,
- Game,
- Level,
- Block,
- Hero,
- atan2
- random

require 'gameframework/es6/view' for:

- View

### examples

```javascript
const View = require('gameframework-lite/es6/view');
const PIXI = window.PIXI || require('pixi.js');

// this is how you should use View
class MyView extends View {
	// override example
	onCreateHero (hero) {
		hero.sprite = PIXI.Sprite.fromImage('bunny.png');
		hero.sprite.anchor.set(0.5);
		hero.sprite.scale.set(3);
	}
}

new MyView();
```

```javascript
const { Level, Game } = require('gameframework-lite/es6');

// this is how you should use Game
class MyGame extends Game {
	// one room game example
	constructor () {
		super();
		this.levels.push(new Level());
	}
	// override what you need
	onUpdate () {
		console.log('tick');
	}
}

new MyGame();
```


`view example/index.html to see benchmark/test`


License MIT

made by me - Jacek Pietal (prozi85@gmail.com)

