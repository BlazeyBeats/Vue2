<template>
<div class="manage">
   <div class="update-profile">
    <p>Name :</p>
        <input type="text" v-model="name" />
        <p>Bio :</p>
        <input type="text" v-model="bio" />
        <p>Profile picture :</p>
        <input type="file" v-on:change="chooseFile" class="uploadImage"/>
    </div>
    <button v-on:click="updateProfile" >Update</button>

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
             bio:""
             
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

</style>
