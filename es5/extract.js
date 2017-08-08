'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
	'use strict';

	var PIXI = typeof window !== 'undefined' ? window.PIXI || require('pixi.js') : require('pixi.js');

	var TextureExtractor = function () {
		function TextureExtractor(_ref) {
			var width = _ref.width,
			    height = _ref.height,
			    tilewidth = _ref.tilewidth,
			    tileheight = _ref.tileheight,
			    tileset = _ref.tileset,
			    offset = _ref.offset,
			    count = _ref.count,
			    scaleMode = _ref.scaleMode;
			var folder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

			_classCallCheck(this, TextureExtractor);

			this.width = width;
			this.height = height;
			this.tilewidth = tilewidth;
			this.tileheight = tileheight;
			this.tileset = PIXI.Texture.fromFrame(folder ? folder + '/' + tileset : tileset);
			this.offset = offset || 0;
			this.textureCache = {};
			this.scaleMode = scaleMode || PIXI.SCALE_MODES.NEAREST;
			if (count) {
				for (var i = 0; i < count; i++) {
					this.prepareTexture(i);
				}
			}
		}

		_createClass(TextureExtractor, [{
			key: 'prepareTexture',
			value: function prepareTexture(frame) {
				var width = this.width / this.tilewidth;
				var x = (frame - this.offset) % width * this.tilewidth;
				var y = Math.floor((frame - this.offset) / width) * this.tileheight;
				var rect = new PIXI.Rectangle(x, y, this.tilewidth, this.tileheight);

				this.textureCache[frame] = new PIXI.Texture(this.tileset, rect);
				this.textureCache[frame].baseTexture.scaleMode = this.scaleMode;
				this.textureCache[frame].cacheAsBitmap = true;
			}
		}, {
			key: 'getFrame',
			value: function getFrame(frame) {
				if (!this.textureCache[frame]) {
					this.prepareTexture(frame);
				}
				return this.textureCache[frame];
			}
		}]);

		return TextureExtractor;
	}();

	if (typeof module !== 'undefined') {
		module.exports = TextureExtractor;
	}
})();