<template>
<div id="app">
    <app-firebasetest v-if="firebasetest"></app-firebasetest>
    <app-navbar-loggedin v-if="loggedIn"></app-navbar-loggedin>
    <app-navbar-loggedout v-else></app-navbar-loggedout>

    <router-view><app-mainpage></app-mainpage></router-view>
   
</div>
</template>

<script>
import NavbarLoggedOut from './components/NavbarLoggedOut';
import NavbarLoggedIn from './components/NavbarLoggedIn';
import MainPage from './components/MainPage';

import FirebaseTest from './components/FirebaseTest';
import * as firebase from "firebase/app";
import "firebase/auth";

export default {
    components: {
        'app-firebasetest': FirebaseTest,
        'app-navbar-loggedout': NavbarLoggedOut,
        'app-navbar-loggedin': NavbarLoggedIn,
        'app-mainpage': MainPage,
        
    },
    mounted() {
        this.setupFirebase();
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
                console.log(user);
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
            firebasetest:true
        };
    }
};
</script>  

<style lang="scss">
body {
    margin: 0;

    background-color: rgb(227, 221, 221);
    ;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: -0px !important;
}
</style>
