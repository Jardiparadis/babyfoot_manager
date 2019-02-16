const pgp = require('pgp')()
const connectionDatas = {
  user: 'user',
  password: 'password',
  host: 'postgres',
  port: 5432,
  database: 'babyfoot'
}

/**
 * Try a request on the database to check if connected
 * @param database The pgp database object to test
 * @private
 */
function _checkDatabaseConnection (database) {
  database.proc('version')
    .then(data => {
      console.log('Database successfully connected')
    })
    .catch(error => {
      console.error(`Cannot connect to database: ${error}`)
      process.exit()
    })
}

module.exports = {
  database: null,

  /* Connect to the database with the settings of the connectionDatas object */
  connectToDatabase () {
    this.database = pgp(connectionDatas)
    _checkDatabaseConnection(this.database)
  },

  /**
   * Insert a new game into the database,
   * and resolve the promise with the id of the newly created game as parameter
   * @param player1Name The first player name
   * @param player2Name The second player name
   * @returns {Promise<any>}
   */
  createNewGame (player1Name, player2Name) {
    return new Promise((resolve, reject) => {
      this.database.any(`INSERT INTO "Game" ("state", "players") VALUES (true, ARRAY['${player1Name}', '${player2Name}']::TEXT[]) RETURNING id;`)
        .then(data => {
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },

  /**
   * Delete a game from the database by his id
   * and resolve the promise with the id of the deleted game as parameter
   * @param id The id of the game to delete
   * @returns {Promise<any>}
   */
  deleteGame (id) {
    return new Promise((resolve, reject) => {
      this.database.any(`DELETE FROM "Game" WHERE id=${id} RETURNING id;`)
        .then(data => {
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },

  /**
   * Update the state of the game (enable/disabled)
   * and resolve the promise with the id of the updated game as parameter
   * @param id Id of the game to update
   * @returns {Promise<any>}
   */
  updateGameState (id) {
    return new Promise((resolve, reject) => {
      this.database.any(`UPDATE "Game" set "state"=NOT "state" WHERE id=${id} RETURNING id;`)
        .then(data => {
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },

  /**
   * Return all games in the database
   * @returns {Promise<any>}
   */
  getAllGames () {
    return new Promise((resolve, reject) => {
      this.database.any(`SELECT * FROM "Game" ORDER BY "dateCreated"`)
        .then(data => {
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}
