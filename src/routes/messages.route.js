const express = require('express');
const postbacks = require('@src/engines/postbacks.engine');

const router = express.Router();
const wppEngine = require('@src/engines/wpp.engine');

// {
//   "code" : "session-id",
//   "postback" : "http://localhost:3001/mock-postback",
//   "messages" : [
//       {
//           "_uid" : "44555",
//           "number" : "5544444444",
//           "type" : "text",
//           "message" : "teste 123"
//       }
//   ]
// }

router.post('/send', async (req, res) => {
  const { messages, code, postback } = req.body;
  // eslint-disable-next-line no-underscore-dangle
  const messagesUids = messages.map((x) => x._uid);

  const isConnected = await wppEngine.sessionIsConnected(code);
  if (!isConnected) {
    const { client } = await wppEngine.initClientSession(code, postback);

    client.on('ready', () => {
      postbacks.dispatch(postback, { _uids: messagesUids, event: 'sending' });
      wppEngine.handleSendMessages(messages, code, postback);
    });
    return res.send({ _uids: messagesUids, event: 'sending' });
  }

  wppEngine.handleSendMessages(messages, code, postback);
  return res.send({ _uids: messagesUids, event: 'sending' });
});

module.exports = router;
