const express = require('express');
const debug = require('console-development');
const del = require('del');
const wppEngine = require('@src/engines/wpp.engine');

const router = express.Router();

router.get('/', async (req, res) => {
  res.send(wppEngine.getSessionsCodes());
});

router.post('/create', async (req, res) => {
  let { code } = req.body;
  const { postback } = req.body;
  const session = wppEngine.getSession(code);
  if (!session) {
    await wppEngine.initClientSession(code, postback);
  }
  res.send(code);
});

router.delete('/:code', async (req, res) => {
  const { code } = req.params;
  const pathSessions = wppEngine.getSessionPath();
  const cacheFolter = `${pathSessions}/session-${code}`;
  await del(cacheFolter);
  debug.log(`${cacheFolter} is deleted!`);
  res.send(true);
});

module.exports = router;
