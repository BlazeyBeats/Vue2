<template>
<div id="app">
    
    <app-navbar-loggedin v-if="this.$store.state.userloggedin"></app-navbar-loggedin>
    <app-navbar-loggedout v-else></app-navbar-loggedout>

    <router-view><app-mainpage></app-mainpage></router-view>
   
</div>
</template>

<script>
import NavbarLoggedOut from './components/NavbarLoggedOut';
import NavbarLoggedIn from './components/NavbarLoggedIn';
import MainPage from './components/MainPage';


import * as firebase from "firebase/app";
import "firebase/auth";



export default {
    components: {
       
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
                    this.$store.state.userloggedin = true;
                    
                    
                } else {
                    // No user is signed in.
                   
                    this.$store.state.userloggedin = false;
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
            firebasetest:false
        };
    }
};
</script>  

<style lang="scss">
body {
    margin: 0;

    background-color: #FFF6F6;
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
