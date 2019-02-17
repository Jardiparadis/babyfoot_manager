/* eslint-env mocha */

const assert = require('assert')
const database = require('../app/database')

before(() => {
  database.connectToDatabase()
})

describe('Database', () => {
  it('Create a new game', () => {
    return database.createNewGame('player_1_name', 'player_2_name')
      .then((data) => {
        return database.database.one(`SELECT * FROM "Game" WHERE id=${data.id}`)
          .then((data) => {
            assert.strictEqual(data.players[0], 'player_1_name')
            assert.strictEqual(data.players[1], 'player_2_name')
            assert.strictEqual(data.state, true)
            return database.database.one(`DELETE FROM "Game" WHERE id=${data.id} RETURNING id;`)
          })
      })
  })

  it('Update game state', () => {
    let gameId = null
    return database.createNewGame('player_1_name', 'player_2_name')
      .then((data) => {
        gameId = data.id
        return database.updateGameState(data.id)
          .then((data) => {
            return database.database.one(`SELECT "state" FROM "Game" WHERE id=${data.id}`)
              .then((data) => {
                assert.strictEqual(data.state, false)
                return database.database.one(`DELETE FROM "Game" WHERE id=${gameId} RETURNING id;`)
              })
          })
      })
  })

  it('Get all games', () => {
    return database.createNewGame('player_all_1_name', 'player_all_2_name')
      .then(() => {
        return database.createNewGame('player_all_3_name', 'player_all_4_name')
          .then(() => {
            return database.getAllGames()
              .then((data) => {
                assert.strictEqual(data[0].players[0], 'player_all_1_name')
                assert.strictEqual(data[0].players[1], 'player_all_2_name')
                assert.strictEqual(data[1].players[0], 'player_all_3_name')
                assert.strictEqual(data[1].players[1], 'player_all_4_name')
                return database.database.any(`DELETE FROM "Game";`)
              })
          })
      })
  })

  it('Delete game', () => {
    let gameId = null
    return database.createNewGame('player_1_name', 'player_2_name')
      .then((data) => {
        gameId = data.id
        return database.deleteGame(gameId)
          .then(() => {
            return database.database.one('SELECT COUNT(*) FROM "Game"')
              .then((nbEntries) => {
                assert.strictEqual(parseInt(nbEntries.count), 0)
              })
          })
      })
  })

  after(() => {
    return database.database.any(`DELETE FROM "Game";`)
  })
})
