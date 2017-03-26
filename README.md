## gameframework

### installation

`npm install gameframework --save`

or

`yarn add gameframework --save`

### testing

`use yarn test to test`

### usage

require 'gameframework' for:

- DEFER,
- Game,
- Level,
- Block,
- Hero,
- atan2


require 'gameframework/view' for:

- View

### examples

```javascript
const View = require('gameframework/view');

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
const { Level, Game } = require('gameframework');

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

