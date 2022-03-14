require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env' : `.env.${process.env.NODE_ENV}`,
});
require('module-alias').addAliases({
  '~': __dirname,
  '@src': `${__dirname}/src`,
});

const SocketIo = require('socket.io');
const verifyJWT = require('@src/middlewares/jwt.middleware');
const wppEngine = require('@src/engines/wpp.engine');
const DBConn = require('@src/utils/connector.util');
const { app, http } = require('./bootstrap');

DBConn.connect();

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
app.use('/auth', require('./src/routes/auth.route'));
app.use('/messages', verifyJWT, require('./src/routes/messages.route'));
