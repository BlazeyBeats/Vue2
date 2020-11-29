import Vue from "vue";
import VueRouter from "vue-router";

import MainPage from "../components/MainPage.vue";
import Profile from "../components/Profile.vue"
import Manage from "../components/ManageProfile.vue"
import * as firebase from "firebase/app";
import "firebase/auth";

Vue.use(VueRouter);

const routes = [
 {
    path:"/",
    name:"mainpage",
    component:MainPage
  },

 {
    path:"/profile",
    name:"profile",
    component:Profile
  },
  {
    path:"/manage",
    name:"manage",
    component:Manage
  }
  
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = firebase.auth().currentUser;
  console.log("isauthenticated", isAuthenticated);
  if (requiresAuth && !isAuthenticated) {
    next("/");
  } else {
    next();
  }
});

export default router;
