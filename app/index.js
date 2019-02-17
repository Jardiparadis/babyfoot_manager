const app = require('http').createServer(newConnectionHandler)
const io = require('socket.io')(app)
const fs = require('fs')
const path = require('path')
const db = require('./database')
const serverPort = 3100

db.connectToDatabase()

/**
 * Return the home page to the client on connection
 * @param req Request object
 * @param res Response object
 */
function newConnectionHandler (req, res) {
  fs.readFile(path.join('app', 'home.html'), (err, data) => {
    if (err) {
      res.writeHead(404)
      res.end('Cannot get the html file')
      return
    }
    res.writeHead(200)
    res.end(data)
  })
}

/**
 * When a client has just connected, send the list of all created games to it
 */
io.on('connection', function (socket) {
  db.getAllGames()
    .then((data) => {
      for (const game of data) {
        socket.emit('newGame', {
          id: game.id,
          state: game.state,
          player1: game.players[0],
          player2: game.players[1]
        })
      }
    })
  /**
   * When a client create a new game, add it to the database, and broadcast the info to all clients
   */

  socket.on('newGame', data => {
    let player1Name = data.player1
    let player2Name = data.player2
    db.createNewGame(player1Name, player2Name)
      .then((data) => {
        io.sockets.emit('newGame', {
          id: data.id,
          state: true,
          player1: player1Name,
          player2: player2Name
        })
      })
  })
  /**
   * When a client delete a game, delete it from the database, and broadcast the info to all clients
   */

  socket.on('deleteGame', data => {
    db.deleteGame(data)
      .then((data) => {
        io.sockets.emit('deleteGame', data.id)
      })
  })

  /**
   * When a client enable/disable a game, update the game state in database and
   * broadcast the change to all clients except the one which triggered the event
   */
  socket.on('toggleGame', data => {
    db.updateGameState(data)
      .then((data) => {
        socket.broadcast.emit('toggleGame', data.id)
      })
  })
})

app.listen(serverPort, () => {
  console.log(`Server listening on port ${app.address().port}.`)
})
