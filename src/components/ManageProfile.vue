<template>
<div class="manage">
   <div class="update-profile">
    <div class="name">
        <p>Name :</p>
        <input type="text" v-model="name" />
    </div>   
    <div class="bio">
        <p>Bio :</p>
        <input type="text" v-model="bio" />
    </div>
    <div class="picture">
        <p>Profile picture:</p>
        <input type="file" v-on:change="chooseFile" class="uploadImage"/>
    </div>
    <button class="updateProfile" v-on:click="updateProfile" >Update</button>
    </div>
   
    

</div>
</template>

<script>
import {fb,db} from './firebaseinit.js'
let file = {};
var userProfilePic = false;
export default {
  data() {
        return {
             name:"",
             bio:"",
            
             
        };
    },
    created(){
        var user = fb.auth().currentUser;
        this.$store.state.userUID = user.uid;
         
    },
     methods:{
         updateProfile(){
             var user = fb.auth().currentUser;
             var profileUpdate = db.collection("profiles").doc(this.$store.state.userUID);
             if (this.name === "") this.name = this.$store.state.userName;
             else this.$store.state.name = this.name;
              if (this.bio === "") this.bio = this.$store.state.bio;
             else this.$store.state.bio = this.bio;
             if(userProfilePic){
                fb.storage().ref('profiles/'+ this.$store.state.userUID + '/profile.jpg').put(file).then(function(){
                    alert("upload success");
                    return profileUpdate.update({
                        profilePic:true
                    });
                });
            }
            if (user) {
                return profileUpdate.update({
                name:this.name,
                bio:this.bio   
            });
            } 
        }, 
        chooseFile(e){
          
            if(e.target.files[0]){
            file = e.target.files[0];
            userProfilePic = true;
            }
            
        }
     }
}
</script>

<style scoped>
.update-profile{
    display: flex;

    flex-direction: column;
    align-items: center;
    margin: 20px auto;
    width: 400px;
    height: 400px;
}
.name{
    display: flex;
    justify-content: flex-start;
    margin-bottom: 20px;
}
.name p{
    margin-right: 30px;
}
.name input {
    padding: 0;
    margin: 14px 0;
}
.bio{
    display: flex;
    justify-content: flex-start;
    margin-bottom: 20px;
}

.bio p{
    margin-right: 50px; 
}
.bio input{
    padding: 0;
    margin: 14px 0;
    padding-bottom: 30px;
}
.picture{
    display: flex;
    justify-content: center;
    align-items:center ;
}
.picture p{
    margin-left: 75px;
    margin-right:0px;
    width: max-content;
    text-align: left;
}

.picture input {
    padding: 2rem 1.5rem;
    
}
.picture input:focus{
  outline: none;
}

.updateProfile{
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

.updateProfile:hover{
    color: rgb(50, 26, 5);
    background-color: rgb(227, 221, 221);
    border-color: rgb(50, 26, 5);
    transition: 0.3s;
}

</style>
