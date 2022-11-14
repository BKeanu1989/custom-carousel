import { createApp } from "vue";
import App from "./App.vue";

import "../dist/sw-carousel.css";
import { GesturePlugin } from '@vueuse/gesture'

const app = createApp(App);
app.use(GesturePlugin)

app.mount("#app");
