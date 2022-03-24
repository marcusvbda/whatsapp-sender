require('dotenv').config({ path: '.env' });

require('module-alias').addAliases({
  '~': __dirname,
  '@src': `${__dirname}/src`,
});

const SocketIo = require('socket.io');
const { Auth, checkUser } = require('@src/middlewares/auth.middleware');
const wppEngine = require('@src/engines/wpp.engine');
const DBConn = require('@src/utils/connector.util');
const debug = require('console-development');
const { app, http } = require('./bootstrap');

DBConn.connect();

const io = SocketIo(http, {
  allowEIO3: true,
  cors: {
    origin: '*',
  },
});

io.sockets.on('connection', async (socket) => {
  const { username, password } = socket.handshake.query;
  const user = await checkUser(username, password);
  if (user) {
    socket.emit('connected', { id: socket.id });

    socket.on('start-engine', (code) => {
      wppEngine.initClientSession(code, socket);
    });

    socket.on('message', async (params) => {
      const result = await wppEngine.handleSendMessage(params, socket);
      return result;
    });
  } else {
    socket.emit('error', { message: 'Invalid credentials' });
  }
});

app.use('/sessions', require('./src/routes/sessions.route'));
app.use('/auth', require('./src/routes/auth.route'));
app.use('/messages', Auth, require('./src/routes/messages.route'));
