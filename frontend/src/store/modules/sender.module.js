import { VueApp } from "@/main";
const validationException = (msg) => ({ type: "warning", msg });
const sendAlert = async (icon, title, text) => {
  VueApp.$swal.fire({ icon, title, text });
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  namespaced: true,
  state() {
    return {
      numbers: "14996766177,14996766177,14999999999",
      message: "teste 123",
      tab: 0,
      sending: false,
      show_result: false,
      current_number_index: 0,
      sending_state: "play",
    };
  },
  getters: {
    getNumbers: (state) => state.numbers,
    getMessage: (state) => state.message,
    getTab: (state) => state.tab,
    getSending: (state) => state.sending,
    getSendingNumbers: (state) => state.numbers.split(","),
    getCurrentNumberIndex: (state) => state.current_number_index,
    getShowResult: (state) => state.show_result,
    getSendingState: (state) => state.sending_state,
  },
  mutations: {
    setNumbers: (state, payload) => (state.numbers = payload),
    setTab: (state, payload) => (state.tab = payload),
    setMessage: (state, payload) => (state.message = payload),
    setSending: (state, payload) => (state.sending = payload),
    setCurrentNumberIndex: (state, payload) => {
      state.current_number_index = payload;
    },
    setShowResult: (state, payload) => (state.show_result = payload),
    setSendingState: (state, payload) => (state.sending_state = payload),
  },
  actions: {
    closeResult({ commit }) {
      commit("setSending", false);
      commit("setShowResult", false);
    },
    finishSending({ commit }) {
      commit("setCurrentNumberIndex", 0);
      commit("setShowResult", true);
    },
    async sendCurrentMessage({ dispatch, commit, getters }, number) {
      commit("setSending", true);
      let index = getters.getCurrentNumberIndex;
      if (index == getters.getSendingNumbers.length) {
        return dispatch("finishSending");
      } else {
        await dispatch("sendEngineMessage");
        let sending_state = getters.getSendingState;
        console.log(sending_state);
        if (sending_state == "play") {
          commit("setCurrentNumberIndex", index + 1);
          console.log("ENVIANDO", number, getters.getMessage);
          dispatch("sendCurrentNumberMessage");
        }
      }
    },
    async sendEngineMessage() {
      // emula demora envio
      return sleep(1000);
    },
    sendCurrentNumberMessage({ dispatch, commit, getters }) {
      let index = getters.getCurrentNumberIndex;
      let number = getters.getSendingNumbers[index];
      commit("setShowResult", false);
      dispatch("sendCurrentMessage", number);
    },
    sendMessageFromNumber({ dispatch, state }) {
      const { numbers, message } = state;
      if (!message || !numbers) {
        throw new validationException(
          "Por favor, preencha os campo de mensagem número de telefone"
        );
      }
      dispatch("sendCurrentNumberMessage");
    },
    sendMessageFromSheet() {
      alert("validacao");
    },
    submit({ dispatch, state }) {
      let actions = {
        0: () => dispatch("sendMessageFromNumber"),
        1: () => dispatch("sendMessageFromSheet"),
      };
      try {
        actions[state.tab] && actions[state.tab]();
      } catch (error) {
        if (error?.type) {
          sendAlert(error.type, "Erro", error.msg);
        }
      }
    },
  },
};
