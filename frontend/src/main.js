import { createApp } from "vue";
import App from "./App.vue";
import "@/assets/scss/app.scss";
import store from "@/assets/store";

const app = createApp(App);
app.use(store);
app.mount("#app");
