const pgp = require('pgp')()
const connectionDatas = {
  user: 'user',
  password: 'password',
  host: 'postgres',
  port: 5432,
  database: 'babyfoot'
}

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
  connectToDatabase () {
    this.database = pgp(connectionDatas)
    _checkDatabaseConnection(this.database)
  },
  createNewGame (player1, player2) {
    return new Promise((resolve, reject) => {
      this.database.any(`INSERT INTO "Games" ("state", "players") VALUES (true, ARRAY['${player1}', '${player2}']::TEXT[]) RETURNING id;`)
        .then(data => {
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  deleteGame (id) {
    return new Promise((resolve, reject) => {
      this.database.any(`DELETE FROM "Games" WHERE id=${id} RETURNING id;`)
        .then(data => {
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  updateGameState (id) {
    return new Promise((resolve, reject) => {
      this.database.any(`UPDATE "Games" set "state"=NOT "state" WHERE id=${id} RETURNING id;`)
        .then(data => {
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getAllGames () {
    return new Promise((resolve, reject) => {
      this.database.any(`SELECT * FROM "Games" ORDER BY "dateCreated"`)
        .then(data => {
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}
