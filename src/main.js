import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "firebase/app";
import axios from "axios";


Vue.config.productionTip = false;
Vue.prototype.$axios = axios;



let app;

firebase.auth().onAuthStateChanged(user => {
 
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});

