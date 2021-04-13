<template>
<div id="app" v-bind:class="{'color':$route.path == '/profile' || $route.name == 'OtherProfile' || $route.path =='/manage'}">
    
    <app-navbar-loggedin v-if="this.$store.state.userloggedin"></app-navbar-loggedin>
    <app-navbar-loggedout v-else></app-navbar-loggedout>

    <router-view><app-mainpage></app-mainpage></router-view>
    <app-chatroom></app-chatroom>
</div>
</template>

<script>
import NavbarLoggedOut from './components/NavbarLoggedOut';
import NavbarLoggedIn from './components/NavbarLoggedIn';
import MainPage from './components/MainPage';
import ChatRoom from './components/Chatroom';

import * as firebase from "firebase/app";
import "firebase/auth";



export default {
    components: {
       
        'app-navbar-loggedout': NavbarLoggedOut,
        'app-navbar-loggedin': NavbarLoggedIn,
        'app-mainpage': MainPage,
        'app-chatroom':ChatRoom
        
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

a{
    text-decoration: none;
    color: rgb(50, 26, 5);
}
.color {
 background-color:#e8dfda !important;
 
}
body {
    margin: 0;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: -0px !important;
    background-color: #FFF6F6;
    
}


</style>
