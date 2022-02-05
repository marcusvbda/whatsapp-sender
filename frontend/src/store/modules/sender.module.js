import { VueApp } from "@/main";
const validationException = (msg) => ({ type: "warning", msg });
const sendMessage = async (icon, title, text) => {
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
      current_number_index: 0,
    };
  },
  getters: {
    getNumbers: (state) => state.numbers,
    getMessage: (state) => state.message,
    getTab: (state) => state.tab,
    getSending: (state) => state.sending,
    getSendingNumbers: (state) => state.numbers.split(","),
    getCurrentNumberIndex: (state) => state.current_number_index,
  },
  mutations: {
    setNumbers: (state, payload) => (state.numbers = payload),
    setTab: (state, payload) => (state.tab = payload),
    setMessage: (state, payload) => (state.message = payload),
    setSending: (state, payload) => (state.sending = payload),
    setCurrentNumberIndex: (state, payload) =>
      (state.current_number_index = payload),
  },
  actions: {
    finishSending({ commit }) {
      commit("setCurrentNumberIndex", 0);
      commit("setSending", false);
      return sendMessage(
        "success",
        "Finalizado !",
        "Mensagens enviadas com sucesso"
      ).then(() => {
        commit("setMessage", "");
        commit("setNumbers", "");
      });
    },
    async sendCurrentMessage({ dispatch, commit, getters }, number) {
      commit("setSending", true);
      let index = getters.getCurrentNumberIndex;

      if (index == getters.getSendingNumbers.length) {
        return dispatch("finishSending");
      } else {
        console.log("Enviando", number, getters.getMessage);
        await sleep(1500); // emula demora envio
        commit("setCurrentNumberIndex", index + 1);
        dispatch("sendCurrentNumberMessage");
      }
    },
    sendCurrentNumberMessage({ dispatch, getters }) {
      let index = getters.getCurrentNumberIndex;
      let number = getters.getSendingNumbers[index];
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
          sendMessage(error.type, "Erro", error.msg);
        }
      }
    },
  },
};
