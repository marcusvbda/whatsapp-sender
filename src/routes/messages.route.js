const express = require('express');
const axios = require('axios').default;
const debug = require('console-development');

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
      if (postback) {
        const postbackData = { _uids: messagesUids, postback_status: 'sending' };
        try {
          axios.post(postback, postbackData);
          debug.log('sent postback', postbackData);
        } catch (error) {
          debug.log('error postback', postbackData);
        }
      }
      wppEngine.handleSendMessages(messages, sessionToken, postback);
    });
    return res.send({ messages_uids: messagesUids, status: 'sending' });
  }
  wppEngine.handleSendMessages(messages, sessionToken, postback);
  return res.send({ messages_uids: messagesUids, status: 'sending' });
});

module.exports = router;
