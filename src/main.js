import Vue from "vue";

// Cargando vue-notification
import Notifications from "vue-notification";
Vue.use(Notifications);

import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
