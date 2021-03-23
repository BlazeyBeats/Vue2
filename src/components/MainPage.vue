<template>
<div class="mainpage">
<div class="intro">
    <div class="introBlock">
        <div class="introcontentleft">

            
      
        </div>
    </div>
</div>
<div class="guideNav">
    <div class="guideButtons">
         <button v-on:click="newPosts=true;following=false;hotPosts=false" v-bind:class="{ active: newPosts }">最新</button>
    <button v-on:click="hotPosts=true;following=false;newPosts=false" v-bind:class="{ active: hotPosts }">熱門</button>
    <div v-if="this.$store.state.userloggedin"><div v-if="followingFlag"><button v-on:click="following=true;newPosts=false;hotPosts=false" v-bind:class="{ active: following }">追蹤</button></div></div>
    </div>
   
    <div class ="guideSearch"><input type="text" v-model="search" placeholder="search music" @keyup.enter="searchMusic"></div>
</div>

<div class="musics" v-if="newPosts">
<div v-for="(music,idx) in filteredMusicNew" :key="idx" class="postcollection">
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

<div class="musics" v-if="hotPosts">
<div v-for="(music,idx) in filteredMusicHot" :key="idx" class="postcollection">
       <img v-bind:src="music.ImgSrc" alt="" class="postcollection-square">
        <router-link :to="{name:'MusicPage',
        params:{
            postID:music.postID,
        }}">
        <h1 class="postname">{{music.postName}}</h1>
        </router-link>
        <div class="posttype">{{music.postType | capitalize}}</div>
</div> 
</div>

<div v-if="this.$store.state.userloggedin">

    <div class="musics" v-if="following">
<div v-for="(music,idx) in filteredMusicFollowing" :key="idx" class="postcollection">
       <img v-bind:src="music.ImgSrc" alt="" class="postcollection-square">
        <router-link :to="{name:'MusicPage',
        params:{
            postID:music.postID,
        }}">
        <h1 class="postname">{{music.postName}}</h1>
        </router-link>
        <div class="posttype">{{music.postType | capitalize}}</div>
</div> 
</div>
</div>

</div>



</template>

<script>
import {db,fb} from './firebaseinit.js'

