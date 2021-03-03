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
      <div class="facebook">
        <p>Facebook :</p>
        <input type="text" v-model="facebook" />
    </div>
     <div class="instagram">
        <p>Instagram :</p>
        <input type="text" v-model="instagram" />
    </div>
     <div class="twitter">
        <p>Twitter :</p>
        <input type="text" v-model="twitter" />
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
var profilepicUpload = false;
export default {
  data() {
        return {
             name:"",
             bio:"",
             facebook:'',
            instagram:'',
            twitter:'',
            imgSrc:''
            
             
        };
    },
    created(){
        var user = fb.auth().currentUser;
        this.$store.state.userUID = user.uid;
        db.collection('profiles').doc(user.uid).get().then(doc =>{ 
            this.$store.state.bio = doc.data().bio;
            this.$store.state.userName = doc.data().name;
         })
    },
     methods:{
         updateProfile(){
             var user = fb.auth().currentUser;
             var vm = this;
             var profileUpdate = db.collection("profiles").doc(user.uid);
       if(this.facebook != ''){
        return profileUpdate.update({
            Facebook: this.facebook
        })
       }
        if(this.instagram != ''){
        return profileUpdate.update({
            Instagram: this.instagram
        })
       }
   if(this.twitter != ''){
        return profileUpdate.update({
            Twitter: this.twitter
        })
       }

             if (this.name === "") this.name = this.$store.state.userName;
             else this.$store.state.userName = this.name;
              if (this.bio === "") this.bio = this.$store.state.bio;
             else this.$store.state.bio = this.bio;
             if(profilepicUpload){
                 console.log(profilepicUpload)
                fb.storage().ref('profiles/'+ user.uid + '/profile.jpg').put(file).then(function(){
                    fb.storage().ref('profiles/'+ user.uid + '/profile.jpg').getDownloadURL().then(url=>{
                    vm.imgSrc = url;
                    vm.$store.state.userProfilePic = vm.imgSrc;
                    db.collection('profiles').doc(user.uid).update({
                        profilePic:vm.imgSrc    
                    });
                   
                });
                    
                         
                });
            }
            if (user) {
               
                profileUpdate.update({
                name:this.name,
                bio:this.bio   
            });
                 this.$router.push('/profile');
            } 
            
        }, 
        chooseFile(e){
          
            if(e.target.files[0]){
            file = e.target.files[0];
            profilepicUpload = true;
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
