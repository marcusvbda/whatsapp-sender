const uuid = require('uuid');

const helpers = {
  randomNumber(min, max) {
    return Math.random() * (max - min) + min;
  },
  createUniqId() {
    return uuid.v1();
  },
  isDevelopment() {
    return (['development', 'test', 'testing'].includes(process.env.NODE_ENV || '')) || false;
  },
};

module.exports = helpers;
