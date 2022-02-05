import { sleep, validationException } from "@/libs/helpers";
import { sweetalert } from "@/libs/sweetalert";

export default {
  namespaced: true,
  state() {
    return {
      numbers:
        "14996766177,14996766177,14999999999,2121212121,2121213413,21212134141,2121413221,21314123123,123123123123,21212131,1212121231231,21212121",
      message: "teste 123",
      tab: 0,
      sending: false,
      show_result: false,
      current_number_index: 0,
      sending_state: "play",
      use_attachment: false,
      sent_messages: [],
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
    getUseAttachment: (state) => state.use_attachment,
    getSentMessage: (state) => state.sent_messages,
  },
  mutations: {
    setNumbers: (state, payload) => (state.numbers = payload),
    setTab: (state, payload) => (state.tab = payload),
    setMessage: (state, payload) => (state.message = payload),
    setSending: (state, payload) => {
      const el = document.querySelector("html");
      el.style.overflow = payload ? "hidden" : "unset";
      state.sending = payload;
    },
    setCurrentNumberIndex: (state, payload) => {
      state.current_number_index = payload;
    },
    setShowResult: (state, payload) => (state.show_result = payload),
    setSendingState: (state, payload) => (state.sending_state = payload),
    setUseAttachment: (state, payload) => (state.use_attachment = payload),
    setSentMessages: (state, payload) => (state.sent_messages = payload),
  },
  actions: {
    resetState({ commit }) {
      commit("setSending", false);
      commit("setCurrentNumberIndex", 0);
      commit("setNumbers", "");
      commit("setMessage", "");
      commit("setUseAttachment", false);
      commit("setTab", 0);
      commit("setSentMessages", []);
    },
    closeResult({ dispatch, commit }) {
      commit("setSending", false);
      commit("setShowResult", false);
      dispatch("resetState");
    },
    async sendCurrentMessage({ dispatch, commit, getters }, number) {
      commit("setSending", true);
      let index = getters.getCurrentNumberIndex;
      await dispatch("sendEngineMessage", number);
      if (index == getters.getSendingNumbers.length) {
        commit("setShowResult", true);
        return sweetalert.toast("Envio finalizado").then(() => {
          dispatch("finishSending");
        });
      } else {
        let sending_state = getters.getSendingState;
        if (sending_state == "play") {
          commit("setCurrentNumberIndex", index + 1);
          dispatch("sendCurrentNumberMessage");
        }
      }
    },
    async sendEngineMessage({ commit, getters }, number) {
      // emula demora envio
      if (number) {
        console.log("ENVIANDO", number, getters.getMessage);
        let sent_messages = getters.getSentMessage;
        commit("setSentMessages", sent_messages.concat([number]));
        return sleep(500);
      }
    },
    sendCurrentNumberMessage({ dispatch, commit, getters }) {
      let index = getters.getCurrentNumberIndex;
      let number = getters.getSendingNumbers[index];
      commit("setSendingState", "play");
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
      alert("Ainda nao implementado");
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
          sweetalert.alert(error.type, "Atenção", error.msg);
        }
      }
    },
  },
};
