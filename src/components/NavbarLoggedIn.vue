<template>
<div>
    <div class="navbar">
        <div class="navbarLogo">
            <router-link to="/">
            <img src="../images/logosvg.svg" alt="">
            </router-link>
        </div>
        
    <div class="navbarLoginButtons">  
        <router-link to="/upload" ><button class="upload" v-bind:class="{'uploadHover':$route.path == '/profile' || $route.path =='/profile/:userID' || $route.path =='/manage'}"><img src="../images/uploadsvg.svg"><p>上傳</p></button></router-link>
        <router-link to="/"><button v-on:click="signOut" class="signoutBtn">登出</button></router-link>
        <router-link to="/profile" class="imgRouter">
       
            <img v-bind:src="this.$store.state.userProfilePic" alt="" class="imgSrc">
      
        </router-link>
        
    </div>
    </div>

</div>
</template>

<script>


import {fb,db} from './firebaseinit.js'
export default {
     data() {
        return {
           imgSrc:""
        }
    },
    
     created() {
        this.$store.state.userProfilePic = ''
        var user = fb.auth().currentUser;
        var vm = this;
        this.$store.state.userUID = user.uid;
        if (user) {
            db.collection('profiles').doc(user.uid).get().then(doc =>{
            this.$store.state.userName = doc.data().name;
            vm.name = this.$store.state.userName;
     })} 
    
        db.collection('profiles').doc(user.uid).get().then((doc)=>{
            this.$store.state.userProfilePic = doc.data().profilePic;
        })
   
     
     },
  
    computed: {

    },
    methods: {
        signOut() {
            fb
                .auth()
                .signOut()
                .then(() => {
                this.$store.state.userProfilePic = ""
               this.$store.state.userUID = null;
               this.$store.state.userName = null;
               this.$store.state.userloggedin = false;
               this.imgSrc = "";
                });
        }
    }, 
}
</script>

<style>
.navbar {
    display: flex;
    align-items: center;
    padding: 40px 0px 40px 0px;
    justify-content: space-between;
    margin-right:100px;
}


.navbarLogo{
    margin-left: 110px;
    display: flex;
   
}
.navbarLogo img{
    width: 60px;
   cursor: pointer;
}

a{
   text-decoration: none;
}

.navbarLoginButtons{
    display: flex;
    justify-content: center;
    align-items:center;
    outline: none;
}
.navbarLoginButtons a{
    margin-left:30px;
}
.navbar button {
    
    font-size: 20px;
   
    outline: none;
    
   
}

.uploadHover:hover{

background-color: #e8dfda !important;

}

.navbarLoginButtons .upload{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px 14px 5px 17px;
    border: 2px solid #513E41;
    border-radius: 25px;
    background-color: #513E41;
    color:#FFF6F6 ;
    letter-spacing: 2px;
    transition: 0.2s;
    outline: none;
    cursor: pointer;
  
}
.navbarLoginButtons .upload img{
    width: 25px;
    margin-right:10px;
    
}



.navbarLoginButtons .upload p{
   font-size: 20px;
   margin: 0;
}
.navbarLoginButtons .upload:hover{
   transition: 0.2s;
    background-color: #FFF6F6;
    color:rgb(50, 26, 5);
    
}



.signoutBtn{
   padding: 3px 17px 3px 20px;
  outline: none;
  border: 2px solid #e8dfda;
  border-radius: 25px;
  background-color: #e8dfda;
  color:rgb(50, 26, 5);
    cursor: pointer;
}
.imgRouter img{
    width: 55px;
    height: 55px;
    object-fit: cover;
    display: flex;
    justify-content: center;
    margin: auto;
    
    cursor: pointer;
}
.imgSrc{
     
     border-radius: 50%;
     
}


</style>
