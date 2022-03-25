const debug = require('console-development');
const { LocalAuth, Client } = require('whatsapp-web.js');
const axios = require('axios').default;
const del = require('del');

const engineWpp = {
  isHeadless: true,
  eventList: [
    'auth_failure',
    'disconnected',
    'qr',
    'authenticated',
    'auth_failure',
    'ready',
    'message',
    'sent_message',
  ],
  sessions: [],
  deleteSession(code) {
    debug.log('delete session', code);
    if (this.sessions[code]) {
      delete this.sessions[code];
    }
  },
  getSession(code = null) {
    debug.log('get session', code);
    return code ? this.sessions[code] : this.sessions;
  },
  setSessions(code, client, socket = null) {
    debug.log('set session', code);
    this.sessions[code] = client;
    if (socket) {
      this.sessions[code].socket = socket;
    }
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
  async initClientSession(code, socket = null) {
    const isConnected = await this.sessionIsConnected(code);
    debug.log('start engine', code, isConnected);

    let client = null;
    if (isConnected) {
      client = this.getSessions(code);
      ['authenticated', 'ready'].forEach((event) => socket.emit(event));
    } else {
      const localAuth = new LocalAuth({ clientId: code });
      const cacheFolter = `${__dirname}/../../.wwebjs_auth/session-${code}/Default/Service Worker`;
      await del(cacheFolter);
      debug.log(`${cacheFolter} is deleted!`);
      client = new Client({
        authStrategy: localAuth,
        puppeteer: { headless: this.isHeadless },
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-extensions',
        ],
      });
      client.initialize();
    }

    this.eventList.forEach((event) => {
      client.on(event, (data) => {
        // debug.log(event, data);
        if (socket) {
          socket.emit(event, data);
        }
      });
    });

    client.on('disconnect', () => {
      debug.log('disconnect');
      this.deleteSession(code);
    });

    this.setSessions(code, client, socket);
    return { client, socket };
  },
  randomNumber(min, max) {
    return Math.random() * (max - min) + min;
  },
  async handleSendMessages(messages, code, postback = null) {
    debug.log('handleSendMessages');
    const results = [];
    for (let i = 0; i < messages.length; i += 1) {
      const timeout = this.randomNumber(500, 1500);
      // eslint-disable-next-line no-await-in-loop
      await this.sleep(timeout);
      const message = messages[i];
      // eslint-disable-next-line no-await-in-loop
      const messageResult = await this.handleSendMessage({ ...message, code });
      if (postback) {
        // eslint-disable-next-line no-underscore-dangle
        const postbackData = { _uids: [message._uid], postback_status: 'sent' };
        const postbackResponse = { ...messageResult, ...postbackData };
        // eslint-disable-next-line no-await-in-loop
        try {
          axios.post(postback, postbackResponse);
          debug.log('sent postback', postbackData);
        } catch (error) {
          debug.log('error postback', postbackResponse);
        }
      }
    }
    return results;
  },
  async sleep(timeout) {
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, timeout));
  },
  async handleSendMessage(params, socket = null) {
    debug.log('handleSendMessage');
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
        if (socket) {
          socket.emit('sent_message', payload);
        }
        return payload;
      },
    };

    const result = actions[type] && await actions[type]();
    return result;
  },
};

module.exports = engineWpp;
