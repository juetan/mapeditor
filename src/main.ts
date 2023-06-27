import { Message } from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";
import { createApp } from "vue";
import App from "./App.vue";
import "./assets/style.css";

const app = createApp(App);

Message._context = app._context;

app.mount("#app");
