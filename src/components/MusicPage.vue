<template>
<div class="musicpage">
    <div class="musicsrc">
        <audio controls :src="musicSrc" alt="" class="audio">
        </audio>
    </div>
    <div class="postinfo">
    <h1>{{postName}}</h1>
    <h1>{{postBio}}</h1>
    <router-link :to="{name:'OtherProfile',
        params:{
           userID:postUserID,
        }}">
        <h1 class="postUser">{{postUser}}</h1>
    </router-link>
    <div v-if="imgSrc" class="profile-pic">
        <img v-bind:src="imgSrc" alt="" class="imgSrc">
    </div>
    <div v-else class="circle-pic"></div>
</div>

</div>
</template>

<script>

import {fb,db} from './firebaseinit.js';

export default {
 name:'MusicPage',
 data(){
     return{
        postName:"",
        postBio:"",
        postUser:"",
        postUserID:"",
        imgSrc:"",
        musicSrc:""
     }
 },
created(){
    this.$store.state.currentPost = Number(this.$route.params.postID);
   var vm = this;
   if(this.$store.state.currentPost){

    

    db.collection("music").where('postID','==',this.$store.state.currentPost).get().then(querySnapshot =>{
            querySnapshot.forEach(doc=>{ 
            this.postName = doc.data().postName;
            this.postBio = doc.data().postBio;
            this.musicSrc = doc.data().postUrl;
            this.postUserID = doc.data().postUser;
    if(this.postUserID){
    db.collection("profiles").doc(this.postUserID).get().then(doc =>{ 
        vm.postUser = doc.data().name;
    });
    fb.storage().ref("profiles/"+this.postUserID+"/profile.jpg").getDownloadURL().then(imgUrl=>{
    this.imgSrc = imgUrl;
    })
    }
    })
    })


   }
   
    


 }
  
}
</script>

<style scoped>
.musicpage{
    margin: 20px 100px;
    padding: 20px;
    background-color: white;
    border-radius:20px;
    display: flex;
    justify-content: space-between;
    height: 600px;
}
.musicsrc{
    width: 500px;
    margin:30px;
    background-color:rgb(227, 221, 221);
    border-radius:20px;
    display: flex;
    align-items: flex-end;
    justify-content:center ;
}

audio::-webkit-media-controls-panel {
     background-color:rgb(247, 247, 247);
}

audio:focus{
      outline: none;
}


.audio{
   background-color:rgb(247, 247, 247);
padding:10px 0 10px 0;
width: 500px;
border-radius: 0;
    
}
.postinfo {
    display: flex;
    justify-content:center;
   
}
.postUser{
    width: max-content;
    font-size: 20px;
    margin: auto;
    padding: 0;
    display: flex;
    justify-content: center;
}
.imgSrc{
    
    width: 250px;
    height: 250px; 
    border-radius: 50%;
    object-fit: cover;
      display: flex;
    justify-content: center;
    margin: auto;
    margin-top: 80px;
}
.circle-pic{
    width: 250px;
    height: 250px; 
    border-radius: 50%;
    background-color: rgb(50, 26, 5) ;
   display: flex;
    justify-content: center;
    margin: auto;
    margin-top: 80px;
}
</style>
