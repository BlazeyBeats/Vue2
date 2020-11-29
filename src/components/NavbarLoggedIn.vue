<template>
<div>
    <div class="navbar">
        <button v-on:click="popupsignin=!popupsignin;" class="upload">Upload</button>
        <button v-on:click="signOut" class="signoutBtn"><router-link to="/">Log Out</router-link></button>
        <button class="user"><router-link to="/profile">{{name}}</router-link></button>
    </div>

</div>
</template>

<script>


import {fb,db} from './firebaseinit.js'
export default {
     data() {
        return {
           name:""
        }
    },
     created() {
         var user = fb.auth().currentUser;
      var vm = this;
      if (user) {
     db.collection('profiles').doc(user.uid).get().then(doc =>{
         console.log(doc.data().name);
    vm.name = doc.data().name;
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
.user {
    padding-right: 100px;
}
</style>
