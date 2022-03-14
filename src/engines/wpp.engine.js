const debug = require('console-development');
const { LocalAuth, Client } = require('whatsapp-web.js');

const isHeadless = false;

const eventList = [
  'auth_failure',
  'disconnected',
  'qr',
  'authenticated',
  'auth_failure',
  'ready',
  'message',
  'sent_message',
];

const engineWpp = {
  sessions: [],
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
      client = new Client({
        authStrategy: localAuth,
        puppeteer: { headless: isHeadless },
      });
      client.initialize();
    }

    eventList.forEach((event) => {
      client.on(event, (data) => {
        debug.log(event, data);
        if (socket) {
          socket.emit(event, data);
        }
      });
    });

    this.setSessions(code, client, socket);
    return { client, socket };
  },
  async handleSendMessage(params, socket = null) {
    debug.log('message', params);
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

        debug.log('sent message', sentMessage);
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
