const express = require('express')
const app = express()
const serverPort = 8089

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(serverPort, () => {
  console.log(`Server listening on port ${serverPort} !`)
})
// make api folder
