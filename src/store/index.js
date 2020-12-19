import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: { 
    userloggedin:false,
    userName:"",
    userUID:"",
    userEmail:"",
    userProfilePic:false,
    currentPost:"",
    currentOtherUser:""
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
