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
      console.log(payload);
      state.currentAction = payload;
    },
  },
};
