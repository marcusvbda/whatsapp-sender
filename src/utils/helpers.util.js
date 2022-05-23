const uuid = require('uuid');

const helpers = {
  randomNumber(min, max) {
    return Math.random() * (max - min) + min;
  },
  createUniqId() {
    return uuid.v1();
  },
};

module.exports = helpers;
