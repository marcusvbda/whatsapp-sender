require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env' : `.env.${process.env.NODE_ENV}`,
});
const express = require('express');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');

app.use(cors());
const bodyParser = require('body-parser');
const debug = require('console-development');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json('api is running ...');
});

const port = process.env.APP_PORT;
http.listen(port, () => {
  const uri = process.env.APP_URL;
  debug.log(`listening on ${uri}:${port}`);
});

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  app,
  http,
  isProduction,
};
