const express = require('express');
const debug = require('console-development');

const router = express.Router();
const wppEngine = require('../engines/wpp.engine');

router.get('/', async (req, res) => {
  res.json(Object.keys(wppEngine.getSession()));
});

router.get('/:code/check-status', async (req, res) => {
  const { code } = req.params;
  debug.log('get session status', code);
  const isConnected = await wppEngine.sessionIsConnected(code);
  res.json(isConnected ? 'connected' : 'disconnected');
});

module.exports = router;
