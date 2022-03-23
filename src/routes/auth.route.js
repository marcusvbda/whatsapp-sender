const express = require('express');
const debug = require('console-development');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('@src/models/user.model');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  debug.log('auth login', username, password);
  const user = await UserModel.findOne({ username });
  if (bcrypt.compareSync(password, user.password)) {
    const token = await jwt.sign(user.id, process.env.PRIVATE_KEY);
    return res.send({ token });
  }
  return res.send({ error: 'invalid credentials' }, 403);
});

router.post('/encrypt', async (req, res) => {
  const { value } = req.body;
  const hash = bcrypt.hashSync(value, 10);
  res.send(hash);
});

module.exports = router;
