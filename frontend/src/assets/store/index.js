import { createStore } from "vuex";
import applicationModule from "./application.module.js";

export default createStore({
  modules: {
    application: applicationModule,
  },
});
