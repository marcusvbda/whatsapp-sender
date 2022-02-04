import { VueApp } from "@/main";
const validationException = (msg) => ({ type: "warning", msg });
const removeArrayDuplicates = (arr) => Array.from(new Set(arr));
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
      sending_numbers: [],
      current_number_index: 0,
    };
  },
  getters: {
    getNumbers: (state) => state.numbers,
    getMessage: (state) => state.message,
    getTab: (state) => state.tab,
    sending: (state) => state.sending,
    sending_numbers: (state) => state.sending_numbers,
    current_number_index: (state) => state.current_number_index,
  },
  mutations: {
    setNumbers: (state, payload) => (state.numbers = payload),
    setTab: (state, payload) => (state.tab = payload),
    setMessage: (state, payload) => (state.message = payload),
    setSending: (state, payload) => (state.sending = payload),
    setSendingNumbers: (state, payload) => (state.sending_numbers = payload),
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
    async sendCurrentMessage({ dispatch, commit, state }, number) {
      commit("setSending", true);

      await sleep(1500); // emula demora envio

      if (state.current_number_index == state.sending_numbers.length) {
        return dispatch("finishSending");
      } else {
        console.log("enviou", number, state.message);
        commit("setCurrentNumberIndex", state.current_number_index + 1);
        dispatch("sendCurrentNumberMessage");
      }
    },
    sendCurrentNumberMessage({ dispatch, state }) {
      let current_number = state.sending_numbers[state.current_number_index];
      dispatch("sendCurrentMessage", current_number);
    },
    sendMessageFromNumber({ dispatch, commit, state }) {
      const { numbers, message } = state;
      if (!message || !numbers) {
        throw new validationException(
          "Por favor, preencha os campo de mensagem número de telefone"
        );
      }

      commit("setSendingNumbers", removeArrayDuplicates(numbers.split(",")));
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
