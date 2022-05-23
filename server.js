require('dotenv').config({ path: '.env' });

require('module-alias').addAliases({
  '~': __dirname,
  '@src': `${__dirname}/src`,
});

const { Auth } = require('@src/middlewares/auth.middleware');
const DBConn = require('@src/utils/connector.util');
const { app } = require('./bootstrap');

const isDevelopment = (['development', 'test', 'testing'].includes(process.env.NODE_ENV || '')) || false;

DBConn.connect();

app.use('/auth', require('./src/routes/auth.route'));
app.use('/sessions', Auth, require('./src/routes/sessions.route'));
app.use('/messages', Auth, require('./src/routes/messages.route'));

if (isDevelopment) {
  app.post('/mock-postback', async (req, res) => {
  // eslint-disable-next-line no-console
    console.log('received postback', req.body);
    res.send(req.body);
  });
}
