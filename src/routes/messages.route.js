const express = require('express');
const axios = require('axios').default;

const router = express.Router();
const wppEngine = require('@src/engines/wpp.engine');

router.post('/send', async (req, res) => {
  const params = req.body;
  const { code, _uid, postback } = params;
  const isConnected = await wppEngine.sessionIsConnected(code);
  if (!isConnected) {
    const { client } = await wppEngine.initClientSession(code);
    client.on('ready', async () => {
      axios.post(postback, { code, _uid, status: 'ready' });

      const messageResult = await wppEngine.handleSendMessage(params);
      axios.post(postback, { ...messageResult, status: 'sent-message' });
    });
    return res.send({ code, _uid, status: 'processing' });
  }
  const messageResult = await wppEngine.handleSendMessage(params);
  return res.send({ ...messageResult, status: 'sent-message' });
});

module.exports = router;
// eslint-disable-next-line max-len
// homolog token = eyJhbGciOiJIUzI1NiJ9.NjIyZjQzNTJiOGM3YTI5MTdmYTk1ZTgw.neVUW9vXDIhqb1DiOa8F3tAgNvdiEG7F_yxIyrE8p4g
