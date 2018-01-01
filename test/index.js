'use strict'

console.log('require')
const gf = require('../es2015')
const express = require('express')
const app = express()

app.use(express.static('example'))
app.listen(3000)

console.log('test Game()')
const game = new gf.Game()

console.log('test Hero()')
for (let l = 0; l < 99; l++) {
	const heros = {}
	const hero = new gf.Hero({})
	hero.x = 0
	hero.y = 0
	heros[hero.id] = hero
	const level = new gf.Level({ heros: heros })
	game.levels.push(level)
}

console.log('test loop()')
game.loop()
