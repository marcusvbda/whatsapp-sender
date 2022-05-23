// const debug = require('console-development');
const { LocalAuth, Client } = require('whatsapp-web.js');
const del = require('del');
const postbacks = require('@src/engines/postbacks.engine');
const helpers = require('@src/utils/helpers.util');

const isHeadless = process.env.HEADLESS;

const engineWpp = {
  webDriveArgs: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-extensions',
    '--use-gl=egl',
    '--disable-setuid-sandbox',
  ],
  sessions: [],
  deleteSession(code) {
    if (this.sessions[code]) {
      delete this.sessions[code];
    }
  },
  getSessionsCodes() {
    return Object.keys(this.sessions);
  },
  getSession(code = null) {
    return code ? this.sessions[code] : false;
  },
  setSessions(code, client) {
    this.sessions[code] = client;
  },
  async sessionIsConnected(code) {
    let isConnected = false;
    try {
      const client = this.getSession(code);
      if (client) {
        const state = await client.getState();
        isConnected = state === 'CONNECTED';
      }
      return isConnected;
    } catch {
      return isConnected;
    }
  },
  getSessionPath() {
    return `${__dirname}/../../wpp_session`;
  },
  async deleteCacheFolder(code) {
    const dataPath = this.getSessionPath();
    const localAuth = new LocalAuth({ clientId: code, dataPath });
    const cacheFolder = `${dataPath}/session-${code}/Default/Service Worker`;
    await del(cacheFolder);
    return localAuth;
  },
  async initClientSession(code, postback) {
    code = code || helpers.createUniqId();
    const isConnected = await this.sessionIsConnected(code);

    let client = null;
    if (isConnected) {
      client = this.getSessions(code);
      [
        'authenticated',
        'ready',
      ].forEach((event) => {
        postbacks.dispatch(postback, { event, code });
      });
    } else {
      const localAuth = await this.deleteCacheFolder(code);
      client = new Client({
        authStrategy: localAuth,
        puppeteer: {
          headless: isHeadless === 'true',
        },
        args: this.webDriveArgs,
      });
      client.initialize();
    }

    [
      'auth_failure',
      'disconnected',
      'qr',
      'authenticated',
      'auth_failure',
      'ready',
      // 'message',
      'sent_message',
    ].forEach((event) => {
      client.on(event, (data) => {
        postbacks.dispatch(postback, { event, code, data });
      });
    });

    client.on('disconnect', () => {
      this.deleteSession(code);
    });

    this.setSessions(code, client);
    return { client };
  },
  async handleSendMessages(messages, code, postback = null) {
    for (let i = 0; i < messages.length; i += 1) {
      const timeout = helpers.randomNumber(500, 1500);
      // eslint-disable-next-line no-await-in-loop
      await this.sleep(timeout);
      const message = messages[i];
      // eslint-disable-next-line no-await-in-loop
      await this.handleSendMessage({ ...message, code }, postback);
    }
  },
  async sleep(timeout) {
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, timeout));
  },
  async handleSendMessage(params, postback) {
    const {
      code, number, type, message, _uid,
    } = params;

    const client = this.getSession(code);
    const actions = {
      text: async () => {
        const numberId = number.includes('@c.us') ? number : `${number}@c.us`;
        const contact = await client.getContactById(numberId);

        const sentMessage = await client.sendMessage(numberId, message);
        const payload = {
          message: sentMessage, code, _uid, contact,
        };
        return payload;
      },
    };

    const result = actions[type] && await actions[type]();
    postbacks.dispatch(postback, { event: 'sent', code, result });
    return result;
  },
};

module.exports = engineWpp;
