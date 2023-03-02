import http from 'http'
import SocketIO from 'socket.io'
import express from 'express'


const app = express()


app.set('view engine', 'pug')
app.set('views', __dirname + '/views')
app.use('/public', express.static(__dirname + '/public'))

app.get('/', (req, res) => res.render('home'))
app.get('/*', (req, res) => res.redirect('/'))

const httpServer = http.createServer(app)
const wsServer = SocketIO(httpServer)

wsServer.on('connection', (socket) => {
  socket.on('enter_room', (roomName, done) => {
    console.log(roomName)
    setTimeout(() => {
      done('Hello from backend')
    }, 5000);
  })
})

// const socekts = [];

// wss.on('connection', (socket) => {
//   socket['nickname'] = 'Anon'
//   socekts.push(socket)
//   console.log('Connected to Browser ✅')

//   socket.on('close', () => (console.log('Disconnected from Browser ❌')))
//   socket.on('message', (message) => {
//     const parsed = JSON.parse(message)

//     switch(parsed.type) {
//       case 'new_message':
//         socekts.forEach((aSocket) => {
//           aSocket.send(`${socket.nickname}: ${parsed.payload}`)
//         })
//         break;

//       case 'nickname':
//         socket['nickname'] = parsed.payload
//         break;
//     }
//   })
// })

httpServer.listen(3000, () => {
  console.log('Listening on http://localhost:3000')
})
