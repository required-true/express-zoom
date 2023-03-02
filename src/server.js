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

  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`)
  })

  socket.on('enter_room', (nickName, roomName, done) => {
    socket['nickname'] = nickName
    socket.join(roomName)
    done()
    socket.to(roomName).emit('welcome', socket.nickname)
  })

  socket.on('new_message', (msg, room, done) => {
    socket.to(room).emit('new_message', `${socket.nickname}: ${msg}`)
    done()
  })

  socket.on('disconnecting', () => {
    socket.rooms.forEach((roomName) => socket.to(roomName).emit('bye', socket.nickname))
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
