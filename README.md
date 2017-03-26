## gameframework


`use yarn test to test`


require index.js for:

- DEFER,
- Game,
- Level,
- Block,
- Hero,
- atan2

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


`view index.html to see benchmark/test`


License MIT

made by me - Jacek Pietal (prozi85@gmail.com)

