const EventEmitter = require('events');
const SocketIo = require('socket.io');
const { app, http, isProduction } = require('./bootstrap');
const botEngine = require('./src/libs/bot-engine');

const sessions = {};

const getSessionStatuses = async () => {
  const sessionStatuses = {};
  const keys = Object.keys(sessions);
  for (let i = 0; i < keys.length; i += 1) {
    try {
    // eslint-disable-next-line no-await-in-loop
      sessionStatuses[keys[i]] = await sessions[keys[i]].isConnected() ? 'connected' : 'disconnected';
    } catch {
      delete sessions[keys[i]];
      sessionStatuses[keys[i]] = 'disconnected';
    }
  }
  return sessionStatuses;
};

const sessionIsConnected = async (code) => {
  try {
    let isConnected = false;
    if (
      sessions[code]
      && sessions[code]?.isConnected
    ) {
      isConnected = await sessions[code].isConnected() ?? false;
    }
    return isConnected;
  } catch {
    return false;
  }
};

app.get('/sessions', async (req, res) => {
  const sessionStatuses = await getSessionStatuses();
  res.json(sessionStatuses);
});

app.get('/sessions/get-status/:code', async (req, res) => {
  const sessionStatuses = await getSessionStatuses();
  const { code } = req.params;
  res.json(sessionStatuses[code] ?? 'disconnected');
});

app.post('/sessions/login', async (req, res) => {
  const params = req.body;
  const eventEmitter = new EventEmitter();

  botEngine.start(eventEmitter, {
    ...params,
    headless: isProduction,
    socket_id: null,
  }).then((client) => {
    sessions[params.code] = client;
  });
  res.json({});
});

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
    const isConnected = await sessionIsConnected(params.code);
    if (isConnected) {
      socket.emit('session-updated', {
        statusSession: 'isLogged',
        session: params.code,
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

  socket.on('send-message', async (params) => {
    const isConnected = await sessionIsConnected(params.session_code);
    if (isConnected) {
      const client = sessions[params.session_code];
      const actions = {
        text: () => client.sendText(params.to, params.message),
      };
      try {
        if (actions[params.type]) {
          const result = await actions[params.type]();
          socket.emit('message-sent', { message: params, result });
        } else {
          socket.emit('message-failed', { message: params, error: `type ${params.type} not found` });
        }
      } catch (er) {
        socket.emit('message-failed', { message: params, error: er });
      }
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
