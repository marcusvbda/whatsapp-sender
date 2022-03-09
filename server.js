const EventEmitter = require('events');
const SocketIo = require('socket.io');
const { http, isProduction } = require('./bootstrap');
const botEngine = require('./src/libs/bot-engine');

const sessions = {};

const io = SocketIo(http, {
  allowEIO3: true,
  cors: {
    origin: true,
    credentials: true,
  },
});

io.sockets.on('connection', (socket) => {
  const eventEmitter = new EventEmitter();

  socket.emit('connected', { id: socket.id });

  socket.on('start-engine', async (params) => {
    let isConnected = false;
    if (
      sessions[params.code]
      && sessions[params.code]?.isConnected
    ) {
      isConnected = await sessions[params.code].isConnected();
    }

    if (isConnected) {
      socket.emit('session-updated', {
        statusSession: 'isLogged',
        session: params.session_id,
      });
    } else {
      botEngine
        .start(eventEmitter, {
          ...params,
          headless: isProduction,
          socket_id: socket.id,
        })
        .then((client) => {
          sessions[params.code] = client;
        });
    }
  });

  [
    'qr-generated',
    'session-updated',
    'token-generated',
    'incoming-call',
    'state-change',
    'message-received',
  ].map((event) => eventEmitter.on(event, (data) => {
    socket.emit(event, data);
  }));

  eventEmitter.on('browser-close', (session) => {
    socket.emit('browser-close', session);
    delete sessions[session];
  });
});
