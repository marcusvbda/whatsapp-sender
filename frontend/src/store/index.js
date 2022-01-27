import { createStore } from "vuex";
import applicationModule from "./modules/application.module.js";
import senderModule from "./modules/sender.module.js";

export default createStore({
  modules: {
    application: applicationModule,
    sender: senderModule,
  },
});
