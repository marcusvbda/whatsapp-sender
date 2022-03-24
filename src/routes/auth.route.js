const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

// 438aafabc2ecd8988a83bda6a58148da
router.post('/encrypt', async (req, res) => {
  const { value } = req.body;
  const hash = bcrypt.hashSync(value, 10);
  res.send(hash);
});

module.exports = router;
