<template>
<div>
    Logged in
    <div v-if="loggedIn">
    Yes
    <p>logged in as {{user}}</p></div>
    <div v-else>No</div>
    
    <button  @click="signOut">Sign out</button>
</div>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";
export default {
 
    
    name: "top-header",
    mounted() {
        this.setupFirebase();
    },
    created() {
    if (firebase.auth().currentUser) {
     
      this.user = firebase.auth().currentUser.email;
    }
  },
    methods: {
        setupFirebase() {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    
                    // User is signed in.
                    console.log("signed in");
                    this.loggedIn = true;
                  
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
            user: false
        };
    }
};
</script>

<style lang="scss" scoped>
div {
    color: inherit;
}
</style>
