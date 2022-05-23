const axios = require('axios').default;

const postbacks = {
  dispatch(url, data) {
    if (!url) {
      return false;
    }
    try {
      return axios.post(url, data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      return false;
    }
  },
};

module.exports = postbacks;
