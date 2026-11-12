import assert from 'node:assert/strict'
import test from 'node:test'
import { newGolf, moveGolf, drawGolf, newEights, canEights, moveEights, drawEights } from './rules.js'

test('Golf deals 35 exposed and covered cards and advances only adjacent ranks', () => {
  const game = newGolf(() => .5)
  assert.equal(game.columns.flat().length,35)
  assert.equal(game.stock.length,16)
  game.columns[0] = [{rank:13,suit:'spades'}]
  game.waste = {rank:1,suit:'clubs'}
  assert.equal(moveGolf(game,0),false)
  game.waste.rank = 12
  assert.ok(moveGolf(game,0))
  assert.equal(game.moved,1)
  assert.ok(drawGolf(game))
  assert.equal(game.stock.length,15)
})

test('Crazy Eights deals two surfer Jokers and playing one sets the active suit', () => {
  const game = newEights(() => .5)
  assert.equal([...game.player,...game.computer,...game.stock,...game.discard].filter(c=>c.rank===0).length,2)
  game.player = [{rank:0,suit:'joker'},{rank:7,suit:'hearts'}]
  game.computer = [{rank:3,suit:'clubs'}]
  game.stock = [{rank:4,suit:'clubs'}]
  assert.equal(moveEights(game,0,'joker'),false)
  assert.ok(moveEights(game,0,'hearts'))
  assert.equal(game.suit,'hearts')
  assert.ok(canEights(game,game.player[0]))
  assert.ok(moveEights(game,0,'hearts'))
  assert.equal(game.status,'won')
})

test('Drawing a playable card leaves it for the player to play', () => {
  const game = newEights(() => .5)
  game.discard = [{rank:5,suit:'clubs'}]
  game.suit = 'clubs'
  game.player = [{rank:6,suit:'spades'}]
  game.stock = [{rank:5,suit:'hearts'}]
  assert.ok(drawEights(game))
  assert.equal(game.player.length,2)
  assert.equal(game.drawn,true)
  assert.equal(drawEights(game),false)
})
