<template>
<div class="manage">
   <div class="update-profile">
     <div class="picture">
      <div class="currentPic">
         <div class="loading">
            <div v-if="uploading" class="lds-ring"><div></div><div></div><div></div><div></div></div>
        <img v-else v-bind:src="this.currentPic" alt="" class="imgSrc">
         </div>
         
      </div> 
        <button @click="inputFiles()">更換大頭照</button>
        <input id="fileUpload" v-on:change=" chooseFile" type="file" hidden/>
    </div>
    <div class="userProfile">
       <div class="name">
            <p>暱稱</p>
        <input type="text" v-model="name" />
      </div>
      
    <div class="bio">
        <p>個人簡介</p>
        <textarea v-model="bio" ></textarea>
        
    </div>
      <div class="facebook">
        <p>臉書</p>
        <input type="text" v-model="facebook" />
    </div>
     <div class="instagram">
        <p>哀居</p>
        <input type="text" v-model="instagram" />
    </div>
    
    </div>
 
   <div class="updateProfileButton">
     <button class="updateProfile" v-on:click="updateProfile" >完成編輯</button> 
   </div>
        
  
  
    </div>
    
     
    

</div>
</template>

<script>
import {fb,db} from './firebaseinit.js'
let file = {};
var commentLoop=[];
var profilepicUpload = false;
export default {
  data() {
        return {
             name:"",
             bio:"",
             facebook:'',
            instagram:'',
           uploading:false,
            imgSrc:'',
            currentPic:''
            
             
        };
    },
    created(){
        var user = fb.auth().currentUser;
        this.$store.state.userUID = user.uid;
       


        db.collection('comments').where('user','==',user.uid).get().then(querySnapshot =>{
            querySnapshot.forEach(doc=>{          
            commentLoop.push(doc.id)
            
            })
           
        })
        
        db.collection('profiles').doc(user.uid).get().then(doc =>{
            this.currentPic = doc.data().profilePic
            this.$store.state.bio = doc.data().bio;
            this.$store.state.userName = doc.data().name;
         })
    },
    watch:{
   
    },
     methods:{
        inputFiles(){
            document.getElementById("fileUpload").click()
        },
         updateProfile(){
             var user = fb.auth().currentUser;
             var vm = this;
             var profileUpdate = db.collection("profiles").doc(user.uid);
              vm.$store.state.userProfilePic = vm.currentPic;
            
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
 

             if (this.name === "") this.name = this.$store.state.userName;
             else this.$store.state.userName = this.name;
              if (this.bio === "") this.bio = this.$store.state.bio;
             else this.$store.state.bio = this.bio;

             if(profilepicUpload){
              fb.storage().ref().child('profiles/'+ user.uid + '/Temporary.jpg').delete();
                fb.storage().ref('profiles/'+ user.uid + '/profile.jpg').put(file).then(function(){
                    fb.storage().ref('profiles/'+ user.uid + '/profile.jpg').getDownloadURL().then(url=>{
                    vm.imgSrc = url;
                    vm.$store.state.userProfilePic = vm.imgSrc;
                    db.collection('profiles').doc(user.uid).update({
                        profilePic:vm.imgSrc    
                    });

                if(commentLoop){
               
                for(var j=0; j<commentLoop.length;j++){
                    db.collection('comments').doc(commentLoop[j]).update({
                        profilePic:vm.imgSrc 
                    });
                }
            }
                   
                });
                    
                         
                });
            }
            if (user) {
                   if(commentLoop){
               
                for(var i=0; i<commentLoop.length;i++){
                    db.collection('comments').doc(commentLoop[i]).update({
                         name:this.name, 
                    });
                }
            }
                profileUpdate.update({
                name:this.name,
                bio:this.bio   
            });
                 this.$router.push('/profile');
            } 
            
        }, 
        chooseFile(e){
          var vm = this;
         var user = fb.auth().currentUser;
            if(e.target.files[0]){
               this.uploading = true;
            file = e.target.files[0];
           
            fb.storage().ref('profiles/'+ user.uid + '/Temporary.jpg').put(file).then(function(){
                    fb.storage().ref('profiles/'+ user.uid + '/Temporary.jpg').getDownloadURL().then(url=>{
                    vm.currentPic = url;
                   vm.uploading = false;
                });      
                });
            profilepicUpload = true;
            
            }
            
        }
     }
}
</script>

