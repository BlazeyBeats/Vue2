<template>
<div>
    Logged in
    <div v-if="loggedIn">
    Yes
    <p>logged in as {{userEmail}}</p>
    <p>user UID : {{userUID}}</p></div>
    <div v-else>No</div>
    
    <button  @click="signOut">Sign out</button>
</div>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";
import {fb} from './firebaseinit.js'
export default {
 
    
    name: "top-header",

    mounted() {
        this.setupFirebase();
    if (firebase.auth().currentUser) {
        var user = fb.auth().currentUser;
        this.$store.state.userUID = user.uid;
      this.$store.state.userEmail = fb.auth().currentUser.email;
    }
  },
    methods: {
        setupFirebase() {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    
                    // User is signed in.
                    console.log("signed in");
                    this.loggedIn = true;
                    this.userUID = this.$store.state.userUID;
                    this.userEmail = this.$store.state.userEmail;
                  
                } else {
                    // No user is signed in.
                    this.loggedIn = false;
                    console.log("signed out", this.loggedIn);
                }
            });
        },
        signOut() {
            firebase
                .auth()
                .signOut()
                .then(() => {
                    this.$router.replace({
                        name: "login"
                    });
                });
        }
    },
    data() {
        return {
            loggedIn: false,
            userEmail: "",
            userUID:""
        };
    }
};
</script>

<style lang="scss" scoped>
div {
    color: inherit;
}
</style>
