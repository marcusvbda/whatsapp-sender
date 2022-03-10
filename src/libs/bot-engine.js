const venom = require('venom-bot');
const debug = require('console-development');

const bot = {
  async start(eventEmitter, params) {
    const qrGeneratedHandler = (base64Qrimg, asciiQR, attempts, urlCode) => {
      if (eventEmitter) {
        eventEmitter.emit('qr-generated', {
          base64Qrimg,
          asciiQR,
          attempts,
          urlCode,
        });
      }
    };

    const sessionHandler = (statusSession, session) => {
      if (eventEmitter) {
        if (['browserClose', 'autocloseCalled'].includes(statusSession)) {
          eventEmitter.emit('browser-close', session);
        } else {
          eventEmitter.emit('session-updated', { statusSession, session });
        }
      }
    };

    const settings = {
      disableWelcome: true,
      debug: false,
      logQR: false,
      headless: params.headless,
      puppeteerOptions: {},
      autoClose: 60000,
      createPathFileToken: false,
      multidevice: false,
      useChrome: true,
    };

    try {
      const client = await venom.create(
        params.code,
        qrGeneratedHandler,
        sessionHandler,
        settings,
        params,
      );

      if (eventEmitter) {
        client.getSessionTokenBrowser().then((token) => {
          eventEmitter.emit('token-generated', { token });
        });

        client.onStateChange((state) => {
          eventEmitter('state-change', state);
        });

        client.onIncomingCall(async (call) => {
          eventEmitter.emit('incoming-call', { from: call.peerJid });
        });

        client.onMessage(async (message) => {
          eventEmitter.emit('message-received', message);
        });
      }

      return client;
    } catch (er) {
      return debug.log(er);
    }
  },
};

module.exports = bot;
