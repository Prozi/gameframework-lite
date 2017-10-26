[![Version](https://img.shields.io/npm/v/gameframework-lite.svg)](https://www.npmjs.com/gameframework-lite) 
[![Known Vulnerabilities](https://snyk.io/test/npm/gameframework-lite/badge.svg)](https://snyk.io/test/npm/gameframework-lite)

PIXI.js + Game Loop + Level Loop + Character Loop

Isomorphic, Scalable, Node.js package

## examples (non-MIT)

Games made on it:

* [http://www.stones.mini.ninja/](http://www.stones.mini.ninja/)

* [http://www.vikingsvillage.io/](http://www.vikingsvillage.io/)

### documentation

[https://prozi.github.io/gameframework-lite/](https://prozi.github.io/gameframework-lite/)

### installation

`npm install gameframework-lite@latest --save`

or

`yarn add gameframework-lite@latest --save`

### testing

* `yarn test`

* open `http://localhost:3000`

## usage

require 'gameframework-lite' for:

- DEFER,
- Game,
- Level,
- Block,
- Hero,
- atan2
- random

require 'gameframework-lite/view' for:

- View

require 'gameframework-lite/extract' for:

### Editions

We're using npm editions here so you can use `gameframework-lite/source/...` for `import/export`

or regular `gameframework-lite/es2015/...` for `require` syntax

or trust editions and just use `gameframework-lite`

### Texture Extractor

- [TextureExtractor](https://prozi.github.io/gameframework-lite/class/docs-src/extract.js~TextureExtractor.html)

### Examples

```javascript
const View = require('gameframework-lite/view');
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
const { Level, Game } = require('gameframework-lite');

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

### License

License MIT

### Author

made by me - Jacek Pietal (prozi85@gmail.com)

