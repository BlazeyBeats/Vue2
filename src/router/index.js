import Vue from "vue";
import VueRouter from "vue-router";

import MainPage from "../components/MainPage.vue";
import Profile from "../components/Profile.vue"
import Manage from "../components/ManageProfile.vue"
import Upload from "../components/Upload.vue"
import MusicPage from "../components/MusicPage.vue"
import OtherProfile from "../components/OtherUserProfile.vue"



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
  },
  {
    path:"/upload",
    name:"upload",
    component:Upload
  },
  {
    path:"/musicpage/:postID",
    name:"MusicPage",
    component:MusicPage
  },
  {
    path:"/profile/:userID",
    name:"OtherProfile",
    component:OtherProfile
  },
  
  
  
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = firebase.auth().currentUser;
  
  if (requiresAuth && !isAuthenticated) {
    next("/");
  } else {
    next();
  }
});

export default router;
