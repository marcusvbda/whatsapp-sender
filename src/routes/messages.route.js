const express = require('express');
const axios = require('axios').default;

const router = express.Router();
const wppEngine = require('../engines/wpp.engine');

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
    return res.json({ code, _uid, status: 'processing' });
  }
  const messageResult = await wppEngine.handleSendMessage(params);
  return res.json({ ...messageResult, status: 'sent-message' });
});

module.exports = router;
