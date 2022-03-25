const express = require('express');
const debug = require('console-development');
const del = require('del');

const router = express.Router();

router.delete('/:code', async (req, res) => {
  const { code } = req.params;
  const cacheFolter = `${__dirname}/../../.wwebjs_auth/session-${code}`;
  await del(cacheFolter);
  debug.log(`${cacheFolter} is deleted!`);
  res.send(true);
});

module.exports = router;
