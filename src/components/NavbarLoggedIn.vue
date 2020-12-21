<template>
<div>
    <div class="navbar">
        <div class="navbarLogo">
            <router-link to="/">
            <img src="../images/logosvg.svg" alt="">
            </router-link>
        </div>
        
    <div class="navbarButtons">  
        <button class="upload"><router-link to="/upload">Upload</router-link></button>
        <button v-on:click="signOut" class="signoutBtn"><router-link to="/">Log Out</router-link></button>
        <button class="user"><router-link to="/profile">{{this.$store.state.userName}}</router-link></button>
    </div>
    </div>

</div>
</template>

<script>


import {fb,db} from './firebaseinit.js'
export default {
     data() {
        return {
           
        }
    },
    
     created() {
        var user = fb.auth().currentUser;
      var vm = this;
       this.$store.state.userUID = user.uid;
      if (user) {
     db.collection('profiles').doc(user.uid).get().then(doc =>{
        this.$store.state.userName = doc.data().name;
        vm.name = this.$store.state.userName;
     })} 

     
     },
  
    computed: {

    },
    methods: {
        signOut() {
            fb
                .auth()
                .signOut()
                .then(() => {
               this.$store.state.userUID = null;
               this.$store.state.userName = null;
                });
        }
    }, 
}
</script>

<style>
.navbar {
    display: flex;
    align-items: center;
    padding-top: 20px;
    padding-right: 20px;
    justify-content: space-between;
}

.navbarLogo{
    margin-left: 110px;
    display: flex;
   
}
.navbarLogo img{
     width: 40px;
   cursor: pointer;
}


.navbar button {
    text-decoration: none;
    font-size: 20px;
    margin: 30px 10px;
    border: none;
    outline: none;
    background: transparent;
    cursor: pointer;
}
a{
    text-decoration: none;
    color: rgb(50, 26, 5);
}

</style>
