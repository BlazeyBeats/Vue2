<template>
<div class="profile">

<img v-bind:src="this.$store.state.userProfilePic" alt="" class="imgSrc">


<div class="profile-name">{{this.$store.state.userName}}</div>
<div class="card" v-bind:class="{'cardCreator':card == 'Creator' ,'cardMember':card == 'Member'}"><div v-bind:class="{'circleCreator':card == 'Creator' ,'circleMember':card == 'Member'}"></div>{{this.card}}</div>
<div class="profile-bio">{{bio}}</div>
<div class="social-links">
    <a :href="facebook" v-if="facebook !=''" target="_blank"><img src="../images/Facebook.svg" alt=""></a>
    <a :href="instagram" v-if="instagram !=''" target="_blank"><img src="../images/Instagram.svg" alt=""></a>
    <a :href="twitter" v-if="twitter !=''" target="_blank"><img src="../images/Twitter.svg" alt=""></a>
</div>

<div class="profile-manage"><router-link to="/manage"><button>編輯資料</button></router-link></div>




<div class="musicContents">
    <div class="guideNav" v-if="uploaded || likes || following">
        <div class="guideButtons">
    <button v-if="uploaded" v-on:click="OwnPosts=true;OwnLikes=false;OwnFollowing=false" v-bind:class="{ active: OwnPosts }">音樂</button>
    <button v-if="likes" v-on:click="OwnPosts=false;OwnLikes=true;OwnFollowing=false" v-bind:class="{ active: OwnLikes }">收藏</button>
    <button v-if="following" v-on:click="OwnPosts=false;OwnLikes=false;;OwnFollowing=true" v-bind:class="{ active: OwnFollowing }">追蹤中</button>
</div>
    </div>

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

<div v-if="OwnFollowing">
    <div v-if="following" class="musics">
    <div v-for="Following in Followings" :key="Following.name" class="followingcollection">
         <img v-bind:src="Following.profilePic" alt="" class="followingcollection-square">
        <router-link :to="{name:'OtherProfile',
        params:{
            userID:Following.userUID,
        }}">
            <h1 class="postname">{{Following.name}}</h1>
        </router-link>
</div> 
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
            bio:"",
            musics:[],
            LikedPosts:[],
            Followings:[],
            uploaded:false,
            likes:false,
            following:false,
            OwnPosts:true,
            OwnLikes:false,
            OwnFollowing:false,
            facebook:'',
            instagram:'',
            twitter:'',
            card:''
        };
    },
    watch:{
  
    },
    created() {
        var user = fb.auth().currentUser;
        var vm = this;
        var LikedPosts =[];
        var Following =[];
        if (user) {
            db.collection('profiles').doc(user.uid).get().then(doc =>{ 
            vm.facebook = doc.data().Facebook;
            vm.instagram = doc.data().Instagram;
            vm.twitter = doc.data().Twitter;
            vm.bio = doc.data().bio;
            this.$store.state.userProfilePic = doc.data().profilePic;
            LikedPosts = doc.data().LikedPosts;
            Following = doc.data().Following;
            
            if(LikedPosts){
                var i = Number(LikedPosts.length)-1;
                for(i; i>=0;i--){
                    db.collection('music').doc(LikedPosts[i]).get().then(doc =>{
                    this.LikedPosts.push(doc.data());
                    this.likes = true;
                    if(this.uploaded ===false){
                        this.OwnLikes = true;
                    }
                    })   
                }
            }

            if(Following){
                var j = Number(Following.length)-1;
                for(j; j>=0;j--){
                    db.collection('profiles').doc(Following[j]).get().then(doc =>{
                    this.Followings.push(doc.data());
                    this.following = true;
                    console.log(this.uploaded);
                    console.log(this.OwnLikes)
                    if(this.uploaded ===false && this.OwnLikes ===false){
                        this.OwnFollowing = true;
                    }
                    })
                }
            }
           
       
         })
           db.collection('music').where('postUser','==',user.uid).orderBy("postID","desc").get().then(querySnapshot =>{
            querySnapshot.forEach(doc=>{          
            this.musics.push(doc.data());
            this.uploaded = true;
            this.OwnLikes = false;  
            })
           
            if(this.uploaded){
                this.card = "Creator";
               
            }else{
               this.card = "Member";
            }

            

           
        }) 
         }


        
     },
    mounted(){
        
        
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


.profile-name{
    font-size: 45px;
    
    display: flex;
    justify-content: center;
    margin: 15px auto;
    width:max-content;
    color:rgb(50, 26, 5);
}

.card{
    font-size:20px;
    width: max-content;
    display: flex;
    justify-content: center;
    margin: 10px auto;
    align-items: center;
    letter-spacing: 1px;
}
.circleCreator{
    width: 20px;
    height: 20px;
    background-color:#e8dfda;
    border-radius: 50%;
    margin-right:8px;
}
.cardCreator{
    background-color: rgb(50, 26, 5);
    color:#e8dfda;
    padding:8px 12px;
    border:2px solid rgb(50, 26, 5);
    border-radius: 35px;
}

.circleMember{
    width: 20px;
    height: 20px;
    background-color:rgb(50, 26, 5);
    border-radius: 50%;
    margin-right:8px;
}
.cardMember{
    background-color: #FFF6F6;
    color:rgb(50, 26, 5);
    padding:8px 12px;
    border:2px solid #FFF6F6;
    border-radius: 35px;
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
    margin-top: 40px;
    margin-bottom: 30px;
    margin-right:200px ;
}
.profile-manage button{
    color: #FFF6F6;
    font-size: 16px;
    background-color: rgb(50, 26, 5);
    padding: 10px 15px;
    border-style: solid;
    border-color: rgb(50, 26, 5);
    border-radius: 35px;
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

.musicContents{
    background-color:#FFF6F6;
}
.guideNav{
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    margin-left: 100px;
    margin-right: 100px;
}
.guideButtons .active{
    background-color:rgb(50, 26, 5);
    border:2px solid rgb(50, 26, 5);
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
    cursor: pointer;
    outline: none;
    transition: 0.2s;
    box-shadow: 1px 4px 10px #a5a5a5;
    color:rgb(50, 26, 5);
    letter-spacing: 1px;
}
.musics{
   display: flex;
  flex-direction: row;
   flex-wrap: wrap;
  padding: 30px 80px;
   
}
.postcollection-square{
    width: 220px;
    height: 220px;
    background-color: #D3CCC2;
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
   background-color: #D3CCC2;
   border-radius: 15px;
}
.postname{
    font-size:20px;
}
.followingcollection{
   width: 270px;
    height: 320px;
    color: rgb(50, 26, 5);
    display: flex;
    align-items:center;
    justify-content:flex-end;
    flex-direction: column;
    margin: 20px 30px;
    padding-bottom: 20px;
    border-radius: 15px;
}

.followingcollection-square{
    width: 220px;
    height: 220px;
    border-radius: 50%;
}
</style>
