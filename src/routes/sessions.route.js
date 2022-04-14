const express = require('express');
const debug = require('console-development');
const del = require('del');
const wppEngine = require('@src/engines/wpp.engine');

const router = express.Router();

router.delete('/:code', async (req, res) => {
  const { code } = req.params;
  const pathSessions = wppEngine.getSessionPath();
  const cacheFolter = `${pathSessions}/session-${code}`;
  await del(cacheFolter);
  debug.log(`${cacheFolter} is deleted!`);
  res.send(true);
});

module.exports = router;
