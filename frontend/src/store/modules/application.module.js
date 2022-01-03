import { testApiConnection } from "@/services/testService";

export default {
  namespaced: true,
  state() {
    return {
      currentAction: "qrcode",
    };
  },
  getters: {
    getCurrentAction: (state) => state.currentAction,
  },
  mutations: {
    setCurrentAction(state, payload) {
      state.currentAction = payload;
    },
  },
  actions: {
    testApiConnection,
  },
};
