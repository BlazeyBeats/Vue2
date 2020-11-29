<template>
<div class="profile">

<div v-if="profilepic" class="profile-pic"></div>
<div v-else class="circle-pic"></div>
<div class="profile-name">{{name}}</div>
<div class="profile-bio">{{bio}}</div>
<div class="profile-manage"><router-link to="/manage"><button>Manage Profile</button></router-link></div>

</div>
</template>

<script>
import {fb,db} from './firebaseinit.js'
export default {
  data() {
        return {
            profilepic: false,
             name:"",
             bio:""
        };
    },
    created() {
         var user = fb.auth().currentUser;
      var vm = this;
      if (user) {
     db.collection('profiles').doc(user.uid).get().then(doc =>{
         console.log(doc.data().name);  
    vm.name = doc.data().name;
    vm.bio = doc.data().bio;
     })}  
     },
}
</script>

<style scoped>
.circle-pic{
    width: 250px;
    height: 250px;
    background-color: rgb(50, 26, 5) ;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    margin: auto;
    margin-top: 80px;
}
.profile-name{
    font-size: 35px;
    background-color: rgb(180, 167, 156) ;
    padding: 12px 40px;
    display: flex;
    justify-content: center;
    margin: 40px auto;
    width:max-content;
    border-radius: 30px;
    color:rgb(50, 26, 5);
}
.profile-manage{
    display: flex;
    justify-content: flex-end;
    margin-top: 100px;
  margin-right:300px ;
}
.profile-manage button{
    color: white;
    font-size: 16px;
    background-color: rgb(50, 26, 5);
    padding: 15px;
    border-style: solid;
    border-color: rgb(50, 26, 5);
    border-radius: 10px;
    cursor: pointer;
    transition: 0.3s;
    outline: none;
}
.profile-manage button:hover{
      color: rgb(50, 26, 5);
    background-color: rgb(227, 221, 221);
    border-color: rgb(50, 26, 5);
    transition: 0.3s;
}
</style>
