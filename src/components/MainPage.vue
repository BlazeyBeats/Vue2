<template>
<div class="mainpage">
<div class="intro">
    <div class="introBlock">
        <div v-if="this.$store.state.phoneWindow">
            <img src="../images/posterSmall.png" alt="">
        </div>
        
        <div class="introcontentleft" v-if="this.$store.state.phoneWindow ==false">
            <img class="logoLeft" src="../images/logoword_svg.svg" alt="">
        </div>
        <div class="introcontentright" v-if="this.$store.state.phoneWindow ==false">
            <img class="logoRight" src="../images/homepicsvg.svg" alt="">
        </div>
        
        
    </div>
</div>
<div class="guideNav">
    <div class="guideButtons"  >
    <button v-on:click="newPosts=true;following=false;hotPosts=false" v-bind:class="{ active: newPosts }">最新</button>
    <button v-on:click="hotPosts=true;following=false;newPosts=false" v-bind:class="{ active: hotPosts }">熱門</button>
    <div v-if="musicsFollowing.length != 0" v-bind:class="{ 'searchHidden': searchFocus }"><button v-on:click="following=true;newPosts=false;hotPosts=false" v-bind:class="{ active: following }">追蹤中</button></div>
    </div>
   
    <div class ="guideSearch" v-if="this.$store.state.phoneWindow ==false"><img src="../images/searchsvg.svg" alt="" class="searchSvg"><input type="text" v-model="search" placeholder="search music" @keyup.enter="searchMusic"></div>
   

    <form id="demo-2" v-if="this.$store.state.phoneWindow">
	<input type="search" v-model="search" placeholder="search music" @focus="searchFocus = true" @blur="searchUnFocus()" >
    </form>

</div>

<div class="mainpageMusic">
    <div class="musics" v-if="newPosts">
<div v-for="(music,idx) in filteredMusicNew" :key="idx" class="postcollection">
       <img v-bind:src="music.ImgSrc" alt="" class="postcollection-square">
       <div class="phoneFlex">
            <router-link :to="{name:'MusicPage',
        params:{
            postID:music.postID,
        }}">
        <h1 class="postname">{{music.postName | capitalize}}</h1>
        </router-link>
        <div class="posttype">{{music.postType | capitalize}}</div>
       </div>
</div>
<div class="flexgrow"></div>
<div class="flexgrow"></div>
<div class="flexgrow"></div>
</div>

<div class="musics" v-if="hotPosts">
<div v-for="(music,idx) in filteredMusicHot" :key="idx" class="postcollection">
       <img v-bind:src="music.ImgSrc" alt="" class="postcollection-square">
       <div class="phoneFlex">
            <router-link :to="{name:'MusicPage',
        params:{
            postID:music.postID,
        }}">
        <h1 class="postname">{{music.postName}}</h1>
        </router-link>
        <div class="posttype">{{music.postType | capitalize}}</div>
       </div>
       
</div>
<div class="flexgrow"></div>
<div class="flexgrow"></div>
<div class="flexgrow"></div>
</div>



<div class="musics" v-if="following && this.$store.state.userloggedin">
<div v-for="(music,idx) in filteredMusicFollowing" :key="idx" class="postcollection">
       <img v-bind:src="music.ImgSrc" alt="" class="postcollection-square">
       <div class="phoneFlex">
             <router-link :to="{name:'MusicPage',
        params:{
            postID:music.postID,
        }}">
        <h1 class="postname">{{music.postName}}</h1>
        </router-link>
        <div class="posttype">{{music.postType | capitalize}}</div>
       </div>
      
