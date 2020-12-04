<template>
<div>
    <div class="navbar">
        <button v-on:click="popupsignin=!popupsignin;" class="upload">Upload</button>
        <button v-on:click="signOut" class="signoutBtn"><router-link to="/">Log Out</router-link></button>
        <button class="user"><router-link to="/profile">{{this.$store.state.name}}</router-link></button>
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
         console.log(doc.data().name);
        this.$store.state.name = doc.data().name;
        vm.name = this.$store.state.name;
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
               this.$store.state.name = null;
                });
        }
    }, 
}
</script>

<style>
.navbar {
    display: flex;
    justify-content: flex-end;
    padding-top: 20px;
    padding-right: 20px;
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
