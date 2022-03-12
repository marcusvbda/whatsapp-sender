const EventEmitter = require('events');
const SocketIo = require('socket.io');
const debug = require('console-development');
const { app, http } = require('./bootstrap');
const botEngine = require('./src/libs/bot-engine');

const isHeadless = false;
const KeepAliveInterval = 5000;

const sessions = {};

// actions
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

const handleSendMessage = async (params) => {
  const isConnected = await sessionIsConnected(params.session_code);
  if (isConnected) {
    const client = sessions[params.session_code];
    const actions = {
      text: () => client.sendText(params.to, params.message),
    };
    try {
      if (actions[params.type]) {
        const result = await actions[params.type]();
        return { event: 'message-sent', data: { message: params, result } };
      }
      return { event: 'message-failed', data: { message: params, error: `type ${params.type} not found` } };
    } catch (er) {
      return { event: 'message-failed', data: { message: params, error: er } };
    }
  }
  return false;
};

const sessionSocket = (type, code, event, data) => {
  if (sessions[code].socket) {
    sessions[code].socket[type](event, data);
  }
};

const destroySession = (code) => {
  sessionSocket('emit', code, 'keep-alive', false);
  clearInterval(sessions[code].keep_alive);
  delete sessions[code];
};

const keepSessionAlive = (code) => {
  sessions[code].keep_alive = setInterval(async () => {
    const isConnected = await sessionIsConnected(code);
    debug.log('keep session alive', code, isConnected);
    if (!isConnected) {
      destroySession(code);
    } else {
      sessionSocket('emit', code, 'keep-alive', true);
    }
  }, KeepAliveInterval);
};

const setSessions = (code, client, socket = null) => {
  debug.log('set session', code);
  sessions[code] = client;
  sessions[code].socket = socket;
  keepSessionAlive(code);
};

// socket
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
          headless: isHeadless,
          socket_id: socket.id,
        })
        .then((client) => {
          setSessions(params.code, client, socket);
        });
    }
  });

  socket.on('send-message', async (params) => {
    const response = await await handleSendMessage(params);
    socket.emit(response.type, response.data);
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
    destroySession(session);
  });
});

// routes
app.get('/sessions', async (req, res) => {
  const sessionStatuses = await getSessionStatuses();
  res.json(sessionStatuses);
});

app.get('/sessions/get-status/:code', async (req, res) => {
  const { code } = req.params;
  debug.log('get session status', code);
  const sessionStatus = await sessionIsConnected(code);
  res.json(sessionStatus ? 'connected' : 'disconnected');
});

app.post('/sessions/login', async (req, res) => {
  debug.log('session login');
  const params = req.body;
  const eventEmitter = new EventEmitter();

  botEngine.start(eventEmitter, {
    ...params,
    headless: isHeadless,
    socket_id: null,
  }).then((client) => {
    setSessions(params.code, client);
  });
  res.json({});
});

app.post('/sessions/send-direct-message', async (req, res) => {
  const params = req.body;
  const response = await await handleSendMessage(params);
  res.json(response);
});
