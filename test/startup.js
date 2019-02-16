/* eslint-env mocha */

const assert = require('assert')
const database = require('../app/database')
let gameId = null

before(() => {
  database.connectToDatabase()
})

describe('Database', () => {
  it('Create a new game', () => {
    return database.createNewGame('player_1_name', 'player_2_name')
      .then((data) => {
        gameId = data[0].id
        return database.database.any(`SELECT * FROM "Game" WHERE id=${data[0].id}`)
          .then((data) => {
            assert.strictEqual(data[0].players[0], 'player_1_name')
            assert.strictEqual(data[0].players[1], 'player_2_name')
            assert.strictEqual(data[0].state, true)
          })
      })
  })

  it('Update game state', () => {
    return database.updateGameState(gameId)
      .then((data) => {
        return database.database.one(`SELECT "state" FROM "Game" WHERE id=${data[0].id}`)
          .then((data) => {
            assert.strictEqual(data.state, true)
          })
      })
  })
})
