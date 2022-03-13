const SocketIo = require('socket.io');
const debug = require('console-development');
const { LocalAuth, Client } = require('whatsapp-web.js');
const axios = require('axios').default;
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
  return { client, socket };
};

const handleSendMessage = async (params, socket = null) => {
  debug.log('message', params);
  const {
    code, number, type, message, _uid,
  } = params;

  const client = sessions[code];
  const actions = {
    text: async () => {
      const numberId = number.includes('@c.us') ? number : `${number}@c.us`;
      const contact = await client.getContactById(numberId);

      const sentMessage = await client.sendMessage(numberId, message);
      const payload = {
        message: sentMessage, code, _uid, contact,
      };

      debug.log('sent message', sentMessage);
      if (socket) {
        socket.emit('sent_message', payload);
      }
      return payload;
    },
  };

  const result = actions[type] && await actions[type]();
  return result;
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
    const result = await handleSendMessage(params, socket);
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

app.post('/postback-mockup', async (req, res) => {
  const params = req.body;
  debug.log('postback mockup', params);
  res.json(params);
});

app.post('/send-message', async (req, res) => {
  const params = req.body;
  const { code, _uid, postback } = params;
  const isConnected = await sessionIsConnected(code);
  if (!isConnected) {
    const { client } = await initClientSession(code);
    client.on('ready', async () => {
      axios.post(postback, { code, _uid, status: 'ready' });

      const messageResult = await handleSendMessage(params);
      axios.post(postback, { ...messageResult, status: 'sent-message' });
    });
    return res.json({ code, _uid, status: 'processing' });
  }
  const messageResult = await handleSendMessage(params);
  return res.json({ ...messageResult, status: 'sent-message' });
});