export default {
data() {
        return {
            musicsNew:[],
            musicsFollowing:[],
            musicsHot:[],
            hotPosts:false,
            newPosts:true,
            followingFlag:false,
            following:false,
            search:''
        };
    },
    watch:{
        '$store.state.userloggedin': function () {
      this.newPosts = true;
      this.hotPosts = false;
      this.following = false;
      this.musicsFollowing = [];
      var user = fb.auth().currentUser;
        var vm = this;
        var musicID = [];
        var followingPosts =[];
      if (user) {
           
            db.collection('profiles').doc(user.uid).get().then(doc =>{ 
            var Following = doc.data().Following;
            db.collection('music').orderBy("postID","desc").get().then(querySnapshot =>{
            querySnapshot.forEach(doc=>{          
            musicID.push(doc.id);
            })
        
            
            if(Following.length==0){
                vm.followingFlag = false;
            }
            else{
                vm.followingFlag = true;
                for (var i=0;i<Following.length;i++){
                    db.collection('music').where('postUser','==',Following[i]).get().then(querySnapshot =>{
                    querySnapshot.forEach(doc=>{          
                    followingPosts.push(doc.id);
                    
                    })
                }) 
                }
                if (followingPosts){
                    setTimeout(function(){
                       for(var j=0; j<musicID.length;j++){
                        for(i=0;i<followingPosts.length;i++){

                       if(musicID[j]===followingPosts[i]){
                            
                            db.collection('music').doc(musicID[j]).get().then(doc =>{     
                            vm.musicsFollowing.push(doc.data());   
                            })
                       }
                    }
                    } 
                    }, 1000)
                    ;
                }   
            }
            })
       
         })
     }  
    }
    },
    created(){
        this.musicsFollowing = [];
        this.newPosts = true;
      this.hotPosts = false;
       this.following = false;
         var user = fb.auth().currentUser;
        var vm = this;
        var musicID = [];
        var followingPosts =[];
      if (user) {
           
            db.collection('profiles').doc(user.uid).get().then(doc =>{ 
            var Following = doc.data().Following;
            db.collection('music').orderBy("postID","desc").get().then(querySnapshot =>{
            querySnapshot.forEach(doc=>{          
            musicID.push(doc.id);
            })
        
            
            if(Following.length==0){
                vm.followingFlag = false;
            }
            else{
                vm.followingFlag = true;
                for (var i=0;i<Following.length;i++){
                    db.collection('music').where('postUser','==',Following[i]).get().then(querySnapshot =>{
                    querySnapshot.forEach(doc=>{          
                    followingPosts.push(doc.id);
                    
                    })
                }) 
                }
                if (followingPosts){
                    setTimeout(function(){
                       for(var j=0; j<musicID.length;j++){
                        for(i=0;i<followingPosts.length;i++){

                       if(musicID[j]===followingPosts[i]){
                            
                            db.collection('music').doc(musicID[j]).get().then(doc =>{     
                            vm.musicsFollowing.push(doc.data());   
                            })
                       }
                    }
                    } 
                    }, 1000)
                    ;
                }   
            }
            })
       
         })
     } 
       
          db.collection('music').orderBy("postID","desc").get().then(querySnapshot =>{
            querySnapshot.forEach(doc=>{          
            this.musicsNew.push(doc.data());
            })
        })

          db.collection('music').where("LikeCount",">",0).orderBy("LikeCount","desc").limit(5).get().then(querySnapshot =>{
            querySnapshot.forEach(doc=>{          
            this.musicsHot.push(doc.data());
            })
        })
        
        
      

    },
    methods:{
        searchMusic(){
            
            
           
            db.collection('types').doc(this.search.toLowerCase().trim()).get().then((doc) => {
            if (doc.exists) {
        console.log("Document data:", doc.data());
        } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        }
        })
        }
    },
    computed:{
        filteredMusicNew:function(){
            return this.musicsNew.filter((music)=>{
                return music.postName.toLowerCase().includes(this.search.toLowerCase())
               || music.postType.toLowerCase().includes(this.search.toLowerCase())
            })
        },
        filteredMusicHot:function(){
            return this.musicsHot.filter((music)=>{
                return music.postName.toLowerCase().includes(this.search.toLowerCase())
               || music.postType.toLowerCase().includes(this.search.toLowerCase())
            })
        },
        filteredMusicFollowing:function(){
            return this.musicsFollowing.filter((music)=>{
                return music.postName.toLowerCase().includes(this.search.toLowerCase())
               || music.postType.toLowerCase().includes(this.search.toLowerCase())
            })
        },
    }
}
</script>

<style scoped>
.introBlock {
    margin: 10px 70px;
    height: 280px;
    background-color: white;
    border-radius: 10px;
}

.introcontentleft {
    width: 300px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
}

.introcontentleft p {
    font-size: 30px;
    margin-left: 10px;
    margin-top: 0;
}

.musics{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 30px 0;
    margin: 0 95px;

}
.postcollection-square{
    width: 220px;
    height: 220px;
    background-color: rgb(227, 221, 221);
     border-radius: 5px;

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
   border-radius: 5px;
}
.postname{
    font-size:20px;

}
.guideNav{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 40px;
    margin-left: 100px;
    margin-right: 100px;
}
.guideButtons .active{
    background-color:rgb(50, 26, 5);
    color: #FFF6F6;
    outline: none;
    transition: 0.2s;
}
.guideButtons{
    display: flex;
    align-items: center;
    justify-content: flex-start;
  
    
}
.guideButtons button{
   text-align: center;
    padding: 7px 17px 7px 17px;
    margin-right: 20px;
    font-size: 15px;
    border-radius: 22px;
    background-color: #FFF6F6;
    border-color: rgb(50, 26, 5);
    cursor: pointer;
    outline: none;
    transition: 0.2s;
    box-shadow: 1px 4px 10px #d6d6d6;
    color:rgb(50, 26, 5);
    letter-spacing: 1px;
}
</style>
