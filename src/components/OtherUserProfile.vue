<template>
<div class="profile">

<div v-if="this.imgSrc" class="profile-pic">
<img v-bind:src="imgSrc" alt="" class="imgSrc">
</div>
<div v-else class="circle-pic"></div>
<div class="profile-name">{{name}}</div>
<div class="profile-bio">{{bio}}</div>

<div class="musics">
<div v-for="music in musics" :key="music.postName" class="postcollection">
        <div class="postcollection-square"></div>
        <router-link :to="{name:'MusicPage',
        params:{
            postID:music.postID,
        }}">
            <div class="postname">{{music.postName}}</div>
        </router-link>
        <div class="postbio">{{music.postBio}}</div>
        <div class="posttype">{{music.postType}}</div>
</div> 
</div>

</div>
</template>

<script>
import {fb,db} from './firebaseinit.js'
export default {
    name:'OtherProfile',
  data() {
        return {
            name:"",
            imgSrc:"",
            bio:"",
            musics:[]
        };
    },
    created() {
        var vm = this;
        this.$store.state.currentOtherUser = this.$route.params.userID;
        if (this.$store.state.currentOtherUser) {
            db.collection('profiles').doc(this.$store.state.currentOtherUser).get().then(doc =>{ 
            vm.bio = doc.data().bio;
            vm.name = doc.data().name;
            fb.storage().ref('profiles/'+this.$store.state.currentOtherUser+'/profile.jpg').getDownloadURL().then(imgUrl=>{
            this.imgSrc = imgUrl;
             })
         })
            db.collection('music').where('postUser','==',this.$store.state.currentOtherUser).get().then(querySnapshot =>{
            querySnapshot.forEach(doc=>{          
            this.musics.push(doc.data())
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

.musics{
   display: flex;
  flex-direction: row;
   flex-wrap: wrap;
  padding: 30px 0;
  margin: 0 120px;

}
.postcollection-square{
    width: 220px;
    height: 220px;
    background-color: rgb(227, 221, 221);
     border-radius: 15px;
     margin-bottom:20px ;
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

</style>
