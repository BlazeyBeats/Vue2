import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "firebase/app";
import axios from "axios";


Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

//filters
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.filter('convertDate', function (timestamp) {
  var date = new Date(timestamp.seconds*1000).toISOString();
  var string = date.slice(0,-14);
  return string;
})

Vue.filter('convertTime', function (timestamp) {
  var date = new Date(timestamp.seconds*1000).toTimeString();
  var string = date.slice(0,5);
  return string;
})


let app;

firebase.auth().onAuthStateChanged(user => {
  console.log(user);
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});