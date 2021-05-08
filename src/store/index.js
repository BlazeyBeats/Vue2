import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: { 
    userloggedin:false,
    userName:"",
    bio:"",
    userUID:"",
    userEmail:"",
    currentPost:"",
    currentOtherUser:"",
    userProfilePic:"",
    openchat:false,
    messageUser:"",
    phoneWindow:false,
    navbarTemplate:false
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
