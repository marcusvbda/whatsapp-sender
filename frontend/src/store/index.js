import { createStore } from "vuex";
import applicationModule from "./modules/application.module.js";

export default createStore({
  modules: {
    application: applicationModule,
  },
});
