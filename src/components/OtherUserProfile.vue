<template>
<div class="profile">
<div class="profile-data">
    <img v-bind:src="imgSrc" alt="" class="imgSrc">

    <div class="profile-name">{{name}}</div>

    <div class="social-links">
    <a :href="facebook" v-if="facebook !=''" target="_blank"><img src="../images/Facebook.svg" alt=""></a>
    <a :href="instagram" v-if="instagram !=''" target="_blank"><img src="../images/Instagram.svg" alt=""></a>
    <a :href="twitter" v-if="twitter !=''" target="_blank"><img src="../images/Twitter.svg" alt=""></a>
    </div>
    <div class="profile-bio">{{bio}}</div>

    <div v-if="this.$store.state.userloggedin">
    
   
    <div class="interactionButtons">
        
    <div v-if="following"><button v-on:click="unFollow" class="followButton"><img src="../images/followedButton.svg">追蹤中</button></div>
    <div v-else><button v-on:click="Follow" class="followButton"><img src="../images/followButton.svg">追蹤</button></div>
    
    <div><button v-on:click="openchat" class="chatButton"><img src="../images/chatButton.svg">聊天</button></div>
    </div>
  


   
    
</div>
</div>

<div class="musicContents">
     <div class="guideNav" v-if="uploaded">
        <div class="guideButtons">
        <button v-if="uploaded" class="active">音樂</button>
    </div>
    </div>
    <div v-else>尚無資料</div>
    <div v-if="uploaded" class="musics">
<div v-for="music in musics" :key="music.postName" class="postcollection">
        <img v-bind:src="music.ImgSrc" alt="" class="postcollection-square">
        <router-link :to="{name:'MusicPage',
        params:{
            postID:music.postID,
        }}">
            <h1 class="postname">{{music.postName | capitalize}}</h1>
        </router-link>
        <div class="posttype">{{music.postType | capitalize}}</div>
</div> 
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
            uploaded:false,
            facebook:'',
            instagram:'',
            twitter:'',
            following:false,
            card:''
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
            vm.$router.push('/profile'); 
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
              if(this.uploaded){
                this.card = "Creator";
               
            }else{
               this.card = "Member";
            }
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
.guideNav{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom:30px;
    
}
.guideButtons .active{
    background-color:#513E41;
    border:2px solid #513E41;
    color: #FFF6F6;
    outline: none;
    transition: 0.2s;
}
.guideButtons{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 40px;
    
}
.guideButtons button{
  text-align: center;
    padding: 7px 17px 7px 17px;
    margin-right: 20px;
    font-size: 15px;
    border-radius: 22px;
    background-color: #e8dfda;
    border:2px solid #e8dfda;
    outline: none;
    transition: 0.2s;
    box-shadow: 1px 4px 10px #a5a5a5;
    color:rgb(50, 26, 5);
    letter-spacing: 1px;
}
.profile{
    display: flex;
    justify-content: flex-start;
    height: max-content;
}
.profile-data{
    margin-left: 150px;
    width: 380px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: 90vh;
}
.imgSrc{
    width: 250px;
    height: 250px;
    border-radius: 50%;
    object-fit: cover;
    display: flex;
    justify-content: center;
    margin-top: 40px;
}

.musicContents{
    
    margin-left: 60px;
    width:800px;
  
}

.profile-name{
    font-size: 48px;
    margin-top: 10px;
    width:max-content;
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


.profile-bio{
    margin-top: 10px;
    font-size:18px;
    text-align: left;
    line-height: 30px;
    width: 300px;
}

.social-links img{
    width: 45px;
   margin: 10px 10px 0px 0px;
    transition:0.2s ;
}

.social-links img:hover{
   transition:0.2s ;
   opacity: 0.6;
}
.interactionButtons{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}
.interactionButtons button{
    font-size: 15px;
    letter-spacing: 1.5px;
    border-radius:25px;
    border: 2px solid #513E41;
    padding: 8px 13px;
    cursor: pointer;
    transition: 0.3s;
    outline: none;
    display: flex;
    align-items: center;
}
.chatButton{
    background-color:#513E41;
    color:#FFF6F6;
    margin-left:10px ;
}
.chatButton img{
    width: 18px;
    margin-right:8px ;
}
.followButton{
    background-color: #e8dfda;
}
.followButton img{
    width: 18px;
    margin-right:8px;

}

.musicContents{
    
    margin-left: 60px;
    width:800px;
}
.musics{
   display: flex;
  flex-direction: row;
   flex-wrap: wrap;
justify-content: space-between;

   
}
.postcollection-square{
    width: 200px;
    height: 220px;
    background-color: #D3CCC2;
     border-radius: 15px;

     margin-bottom:10px;
}
.postcollection{
    width: 250px;
    height: 320px;
    color: rgb(50, 26, 5);
    display: flex;
    align-items:center;
    justify-content:flex-end;
    flex-direction: column;
    margin: 10px 0px;
    padding-bottom: 20px;
   background-color: #D3CCC2;
   border-radius: 15px;
}
.postname{
    font-size:20px;
}

</style>
