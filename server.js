const SocketIo = require('socket.io');
const debug = require('console-development');
const { LocalAuth, Client } = require('whatsapp-web.js');
const { app, http } = require('./bootstrap');

const isHeadless = false;

const sessions = {};

const eventList = [
  'auth_failure',
  'disconnected',
  'qr',
  'authenticated',
  'auth_failure',
  'ready',
  'message',
];

// actions
const sessionIsConnected = async (code) => {
  let isConnected = false;
  try {
    const client = sessions[code];
    if (client) {
      const state = await client.getState();
      isConnected = state === 'CONNECTED';
    }
    return isConnected;
  } catch {
    return isConnected;
  }
};

const setSessions = (code, client, socket = null) => {
  debug.log('set session', code);
  sessions[code] = client;
  if (socket) {
    sessions[code].socket = socket;
  }
};

const initClientSession = (code, socket = null) => {
  debug.log('start engine', code);
  const localAuth = new LocalAuth({ clientId: code });
  const client = new Client({
    authStrategy: localAuth,
    puppeteer: { headless: isHeadless },
  });
  setSessions(code, client, socket);

  eventList.forEach((event) => {
    client.on(event, (data) => {
      debug.log(event, data);
      if (socket) {
        socket.emit(event, data);
      }
    });
  });

  client.initialize();
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
  socket.emit('connected', { id: socket.id, events: eventList });

  socket.on('start-engine', async (code) => {
    initClientSession(code, socket);
  });
});

// routes
app.get('/sessions', async (req, res) => {
  res.json(Object.keys(sessions));
});

app.get('/sessions/:code/check-status', async (req, res) => {
  const { code } = req.params;
  debug.log('get session status', code);
  const isConnected = await sessionIsConnected(code);
  res.json(isConnected ? 'connected' : 'disconnected');
});
