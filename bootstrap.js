require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env' : `.env.${process.env.NODE_ENV}`,
});
const express = require('express');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');

app.use(cors());
const bodyParser = require('body-parser');

const isProduction = process.env.NODE_ENV === 'production';
const path = process.cwd();
const distPath = `${path}/frontend/dist`;
const debug = require('console-development');
// const DBConn = require('./src/utils/connector');

// DBConn.connect();
// const SessionModel = require('./src/models/session.model');

app.use(bodyParser.json());

if (isProduction) {
  app.use(express.static(distPath));
}

app.get('/', (req, res) => {
  res.json('api is running ...');
});

const port = process.env.APP_PORT;
http.listen(port, () => {
  const uri = process.env.APP_URL;
  debug.log(`listening on ${uri}:${port}`);
});

// app.get('/test-mongo', async (req, res) => {
//   const list = await SessionModel.find({});
//   res.json(list);
// });

module.exports = {
  app,
  http,
  isProduction,
};
