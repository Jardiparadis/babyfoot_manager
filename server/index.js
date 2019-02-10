const app = require('http').createServer((req, res) => {
  fs.readFile('./server/home.html', (err, data) => {
    res.writeHead(200)
    res.end(data)
  })
})
const io = require('socket.io')(app)
const fs = require('fs')
const db = require('./database')
const serverPort = 3100

db.connectToDatabase()

io.on('connection', function (socket) {
  //socket.emit('news', '<b>Salut<b>')
  socket.on('newGame', data => {
    let player1Name = data.player1
    let player2Name = data.player2
    db.createNewGame(player1Name, player2Name)
      .then((data) => {
        io.sockets.emit('newGame', { id: data[0].id, player1: player1Name, player2: player2Name })
      })
  })
  socket.on('deleteGame', data => {
    console.log(data)
    db.deleteGame(data)
      .then((data) => {
        io.sockets.emit('deleteGame', data[0].id)
      })
    console.log(data)
  })
  socket.on('toggleGame', data => {
    db.updateGameState(data)
      .then((data) => {
        socket.broadcast.emit('toggleGame', data[0].id)
      })
  })
})

app.listen(serverPort, () => {
  console.log(`Server listening on port ${app.address().port}.`)
})
// make api folder
