const express = require('express');

const router = express.Router();
const wppEngine = require('@src/engines/wpp.engine');

router.post('/send', async (req, res) => {
  const { messages, session_token: sessionToken, postback } = req.body;
  // eslint-disable-next-line no-underscore-dangle
  const messagesUids = messages.map((x) => x._uid);
  const isConnected = await wppEngine.sessionIsConnected(sessionToken);
  if (!isConnected) {
    const { client } = await wppEngine.initClientSession(sessionToken);
    client.on('ready', () => {
      wppEngine.handleSendMessages(messages, sessionToken, postback);
    });
    return res.send({ messages_uids: messagesUids, status: 'sending' });
  }
  wppEngine.handleSendMessages(messages, sessionToken, postback);
  return res.send({ messages_uids: messagesUids, status: 'sending' });
});

module.exports = router;
