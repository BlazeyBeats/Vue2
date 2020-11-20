<template>
<div>
    <div class="navbar">
        <button v-on:click="popupsignin=!popupsignin;" class="upload">Upload</button>
        <button v-on:click="signOut" class="signoutBtn">Log Out</button>
        <button class="user">{{name}}</button>
    </div>

</div>
</template>

<script>


import {fb,db} from './firebaseinit.js'
export default {
      data() {
        return {
            name:null
        }
    },
    mounted() {
        this.setupFirebase();
    },
    firestore(){
      
    },
     created() {
      if (fb.auth().currentUser) {
     
      this.name= db.collection('profiles').doc(fb.auth().currentUser.uid.name);
    }
        
            
       
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
    }
}
</script>

<style>
.navbar {
    display: flex;
    justify-content: flex-end;
}

.navbar button {
    font-size: 20px;
    margin: 30px 10px;
    border: none;
    outline: none;
    background: transparent;
    cursor: pointer;
}

.user {
    padding-right: 100px;
}
</style>
