const jwt = require('jsonwebtoken');
const UserModel = require('@src/models/user.model');

const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.sendStatus(403);
  }

  const splited = token.split(' ');
  if (splited[0].trim().toLowerCase() !== 'bearer') {
    return res.sendStatus(403);
  }

  if (!splited[1]) {
    return res.sendStatus(403);
  }

  try {
    const decoded = jwt.verify(splited[1], process.env.PRIVATE_KEY);
    const user = UserModel.findById(decoded);
    if (!user) {
      return res.sendStatus(403);
    }
    req.user = user;
    return next();
  } catch (er) {
    return res.sendStatus(403);
  }
};

module.exports = verifyJWT;
