import io from "socket.io-client";
const isDevelopment = process.env.NODE_ENV !== "production";

const debug = (...args) => {
  if (isDevelopment) {
    console.log(args);
  }
};

export default {
  namespaced: true,
  state() {
    return {
      currentAction: "loading",
      socket: {},
      qrCodeIsLoading: true,
      connection_id: null,
      session_id: "vinicius",
      token: {},
      // token: {
      //   WABrowserId: '"lLTEAxZjGOMUUikq9JWt0w=="',
      //   WASecretBundle:
      //     '{"key":"6Y5fmO9tu4gZqUS0itg7/V+w6+dsarK3iMwxY/inrcg=","encKey":"DqD7njIv6AfjVdemoJ6fYybcIj8kS2a6h5VicAV11nQ=","macKey":"6Y5fmO9tu4gZqUS0itg7/V+w6+dsarK3iMwxY/inrcg="}',
      //   WAToken1: '"7Sfe0utHbTSwVLAL5KCsQeZAOOIYBo4tROS31inyZOA="',
      //   WAToken2:
      //     '"1@83wqypIqfX6fQzD2Y7m5DGLWdZ9gtSn+HtV4O24pMFlYesDgq48Y398Yq1FGuivsklOeLFX9IqJQUA=="',
      // },
      logged: false,
      qrCodeImage: null,
    };
  },
  getters: {
    getCurrentAction: (state) => state.currentAction,
    getSocket: (state) => state.socket,
    getQrCodeIsLoading: (state) => state.qrCodeIsLoading,
    getQrCodeImage: (state) => state.qrCodeImage,
    getIsLogged: (state) => state.logged,
  },
  mutations: {
    setCurrentAction(state, payload) {
      state.currentAction = payload;
    },
    setSocket(state, payload) {
      state.socket = payload;
    },
    setQrCodeIsLoading(state, payload) {
      state.qrCodeIsLoading = payload;
    },
    setQrCodeImage(state, payload) {
      state.qrCodeImage = payload;
    },
    setLogged(state, payload) {
      state.logged = payload;
    },
    setToken(state, payload) {
      state.token = payload;
    },
    setConnectionId(state, payload) {
      state.connection_id = payload;
    },
  },
  actions: {
    initSocket({ state, commit }) {
      const socket = io(process.env.VUE_APP_ROOT_API, {
        reconnection: true,
        reconnectionDelay: 500,
        reconnectionAttempts: 10,
      });
      commit("setSocket", socket);

      socket.emit("start-engine", {
        session_id: state.session_id,
        token: state.token,
      });

      socket.on("session-updated", (data) => {
        debug("session-updated", data);
        const actions = {
          // browserClose: () => window.location.reload(),
          notLogged: () => {
            commit("setLogged", false);
            commit("setCurrentAction", "qrcode");
          },
          // qrReadSuccess: () => commit("setQrCodeIsLoading", true),
          // isLogged: () => {
          //   commit("setLogged", true);
          //   commit("setCurrentAction", "home");
          // },
        };
        if (actions[data.statusSession]) {
          actions[data.statusSession]();
        }
      });

      socket.on("qr-generated", (data) => {
        debug("qr-generated", data);
        commit("setQrCodeImage", data.base64Qrimg);
        commit("setQrCodeIsLoading", false);
      });

      // socket.on("token-generated", (data) => {
      //   commit("setToken", data);
      // });

      // socket.on("connected", (data) => {
      //   commit("setConnectionId", data.id);
      // });
    },
  },
};
