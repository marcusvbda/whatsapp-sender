const SocketIo = require('socket.io');
const { app, http } = require('./src/utils/bootstrap.util');
const wppEngine = require('./src/engines/wpp.engine');

// socket
const io = SocketIo(http, {
  allowEIO3: true,
  cors: {
    origin: true,
    credentials: true,
  },
});

io.sockets.on('connection', (socket) => {
  socket.emit('connected', { id: socket.id });

  socket.on('start-engine', (code) => {
    wppEngine.initClientSession(code, socket);
  });

  socket.on('message', async (params) => {
    const result = await wppEngine.handleSendMessage(params, socket);
    return result;
  });
});

app.use('/sessions', require('./src/routes/sessions.route'));
app.use('/messages', require('./src/routes/messages.route'));