</div> 
<div class="flexgrow"></div>
<div class="flexgrow"></div>
<div class="flexgrow"></div>
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
            search:'',
            searchFocus:false
            
        };
    },
    watch:{
        
        '$store.state.userloggedin': function () {
          this.musicsFollowing = [];
          this.followingFlag = false;
          var user = fb.auth().currentUser;
          var vm = this;
          if (user){
           db.collection('profiles').doc(user.uid).get().then(doc =>{ 
            var Following = doc.data().Following;
           if(Following.length==0){
                vm.followingFlag = false;
            }else{
              
              vm.followingFlag = true;
            
            }
       
         })
      }
       
    },
        'followingFlag':function(){
          this.getfollowingData();
        }
    },
 
    created(){
      var user = fb.auth().currentUser;
      var vm = this;
      if (user){
           db.collection('profiles').doc(user.uid).get().then(doc =>{ 
            var Following = doc.data().Following;
           if(Following.length==0){
                vm.followingFlag = false;
            }else{
              
              vm.followingFlag = true;
            
            }
       
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
        searchUnFocus(){
            setTimeout(() => this.searchFocus = false, 300);
        },
        getfollowingData(){
          this.newPosts = true;
          this.hotPosts = false;
          this.following = false;
         
           
      
      var user = fb.auth().currentUser;
        var vm = this;
        var musicID = [];
        var followingPosts =[];
      if (user) {
          
            this.musicsFollowing = [];
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
                        this.musicsFollowing = [];
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
          
       
        },
        searchMusic(){

            db.collection('types').doc(this.search.toLowerCase().trim()).get().then(() => {
           
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
.mobile{
    display: none;
}
a{
    text-decoration: none;
    color: rgb(50, 26, 5);
}
.introBlock {
    margin: 0px 100px;
    height: 280px;
    background-color: #e8dfda;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.introcontentleft {
    width: 300px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
}

.introcontentright{
    width: 450px;
    margin-right: 100px;
}

.logoRight{
    width: 450px;
    
}
.logoLeft{
    width: 400px;
    margin-left:100px;
}

.introcontentleft p {
    font-size: 30px;
    margin-left: 10px;
    margin-top: 0;
}

.mainpageMusic {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: auto;
}
.musics{
    display: flex;
    flex-direction: row;
    justify-content:space-between;
    flex-wrap: wrap;
    width: max-content;
    padding: 30px 0;
    margin: 0 65px;

}

.flexgrow{
    margin: 20px 30px;
    width: 270px;
}
.postcollection-square{
    width: 220px;
    height: 220px;
    background-color: rgb(227, 221, 221);
    border-radius: 5px;
    margin-bottom:10px;
}
.postcollection{
    box-shadow: 1px 2px 5px #c4c4c4;
    width: 270px;
    height: 320px;
    color: rgb(50, 26, 5);
    display: flex;
    align-items:center;
    justify-content:flex-end;
    flex-direction: column;
    margin: 20px 30px;
    padding-bottom: 20px;
   background-color: #e8dfda;
   border-radius: 5px;
}
.postname{
    font-size:20px;

}
.guideNav{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 35px;
    margin-top: 40px;
    margin-left: 100px;
    margin-right: 100px;
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

.guideSearch {
     outline: none;
     border:2px solid rgb(50, 26, 5);
    border-radius:30px;
    display: flex;
    align-items: center;
}
.searchSvg{
    width: 25px;
    margin-left:10px;
}
.guideSearch input{
    margin-left:8px;
   outline: none;
    height: 35px;
    width: 200px;
   border-radius:30px;
    background-color: #FFF6F6;
   border: none;
    font-size:16px;
}

.guideSearch input::placeholder{
    color: gray;
    
    
    transition: 0.1s;
}
.guideSearch  input:focus::placeholder {
   opacity: 0;
   transition: 0.1s; 
}

@media screen and (max-width: 425px) {
  .introBlock {
    margin-left: 40px;
    margin-right: 40px;
    height: max-content;
     background-color: #FFF6F6;
  }
    .introBlock img{
    object-fit: cover;
    max-width:100%;
    border-radius: 10px;
  }
  .guideNav{
    margin-top: 30px;
    margin-left: 40px;
    margin-right: 40px;
}
.guideButtons button{
    padding: 4px 14px;
    margin-right: 10px;
    font-size: 14px;
    letter-spacing: 0px;
}
.musics{
    padding: 20px 40px;
    margin: 0px auto;
    justify-content: center;
}
.postcollection-square{
    width: 90px;
    height: auto;
    margin: 0px;
    margin-right:20px;    
}
.postcollection{
    width: 100%;
    height: 90px;
    margin: 10px 0px;
    padding: 10px;
   justify-content: flex-start;
   flex-direction:row;
}
.postname{
    margin-top:0px;
}
.phoneFlex{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
}

input {
	outline: none;
    border: none;
  
}
input[type=search] {
	-webkit-appearance: textfield;
	-webkit-box-sizing: content-box;
	font-family: inherit;
	font-size: 100%;
}
input::-webkit-search-decoration,
input::-webkit-search-cancel-button {
	display: none; 
}


input[type=search] {
	background: #FFF6F6 url(../images/searchsvg.svg) no-repeat 9px center;
    background-size:25px;
    
    border: none;
	padding: 9px 10px 9px 32px;
	width: 55px;
	
	-webkit-border-radius: 10em;
	-moz-border-radius: 10em;
	border-radius: 10em;
	
	-webkit-transition: all .5s;
	-moz-transition: all .5s;
	transition: all .5s;
}

input::-webkit-input-placeholder {
	color: #999;
}
#demo-2 input[type=search] {
	width: 15px;
	padding-left: 10px;
	color: transparent;
	cursor: pointer;
}

#demo-2 input[type=search]:focus {
	width: 140px;
	padding-left: 45px;
    border: 1.5px solid rgb(50, 26, 5);
	cursor: auto;
    color: rgb(50, 26, 5);
    
}

#demo-2 input:-moz-placeholder {
	color: transparent;
}
#demo-2 input::-webkit-input-placeholder {
	color: transparent;
}
.searchHidden{
    display:none;
    transition: all .5s;
}



}
</style>
