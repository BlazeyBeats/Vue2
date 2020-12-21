<template>
<div class="profile">

<div v-if="this.imgSrc" class="profile-pic">
<img v-bind:src="imgSrc" alt="" class="imgSrc">
</div>
<div v-else class="circle-pic"></div>
<div class="profile-name">{{name}}</div>
<div class="profile-bio">{{bio}}</div>
<div v-if="isthisyou" class="profile-manage"><router-link to="/manage"><button>Manage Profile</button></router-link></div>
<div v-if="uploaded" class="musics">
<div v-for="music in musics" :key="music.postName" class="postcollection">
        <div class="postcollection-square"></div>
        <router-link :to="{name:'MusicPage',
        params:{
            postID:music.postID,
        }}">
            <h1 class="postname">{{music.postName}}</h1>
        </router-link>
        <div class="posttype">{{music.postType}}</div>
</div> 
</div>

</div>
</template>

<script>
import {fb,db} from './firebaseinit.js'
export default {
    name:'Profile',
  data() {
        return {
            name:"",
            imgSrc:"",
            bio:"",
            musics:[],
            isthisyou:false,
            uploaded:false
        };
    },
    created() {
        var vm = this;
        if(this.$route.params.userID === this.$store.state.userUID){
            this.isthisyou = true;
        }
        this.$store.state.currentOtherUser = this.$route.params.userID;
        if (this.$store.state.currentOtherUser) {
            db.collection('profiles').doc(this.$store.state.currentOtherUser).get().then(doc =>{ 
            vm.bio = doc.data().bio;
            vm.name = doc.data().name;
            fb.storage().ref('profiles/'+this.$store.state.currentOtherUser+'/profile.jpg').getDownloadURL().then(imgUrl=>{
            this.imgSrc = imgUrl;
             })
         })
            db.collection('music').where('postUser','==',this.$store.state.currentOtherUser).orderBy("postID","desc").get().then(querySnapshot =>{
            querySnapshot.forEach(doc=>{          
            this.musics.push(doc.data());
            this.uploaded = true;
            })
        })
         }  
     },
}
</script>

<style scoped>

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
    margin-top: 80px;
    margin-bottom: 50px;
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
.musics{
   display: flex;
  flex-direction: row;
   flex-wrap: wrap;
  padding: 30px 80px;
    background-color:rgb(192, 187, 187);
    margin-top: 40px;
}
.postcollection-square{
    width: 220px;
    height: 220px;
    background-color: rgb(227, 221, 221);
     border-radius: 15px;

     margin-bottom:10px;
}
.postcollection{
    width: 270px;
    height: 320px;
    color: rgb(50, 26, 5);
    display: flex;
    align-items:center;
    justify-content:flex-end;
    flex-direction: column;
    margin: 20px 30px;
    padding-bottom: 20px;
   background-color: white;
   border-radius: 15px;
}
.postname{
    font-size:20px;

}

</style>
