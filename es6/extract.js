(function () {
'use strict';

const PIXI = (typeof window !== 'undefined') ? 
	window.PIXI || 
	require('pixi.js') : 
	require('pixi.js');

class TextureExtractor {
	constructor({
		width,
		height,
		tilewidth,
		tileheight,
		tileset,
		offset,
		count,
		scaleMode
	}, folder = '') {
		this.width = width;
		this.height = height;
		this.tilewidth = tilewidth;
		this.tileheight = tileheight;
		this.tileset = PIXI.Texture.fromFrame(folder ? `${folder}/${tileset}` : tileset);
		this.offset = offset || 0;
		this.textureCache = {};
		this.scaleMode = scaleMode || PIXI.SCALE_MODES.NEAREST;
		if (count) {
			for (let i = 0; i < count; i++) {
				this.prepareTexture(i);
			}
		}
	}
	prepareTexture(frame) {
		const width = (this.width / this.tilewidth);
		const x = ((frame - this.offset) % width) * this.tilewidth;
		const y = Math.floor((frame - this.offset) / width) * this.tileheight;
		const rect = new PIXI.Rectangle(x, y, this.tilewidth, this.tileheight);

		this.textureCache[frame] = new PIXI.Texture(this.tileset, rect);
		this.textureCache[frame].baseTexture.scaleMode = this.scaleMode;
		this.textureCache[frame].cacheAsBitmap = true;
	}
	getFrame(frame) {
		if (!this.textureCache[frame]) {
			this.prepareTexture(frame);
		}
		return this.textureCache[frame];
	}
}

if (typeof module !== 'undefined') {
	module.exports = TextureExtractor;
}

})();
