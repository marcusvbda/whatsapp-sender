import { initSocket } from "@/services/engine.service";

export default {
  namespaced: true,
  state() {
    return {
      currentAction: "loading",
      socket: {},
      qrCodeIsLoading: true,
      connection_id: null,
      session_id: "Vinicius",
      token: {
        WABrowserId: '"UFGuNWgmMGyALjU7ZvbYQw=="',
        WASecretBundle:
          '{"key":"RcZtZsxLthcH8sDAIY0nbQFsy7QBlymE0RWUBGYMUpI=","encKey":"x3Nkf1yLZwjxg0P9erXPr4KpyA88sJnnSGAT9l/XEz0=","macKey":"RcZtZsxLthcH8sDAIY0nbQFsy7QBlymE0RWUBGYMUpI="}',
        WAToken1: '"PmX+XwsiViflwBrZD4olK2hhCUVwpybG3WC0c89BPJ0="',
        WAToken2:
          '"1@iRK252e329p2fpCxl0R+HzkTa2/710cEkwyQr7Ne8gauJLekLc/8Rs5UEXqA4q4yuS/kK0ymRXU2qA=="',
      },
      logged: false,
      qrCodeImage: null,
    };
  },
  getters: {
    getCurrentAction: (state) => state.currentAction,
    // getCurrentAction: () => "home",
    getSocket: (state) => state.socket,
    getQrCodeIsLoading: (state) => state.qrCodeIsLoading,
    getQrCodeImage: (state) => state.qrCodeImage,
    getIsLogged: (state) => state.logged,
  },
  mutations: {
    setCurrentAction: (state, payload) => (state.currentAction = payload),
    setSocket: (state, payload) => (state.socket = payload),
    setQrCodeIsLoading: (state, payload) => (state.qrCodeIsLoading = payload),
    setQrCodeImage: (state, payload) => (state.qrCodeImage = payload),
    setLogged: (state, payload) => (state.logged = payload),
    setToken: (state, payload) => (state.token = payload),
    setConnectionId: (state, payload) => (state.connection_id = payload),
  },
  actions: {
    initSocket,
  },
};
