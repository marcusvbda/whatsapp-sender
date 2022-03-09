import io from "socket.io-client";
const debug = require("console-development");

const handlerDisconnect = (commit) => {
  debug.log("disconnect");
  commit("setConnectionId", null);
  commit("setCurrentAction", "loading");
  setTimeout(() => {
    window.location.reload();
  }, 3000);
};

export const initSocket = async ({ state, commit }) => {
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
    debug.log("session-updated", data);
    const actions = {
      notLogged: () => {
        commit("setLogged", false);
        commit("setCurrentAction", "qrcode");
      },
      qrReadSuccess: () => {
        commit("setCurrentAction", "loading");
      },
      isLogged: () => {
        commit("setLogged", true);
        commit("setCurrentAction", "home");
      },
    };

    if (actions[data.statusSession]) {
      actions[data.statusSession]();
    }
  });

  socket.on("qr-generated", (data) => {
    debug.log("qr-generated", data);
    commit("setQrCodeImage", data.base64Qrimg);
    commit("setQrCodeIsLoading", false);
  });

  socket.on("state-change", (event, data) => {
    debug.log("state-change", event, data);
  });

  socket.on("token-generated", (data) => {
    debug.log("token-generated", data);
    commit("setToken", data);
    commit("setCurrentAction", "home");
  });

  socket.on("session-conflict", (data) => {
    debug.log("session-conflict", data);
  });

  socket.on("connected", (data) => {
    debug.log("connected", data);
    commit("setConnectionId", data.id);
  });

  socket.on("disconnect", () => handlerDisconnect(commit));

  socket.on("browser-close", () => handlerDisconnect(commit));
};
