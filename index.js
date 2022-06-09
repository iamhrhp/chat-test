const express = require('express');
const { Server } = require('socket.io');
var http = require('http');
const cors = require('cors');

const app = express();
app.use(cors());

var server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.get('/', (req, res) => {
  res.send('Socket chat backend started!');
  res.end();
});

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
  // console.log(socket.id);

  socket.on('joinRoom', (room) => socket.join(room));

  socket.on('newMessage', ({ newMessage, room }) => {
    console.log(room, newMessage);
    io.in(room).emit('getLatestMessage', newMessage);
  });
});

//heroku 3
if (process.env.NODE_ENV == 'production') {
  app.use(express.static('client/build'));

  const path = require('path');

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

server.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
