const UserModel = require('@src/models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const checkUser = async (username, password) => {
  const user = await UserModel.findOne({ username });
  if (user && bcrypt.compareSync(password, user.password)) {
    return user;
  }
  return false;
};

const Auth = async (req, res, next) => {
  const bearer = (req.headers.authorization || '').split(' ')[1] || '';
  jwt.verify(bearer, process.env.PRIVATE_KEY, async (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }
    const user = await UserModel.findById(decoded);
    if (!user) {
      return res.sendStatus(403);
    }
    req.user = user;
    return next();
  });
};

module.exports = {
  Auth,
  checkUser,
};
