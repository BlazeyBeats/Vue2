<template>
<div class="profile">

<div v-if="this.imgSrc" class="profile-pic">
<img v-bind:src="imgSrc" alt="" class="imgSrc">
</div>
<div v-else class="circle-pic"></div>
<div class="profile-name">{{name}}</div>
<div class="profile-bio">{{bio}}</div>
<div class="social-links">
    <a :href="facebook" v-if="facebook !=''" target="_blank"><img src="../images/Facebook.svg" alt=""></a>
    <a :href="instagram" v-if="instagram !=''" target="_blank"><img src="../images/Instagram.svg" alt=""></a>
    <a :href="twitter" v-if="twitter !=''" target="_blank"><img src="../images/Twitter.svg" alt=""></a>
</div>

<div v-if="this.$store.state.userloggedin">
    <div v-if="isthisyou" class="profile-manage"><router-link to="/manage"><button>Manage Profile</button></router-link></div>
<div v-else class="profile-manage">
    <div><button v-on:click="openchat">Message</button></div>
    <div v-if="following"><button v-on:click="unFollow">Unfollow</button></div>
    <div v-else><button v-on:click="Follow">Follow</button></div>
    
</div>
</div>

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
</template>

<script>
import {fb,db,firebase} from './firebaseinit.js'
export default {
    name:'Profile',
  data() {
        return {
            name:"",
            imgSrc:"",
            bio:"",
            musics:[],
            isthisyou:false,
            uploaded:false,
            facebook:'',
            instagram:'',
            twitter:'',
            following:false
        };
    },
   watch: {
    '$route.params.userID': function () {
      this.doStuff();
    }
  },
    created() {
        this.doStuff();
        
     },
     methods:{
         doStuff(){
             var vm = this;
             this.musics = [];
        var user = fb.auth().currentUser;
        var followArray=[];
        if(this.$route.params.userID === this.$store.state.userUID){
            this.isthisyou = true;
        }
        this.$store.state.currentOtherUser = this.$route.params.userID;
        if (this.$store.state.currentOtherUser) {
            db.collection('profiles').doc(this.$store.state.currentOtherUser).get().then(doc =>{ 
            vm.bio = doc.data().bio;
            vm.name = doc.data().name;
            vm.facebook = doc.data().Facebook;
            vm.instagram = doc.data().Instagram;
            vm.twitter = doc.data().Twitter;
            followArray = doc.data().Followers;
            if(user){
                 for(var i=0; i<followArray.length;i++){
                var name = followArray[i];
                if(name == user.uid ){
                    this.following = true;
                    break;
                }else{
                    this.following = false;
                }
            }

            }
            
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

         Follow(){
          
            var user = fb.auth().currentUser;
            db.collection('profiles').doc(user.uid).update({
            Following: firebase.firestore.FieldValue.arrayUnion(this.$store.state.currentOtherUser)
        });
          db.collection('profiles').doc(this.$store.state.currentOtherUser).update({
            Followers: firebase.firestore.FieldValue.arrayUnion(user.uid)
        });
        this.following = true;
         },

         unFollow(){
            var user = fb.auth().currentUser;
            db.collection('profiles').doc(user.uid).update({
            Following: firebase.firestore.FieldValue.arrayRemove(this.$store.state.currentOtherUser)
        });
          db.collection('profiles').doc(this.$store.state.currentOtherUser).update({
            Followers: firebase.firestore.FieldValue.arrayRemove(user.uid)
        });
        this.following = false;
         },
         openchat(){
             this.$store.state.openchat = true;
             this.$store.state.messageUser = this.$store.state.currentOtherUser;
             
         }

     }
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
    margin-left: 20px;
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
