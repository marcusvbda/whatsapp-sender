const venom = require("venom-bot");

const bot = {
  async start(eventEmitter, params) {
    const qrGeneratedHandler = (base64Qrimg, asciiQR, attempts, urlCode) => {
      eventEmitter.emit("qr-generated", {
        base64Qrimg,
        asciiQR,
        attempts,
        urlCode,
      });
    };

    const sessionHandler = (statusSession, session) => {
      if (["browserClose", "autocloseCalled"].includes(statusSession)) {
        eventEmitter.emit("browser-close", session);
      } else {
        eventEmitter.emit("session-updated", { statusSession, session });
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
      let client = await venom.create(
        params.session_id,
        qrGeneratedHandler,
        sessionHandler,
        settings,
        params.token
      );

      client.getSessionTokenBrowser().then((token) => {
        eventEmitter.emit("token-generated", { token });
      });

      client.onStateChange((state) => {
        eventEmitter("state-change", state);
      });

      client.onIncomingCall(async (call) => {
        eventEmitter.emit("incoming-call", { from: call.peerJid });
      });

      return client;
    } catch (er) {
      console.log(er);
    }
  },
};

module.exports = bot;
