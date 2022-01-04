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
        WABrowserId: '"8uqkZzNKhX89Bhbh080+tQ=="',
        WASecretBundle:
          '{"key":"ccenhb04fs/tgPGRFgU3/P4iTC5JQaVFCQhiGvy+2ws=","encKey":"bmadPFvHKMOTB9bDo62PbLv6pVqCBduMdRe0bMp11sM=","macKey":"ccenhb04fs/tgPGRFgU3/P4iTC5JQaVFCQhiGvy+2ws="}',
        WAToken1: '"xscRtHyn2fAKNyYndaa3fYq2vd5TumVVjWS9T/V0img="',
        WAToken2:
          '"1@TbYH5yv0NtUNm1HM5pHBfuEaFNE2BTvXjyCxNqN+Vp8I6Nkn0YXnciy/NSzOhRJsd4POKNxxynEkJQ=="',
      },
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
    initSocket,
  },
};
