require('dotenv').config({ path: '.env' });

require('module-alias').addAliases({
  '~': __dirname,
  '@src': `${__dirname}/src`,
});

const { Auth } = require('@src/middlewares/auth.middleware');
const DBConn = require('@src/utils/connector.util');
const helpers = require('@src/utils/helpers.util');
const { app } = require('./bootstrap');
const AuthController = require('./src/routes/auth.route');
const SessionController = require('./src/routes/sessions.route');
const MessageController = require('./src/routes/messages.route');

try {
  DBConn.connect();

  app.use('/auth', AuthController);
  app.use('/sessions', Auth, SessionController);
  app.use('/messages', Auth, MessageController);

  if (helpers.isDevelopment()) {
    app.post('/mock-postback', async (req, res) => {
      // eslint-disable-next-line no-console
      console.log('received postback', req.body);
      res.send(req.body);
    });
  }
} catch (err) {
  // eslint-disable-next-line no-console
  console.log(err);
}
