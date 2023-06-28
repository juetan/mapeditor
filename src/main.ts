import "@arco-design/web-vue/dist/arco.css";
import Arco from "@arco-design/web-vue";
import { createApp } from "vue";
import App from "./App.vue";
import "./assets/style.css";

const app = createApp(App);

app.use(Arco);
app.mount("#app");
