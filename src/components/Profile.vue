<template>
<div class="profile">

<img v-bind:src="imgSrc" alt="" class="imgSrc">


<div class="profile-name">{{this.$store.state.userName}}</div>
<div class="profile-bio">{{bio}}</div>
<div class="social-links">
    <a :href="facebook" v-if="facebook !=''" target="_blank"><img src="../images/Facebook.svg" alt=""></a>
    <a :href="instagram" v-if="instagram !=''" target="_blank"><img src="../images/Instagram.svg" alt=""></a>
    <a :href="twitter" v-if="twitter !=''" target="_blank"><img src="../images/Twitter.svg" alt=""></a>
</div>

<div class="profile-manage"><router-link to="/manage"><button>Manage Profile</button></router-link></div>

 <button v-if="uploaded" v-on:click="OwnPosts=true;OwnLikes=false">Posts</button>
<button v-if="likes" v-on:click="OwnPosts=false;OwnLikes=true">Likes</button>

<div v-if="OwnPosts">
    <div v-if="uploaded" class="musics">
<div v-for="music in musics" :key="music.postName" class="postcollection">
         <img v-bind:src="music.ImgSrc" alt="" class="postcollection-square">
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

<div v-if="OwnLikes">
    <div v-if="likes" class="musics">
    <div v-for="LikedPost in LikedPosts" :key="LikedPost.postName" class="postcollection">
         <img v-bind:src="LikedPost.ImgSrc" alt="" class="postcollection-square">
        <router-link :to="{name:'MusicPage',
        params:{
            postID:LikedPost.postID,
        }}">
            <h1 class="postname">{{LikedPost.postName}}</h1>
        </router-link>
        <div class="posttype">{{LikedPost.postType}}</div>
</div> 
</div>
</div>




</div>
</template>

<script>
import {fb,db} from './firebaseinit.js'
export default {
  data() {
        return {
            imgSrc:"",
            bio:"",
            musics:[],
            LikedPosts:[],
            uploaded:false,
            likes:false,
            OwnPosts:true,
            OwnLikes:false,
            facebook:'',
            instagram:'',
            twitter:''
        };
    },
    created() {
        var user = fb.auth().currentUser;
        var vm = this;
        var LikedPosts =[];
        if (user) {
            db.collection('profiles').doc(user.uid).get().then(doc =>{ 
            vm.facebook = doc.data().Facebook;
            vm.instagram = doc.data().Instagram;
            vm.twitter = doc.data().Twitter;
            vm.bio = doc.data().bio;
            LikedPosts = doc.data().LikedPosts;

            
            if(LikedPosts){
                var i = Number(LikedPosts.length)-1;
                for(i; i>=0;i--){
                db.collection('music').doc(LikedPosts[i]).get().then(doc =>{
              this.LikedPosts.push(doc.data());
              this.likes = true;
        })
            }

            }
           
        var profilepic = doc.data().profilePic
            
            if ( profilepic == true) {
                fb.storage().ref('profiles/'+this.$store.state.userUID+'/profile.jpg').getDownloadURL().then(imgUrl=>{
                this.imgSrc = imgUrl;
             })
            } else{
                this.imgSrc = "https://firebasestorage.googleapis.com/v0/b/vue2-41a3c.appspot.com/o/Red.jpg?alt=media&token=b6ee019f-d2c8-4e26-b734-e315b4a99cd6"
            }
         })
           db.collection('music').where('postUser','==',user.uid).orderBy("postID","desc").get().then(querySnapshot =>{
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

.social-links img{
    width: 45px;
   margin: 25px 10px 10px 10px;
    transition:0.2s ;
}

.social-links img:hover{
   transition:0.2s ;
   opacity: 0.6;
}


.profile-manage{
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
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
