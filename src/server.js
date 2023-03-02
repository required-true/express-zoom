import http from 'http'
import express from 'express'
import WebSocket from 'ws'

const app = express()

app.set('view engine', 'pug')
app.set('views', __dirname + '/views')
app.use('/public', express.static(__dirname + '/public'))

app.get('/', (req, res) => res.render('home'))
app.get('/*', (req, res) => res.redirect('/'))

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

const socekts = [];

wss.on('connection', (socket) => {
  socekts.push(socket)
  console.log('Connected to Browser ✅')
  socket.on('close', () => (console.log('Disconnected from Browser ❌')))
  socket.on('message', (message) => {
    socekts.forEach((aSocket) => {
      aSocket.send(message.toString('utf8'))
    })
  })
})

server.listen(3000, () => {
  console.log('Listening on http://localhost:3000')
})
