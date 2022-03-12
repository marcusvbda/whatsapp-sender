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
  'sent_message',
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

const initClientSession = async (code, socket = null) => {
  const isConnected = await sessionIsConnected(code);
  debug.log('start engine', code, isConnected);

  let client = null;
  if (isConnected) {
    client = sessions[code];
    ['authenticated', 'ready'].forEach((event) => socket.emit(event));
  } else {
    const localAuth = new LocalAuth({ clientId: code });
    client = new Client({
      authStrategy: localAuth,
      puppeteer: { headless: isHeadless },
    });
    client.initialize();
  }

  eventList.forEach((event) => {
    client.on(event, (data) => {
      debug.log(event, data);
      if (socket) {
        socket.emit(event, data);
      }
    });
  });

  setSessions(code, client, socket);
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
  socket.emit('connected', { id: socket.id });

  socket.on('start-engine', (code) => {
    initClientSession(code, socket);
  });

  socket.on('message', async (params) => {
    debug.log('message', params);
    const {
      code, number, type, message, _uid,
    } = params;

    const client = sessions[code];
    const actions = {
      text: async () => {
        const numberId = number.includes('@c.us') ? number : `${number}@c.us`;
        // VERIFICAR SE O TEL EXISTE ANTES DE ENVIAR
        const sentMessage = await client.sendMessage(numberId, message);
        debug.log('sent message', sentMessage);
        socket.emit('sent_message', { ...sentMessage, _uid });
      },
    };

    const result = actions[type] && await actions[type]();
    return result;
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