<style scoped>
.manage{
  height: 85vh;
  background-color: #e8dfda;
  display: flex;
  justify-content: center;
  align-items: flex-start;
 
}
.update-profile{
  height: 500px;
    display: flex;
   justify-content: center;
    width: max-content;
   align-items: center;
    

}
.picture{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 20px;
    margin-right: 50px;
   
}
.picture button{
   letter-spacing: 1px;
   margin-top: 20px;
   background-color: #e8dfda;
   color: rgb(50, 26, 5);
    margin-right:0px;
    width: max-content;
    font-size: 40px;
    text-align: center;
    cursor: pointer;
    outline: none;
    border:none;
}

.picture input {
    padding: 2rem 1.5rem;
    
}
.picture input:focus{
  outline: none;
}
.loading{
   width: 250px;
   height: 250px;
   display: flex;
   justify-content: center;
   align-items: center;
}
.currentPic img{
width: 250px;
height: 250px;
object-fit: cover;
}
.name{
   width: 300px;
   display: flex;
   align-items: center;
   justify-content: flex-start;
   flex-direction:column-reverse ;
}
.userProfile input{
   font-size: 18px;
    padding-left: 10px;
    background-color: rgb(239, 243, 243);
    width: 250px;
    height: 30px;
    resize: none;
    border: 2px solid #bdb6ac;
    border-radius: 55px;
    outline: none;
}

.userProfile div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    margin-bottom: 10px;
   
}

.userProfile p{
   color:rgb(50, 26, 5);
   font-size:18px ;
   letter-spacing: 1px;
}

.bio textarea{
   font-family: Avenir, Helvetica, Arial, sans-serif;
    background-color: rgb(239, 243, 243);
   border: 2px solid #bdb6ac;
   width: 500px;
   border-radius: 35px;
   outline: none;
   height: 100px;
   padding-top: 20px;
     padding-left: 10px;
    font-size: 18px;
    resize: none;
}
.bio textarea:active {
        width: auto;   
    }
.bio textarea:focus {
        min-width: 500px;
        resize: none;
        outline: none;
    }
.facebook input{
   width: 500px;
}
.instagram input{
   width: 500px;
}
.updateProfileButton{
  height:500px;
  display:flex;
   align-items:flex-end;
   margin-left:50px;
   margin-bottom:10px;
}
.updateProfile{
  width: max-content;
   display: flex;
   align-items: center;
   height: 40px;
   letter-spacing: 1px;
    color: white;
    font-size: 16px;
    background-color: #513E41;
    padding: 10px 15px;
    border-style: solid;
    border-color: #513E41;
    border-radius: 35px;
    cursor: pointer;
    transition: 0.3s;
    outline: none;
}

.updateProfile:hover{
    color: #513E41;
    background-color: rgb(227, 221, 221);
    border-color: #513E41;
    transition: 0.3s;
}


.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid #fff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@media screen and (max-width: 425px) {
  .manage{
  flex-direction: column;
 padding: 0px 40px;
 height: max-content;
}
.update-profile{
  height: 100%;
   flex-direction: column;
   justify-content: flex-start;
  width: 100%;
}
.picture{
  margin-top: 20px;
    padding: 0px;
    margin-right: 0px;
   
}

.userProfile{
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}
.userProfile input{
    width: 100%;
    box-sizing:border-box;
    height: 35px;
}
.name{
   width: 100%;
}

.bio textarea{
   width:100%;
    box-sizing:border-box;
    border-radius: 28px;
}
.bio textarea:active {
        width: 100%;   
    }
.bio textarea:focus {
    min-width:100%;
    }
.facebook input{
   width: 100%; 
    box-sizing:border-box;
}
.instagram input{
  width: 100%; 
   box-sizing:border-box;
}
.updateProfileButton{
  height:max-content;
  display:flex;
   align-items:center;
   margin-top: 30px;
   margin-left:0px;
   margin-bottom:40px;
}

}

</style>
