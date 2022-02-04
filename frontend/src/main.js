import { createApp } from "vue";
import App from "./App.vue";
import "@/assets/scss/app.scss";
import store from "@/store";
import VueSweetalert2 from "vue-sweetalert2";
import "@fortawesome/fontawesome-free/js/all.js";

const app = createApp(App);
app.use(store);
app.use(VueSweetalert2);

export const VueApp = app.mount("#app");
