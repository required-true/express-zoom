import http from 'http';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import express from 'express';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
  cors: {
    origin: ['https://admin.socket.io'],
    credentials: true,
  },
});

instrument(wsServer, {
  auth: false,
  mode: 'development',
});

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((value, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRoom(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on('connection', (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });

  socket.on('enter_room', (nickName, roomName, done) => {
    socket['nickname'] = nickName;
    socket.join(roomName);
    done();
    socket.to(roomName).emit('welcome', socket.nickname, countRoom(roomName));
    wsServer.sockets.emit('room_change', publicRooms());
  });

  socket.on('new_message', (msg, room, done) => {
    socket.to(room).emit('new_message', `${socket.nickname}: ${msg}`);
    done();
  });

  socket.on('disconnecting', () => {
    socket.rooms.forEach((roomName) => socket.to(roomName).emit('bye', socket.nickname, countRoom(roomName) - 1));
  });

  socket.on('disconnect', () => {
    wsServer.sockets.emit('room_change', publicRooms());
  });
});

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
  console.log('Listening on http://localhost:3000');
});
