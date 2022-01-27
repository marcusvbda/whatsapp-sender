export default {
  namespaced: true,
  state() {
    return {
      numbers: "",
      message: "",
      tab: 0,
    };
  },
  getters: {
    getNumbers: (state) => state.numbers,
    getMessage: (state) => state.message,
    getTab: (state) => state.tab,
  },
  mutations: {
    setNumbers: (state, payload) => (state.numbers = payload),
    setTab: (state, payload) => (state.tab = payload),
    setMessage: (state, payload) => (state.message = payload),
  },
};
