'use strict'

const { Level } = require('./index')
const PIXI = (typeof window !== 'undefined') ? window.PIXI || require('pixi.js') : {}

class View {
  constructor (screenSize = 480, anchor = document.body) {
    this.screenSize = screenSize
    this.pixi = new PIXI.Application(window.innerWidth, window.innerHeight, {
      autoResize: false,
      roundPixels: true,
      clearBeforeRender: false,
      resolution: 1,
      autoStart: false
    })
    this.camera = new PIXI.Container()
    this.pixi.stage.addChild(this.camera)
    this.level = new Level()
    this.level.onUpdateHero = this._onUpdateHero.bind(this)
    this.level.onCreateHero = this._onCreateHero.bind(this)
    this.level.onRemoveHero = this._onRemoveHero.bind(this)
    anchor.appendChild(this.pixi.view)
    window.addEventListener('resize', this.onResize.bind(this), true)
    this.onResize()
  }
  get hero () {
    return this.level.heros[this.id]
  }
  cameraToHero (hero) {
    this.camera.x = Math.floor(-hero.sprite.x + window.innerWidth / 2 / this.scale)
    this.camera.y = Math.floor(-hero.sprite.y + window.innerHeight / 2 / this.scale)
  }
  onUpdateHero (hero) {
    // this is what you should override
  }
  _onUpdateHero (hero) {
    this.onUpdateHero(hero)
    if (hero.sprite) {
      hero.sprite.x = hero.x * this.level.accuracy
      hero.sprite.y = hero.y * this.level.accuracy
    }
  }
  // this is what you should override
  onCreateHero (hero) {
    hero.sprite = PIXI.Sprite.from('bunny.png')
    hero.sprite.anchor.set(0.5)
    hero.sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST
  }
  _onCreateHero (hero) {
    if (!hero.sprite) {
      this.onCreateHero(hero)
      if (hero.sprite) {
        const layer = (this.layers ? this.layers.heros : this.camera)
        hero.sprite.x = hero.x * this.level.accuracy
        hero.sprite.y = hero.y * this.level.accuracy
        layer.addChild(hero.sprite)
      }
    }
  }
  onRemoveHero (hero) {
    // this is what you should override
  }
  _onRemoveHero (hero) {
    this.onRemoveHero(hero)
    if (hero.sprite && hero.sprite.parent) {
      hero.sprite.parent.removeChild(hero.sprite)
    }
  }
  onResize () {
    this.scale = this.getScale()
    this.pixi.renderer.resize(window.innerWidth, window.innerHeight)
    this.pixi.stage.scale.set(this.scale)
  }
  getScale () {
    return +(Math.sqrt(window.innerWidth * window.innerHeight) / this.screenSize).toFixed(2)
  }
  getTexture (frame) {
    if (!this.textureCache[frame]) {
      // <-- tiled firstgid === 1
      const size = this.level.tileset.tilewidth
      const width = (this.level.tileset.imagewidth / this.level.tileset.tilewidth)
      const x = ((frame - 1) % width) * size
      const y = Math.floor((frame - 1) / width) * size
      this.textureCache[frame] = new PIXI.Texture(
        this.tileset, new PIXI.Rectangle(x, y, size, size)
      )
      this.textureCache[frame].baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST
    }
    return this.textureCache[frame]
  }
  createSprite (frame, nearest = PIXI.SCALE_MODES.NEAREST) {
    let sprite
    if (isFinite(frame)) {
      sprite = new PIXI.Sprite(this.getTexture(parseInt(frame, 10)))
    } else {
      sprite = PIXI.Sprite.from(frame)
    }
    sprite.texture.baseTexture.scaleMode = nearest
    return sprite
  }
  addBlock (x, y, block, layer = this.layers.blocks, nearest = PIXI.SCALE_MODES.NEAREST) {
    const sprite = this.createSprite(block, nearest)
    sprite.width = sprite.height = this.level.tileset.tilewidth
    sprite.x = Math.floor(this.level.tileset.tilewidth * x)
    sprite.y = Math.floor(this.level.tileset.tilewidth * y)
    sprite.anchor.set(0.5)
    layer.addChild(sprite)
  }
  addBlocks () {
    for (let y = 0; y < this.level.height; y++) {
      for (let x = 0; x < this.level.width; x++) {
        const block = this.level.blocks[`${x}:${y}`]
        if (block && Array.isArray(block)) {
          for (let i = 0; i < block.length; i++) {
            if (parseInt(block[i], 10)) {
              this.addBlock(x, y, block[i])
            }
          }
        }
      }
    }
  }
  createLevel (tiled) {
    this.textureCache = {}
    this.layers = {
      blocks: new PIXI.Container(),
      heros: new PIXI.Container()
    }
    this.tileset = PIXI.Texture.from(tiled.tilesets[0].image, false, PIXI.SCALE_MODES.NEAREST)
    this.camera.addChild(this.layers.blocks)
    this.camera.addChild(this.layers.heros)
    this.level.fromTiled(tiled)
    this.addBlocks()
  }
  _onMouseMove (event) {
    event.stopPropagation()
    const e = event.touches ? event.touches[0] : event
    this.mouse = {
      x: e.clientX,
      y: e.clientY
    }
    if (this.onMouseMove) {
      this.onMouseMove()
    }
  }
  _onMouseClick (event) {
    this._onMouseMove(event)
    if (this.onMouseClick) {
      this.onMouseClick()
    }
  }
  useMouse (disableContextMenu = false) {
    window.addEventListener('touchmove', this._onMouseMove.bind(this), false)
    window.addEventListener('touchstart', this._onMouseClick.bind(this), false)
    window.addEventListener('mousemove', this._onMouseMove.bind(this), false)
    window.addEventListener('mousedown', this._onMouseClick.bind(this), false)
    if (disableContextMenu) {
      this.disableContextMenu()
    }
  }
  disableContextMenu () {
    document.body.addEventListener('contextmenu', (event) => event.preventDefault(), false)
  }
}

exports.default = View
