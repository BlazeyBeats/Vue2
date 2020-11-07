import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "firebase/app";
import axios from "axios";

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

const firebaseConfig = {
  apiKey: "AIzaSyAWIx_VddvQ9yerhEOSugJGP7EZ-ocE_EE",
  authDomain: "vue2-41a3c.firebaseapp.com",
  databaseURL: "https://vue2-41a3c.firebaseio.com",
  projectId: "vue2-41a3c",
  storageBucket: "vue2-41a3c.appspot.com",
  messagingSenderId: "761197204526",
  appId: "1:761197204526:web:fcf176973bbadc2c55fbbf",
  measurementId: "G-6PBVBHE2MC"
};

firebase.initializeApp(firebaseConfig);

let app;

firebase.auth().onAuthStateChanged(user => {
  console.log("user", user);
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});

// app = new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount("#app");
