const express = require('express');
const jwt = require('jsonwebtoken');
const { checkUser } = require('@src/middlewares/auth.middleware');

const router = express.Router();

// 438aafabc2ecd8988a83bda6a58148da
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await checkUser(username, password);
  if (!user) {
    return res.sendStatus(403);
  }

  user.password = undefined;
  const token = jwt.sign(user.id, process.env.PRIVATE_KEY);
  return res.send(token);
});

module.exports = router;
