<template>
<div class="musicbackground">
<div class="musicpage">
  
    <div class= "musicPlayer">
        <img :src="imgSrc" alt="" class="musicsrc">
        <div >
            <audio
                style="display:none"
                ref="player"
                :id="playerid"
               :src="musicSrc"
            >
                
            </audio>
        </div>

          <div>
                <div id="player-row" >
                    <div id="button-div" class="flex-initial pr-3">
                      
                    </div>
                       <div
                                v-show="audioLoaded"
                                class="time"
                            >
                            
                                <span class="text-sm" v-html="elapsedTime()">{{this.currentSeconds}}</span>

                                <span class="text-sm" v-html="totalTime()"> 00:00 </span>
                                
                            </div>
                    <div id="progress-bar">
                        <div>
                            <input
                                v-model="playbackTime"
                                type="range"
                                min="0"
                                :max="audioDuration"
                                class="slider"
                                id="position"
                                name="position"
                            />
                            <div v-show="!audioLoaded"
                            class="pointer-events-none"
                            style="color: #513E41">
                            加載中..
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="controlPanel">
                           <div class="audioControls"> 
                        <button class="playbackbutton"><img src="../images/playbackButton.svg" @click="playback()" alt=""></button>
                      <button @click="toggleAudio()" class="playbutton">
                            <img src="../images/playButton.svg" v-if="!isPlaying" class="play-button">
                            <img src="../images/pauseButton.svg" class="pause" v-else>
                        </button>
                        <button @click="audioVolume()" class="volumebutton">
                            <img src="../images/volumeButton.svg" v-if="!volume" >
                            <img src="../images/muteButton.svg" v-else>
                        </button>
                   </div>
                    </div>
                 
                </div>
        
    </div>
   
    
    <div class="postinfo">
    <h1>{{postName | capitalize}}</h1>
       <div class="postUser">
      
        <div v-if="profileSrc" class="profile-pic">
            <img v-bind:src="profileSrc" alt="" class="imgSrc">
        </div>
        <router-link :to="{name:'OtherProfile',
            params:{
                userID:postUserID,
            }}">
            <h1>{{postUser}}</h1>
        </router-link>
        <div v-if="this.$store.state.userloggedin">
              <div v-if="isthisyou">
            <button v-on:click="popupEdit=!popupEdit" >Edit</button>
            <button v-on:click="popupDelete=!popupDelete">Delete</button>
           
        </div>
        <div v-else>
            <button v-on:click="popupReport=!popupReport" >Report</button>
             <div v-if="like"><button v-on:click="addLike">Like</button></div>
            <div v-else><button v-on:click="removeLike">Removelike</button></div>
        </div>
        </div>
      
</div>
    <h2>{{postType | capitalize}}</h2>
    <p>{{postBio | capitalize}}</p>
   
 
    </div>
    <div class="commentSection">
        <div class="postComment">
                <img v-bind:src="profileSrc" alt="" class="imgSrc">
              <input type="text" v-model="comment" placeholder="請輸入留言">
        <button v-on:click="addComment"><img src="../images/commentButton.svg" alt=""></button>
        </div>
      
    <div class="messageboard">
    <div v-for="comment in commentArray" :key="comment.comment" class="comments">
    <div class="commentUser">
     <img v-bind:src="comment.profilePic" alt="" class="commentImg">
        <router-link :to="{name:'OtherProfile',
        params:{
            userID:comment.user,
        }}">
        <p class="commentName">{{comment.name}}</p>
        </router-link>
    </div>
    <div class="commentContent">
        <div class="commentString">
            {{comment.comment}}
        </div>
        <div class="commentTimeStamp">
        <div class="timestamp">{{comment.date | convertDate}} {{comment.date | convertTime}}</div>
           
        </div>
    </div>
    
   
</div>
    </div>
</div>
    </div>

        <div v-if="popupEdit" v-on:click="popupEdit=false;popupDelete=false;popupReport=false" class="Popoverlay"></div>
        <div v-if="popupDelete" v-on:click="popupEdit=false;popupDelete=false;popupReport=false" class="Popoverlay"></div>
        <div v-if="popupReport" v-on:click="popupReport=false" class="Popoverlay"></div>
        <div v-if="popupConfirm" v-on:click="popupConfirm=false" class="Popoverlay"></div>
        

         <div v-if="popupEdit" class="Edittemplate">
        <h1>Edit</h1>
        <form @submit.prevent="pressed">
            <div class="input-edit editForm">
                <div class="songName">
                    <p>Song Name :</p>
                    <input type="text" v-model="updatepostName"/>
                </div>
                <div class="songBio">
                    <p>Bio :</p>
                    <input type="text" v-model="updatepostBio" />
                </div>
                <div class="songType">
                    <p>Music Type :</p>
                    <input type="text" v-model="updatepostType" />
                </div>
                <p>Choose Picture File :</p>
                <input type="file" v-on:change="chooseImgFile" class="uploadMusic"/>


                <button v-on:click="updateMusic">Update</button>
            </div>
        </form>
       
    </div>




        <div v-if="popupDelete" class="Deletetemplate">
        <h1>Delete</h1>
        <form @submit.prevent="pressed">
            <div class="input-edit deleteForm">
                <div>
                    <p>Are you sure that you want to delete your beautiful masterpiece?</p>     
                </div>
                <button v-on:click="deleteMusic">Yes</button>
                <button v-on:click="popupEdit=false;popupDelete=false">No</button>
            </div>
        </form>
       
    </div>

            <div v-if="popupReport" class="Reporttemplate">
        <h1>Report</h1>
        <form @submit.prevent="pressed">
            <div class="input-edit reportForm">
                <div>
                    <p>Why do you want to report this post?</p>     
                </div>
               
                    <button v-on:click="reportOriginal">It's not an original</button>
                    <button v-on:click="reportInappropriate"  >It's inappropriate</button>
               
            </div>
        </form>
       
    </div>
        <div v-if="popupConfirm" class="Confirmtemplate">
        <form @submit.prevent="pressed">
            <div class="input-edit confirmForm">
                <div>
                    <p>Thanks for letting us know.</p>     
                </div>
               
                    <button v-on:click="popupConfirm = false">Okay</button>
               
            </div>
        </form>
       
    </div>




</div>
</template>

<script>

let Imgfile ={};
import {fb,db,firebase} from './firebaseinit.js';

export default {
    props: ["url", "playerid"],
    name:'MusicPage',

 data(){
     return{
        postName:"",
        postBio:"",
        postType:"",
        postUser:"",
        postUserID:"",
        imgSrc:"",
        profileSrc:"",
        musicSrc:"",
        isthisyou:false,
        popupEdit:false,
        popupDelete:false,
        popupReport:false,
        popupConfirm :false,
        postId:"",
        imageupLoad:false,
        like:true,
        updatepostName:"",
        updatepostBio:"",
        updatepostType:"",
        comment:"",
        commentArray:[],
        audioPause:true,
        playbackTime: 0,
        audioDuration: 100,
        audioLoaded: false,
        isPlaying: false,
        currentSeconds:"00:00",
        volume:false
     }
 },
 watch: {
    '$store.state.userloggedin': function () {
      this.doStuff();
    }
  },
created(){
    this.doStuff();
    
 },
    methods:{
        audioVolume(){
            var audio = this.$refs.player;
            if (audio.muted) {
                audio.muted = false;
                this.volume = false;
            } else {
                audio.muted = true;
                this.volume = true;
            }
        },
        playback(){
            var audio = this.$refs.player;
            this.currentSeconds = "00:00";
            audio.currentTime=0;
            this.playbackTime = 0;
           
        },
   
        initSlider() {
            var audio = this.$refs.player;
            if (audio) {
                this.audioDuration = Math.round(audio.duration);
            }
        },
        convertTime(seconds){
                            const format = val => `0${Math.floor(val)}`.slice(-2);
                
                var minutes = (seconds % 3600) / 60;
                return [minutes, seconds % 60].map(format).join(":");
        },
        totalTime() {
            var audio = this.$refs.player;
            if (audio) {
                var seconds = audio.duration;
                return this.convertTime(seconds);
            } else {
                return '00:00';
            }
        },
        elapsedTime() {
            var audio = this.$refs.player;
            if (audio) {
                var seconds = audio.currentTime;
                return this.convertTime(seconds);
            } else {
                return '00:00';
            }
        },
        playbackListener() {
            var audio = this.$refs.player;
            this.playbackTime = audio.currentTime;
            audio.addEventListener("ended", this.endListener);
            audio.addEventListener("pause", this.pauseListener);
        },
        pauseListener() {
            this.isPlaying = false;
            this.listenerActive = false;
            this.cleanupListeners();
        },
        endListener() {
            this.isPlaying = false;
            this.listenerActive = false;
            this.cleanupListeners();
        },
        cleanupListeners() {
            var audio = this.$refs.player;
            audio.removeEventListener("timeupdate", this.playbackListener);
            audio.removeEventListener("ended", this.endListener);
            audio.removeEventListener("pause", this.pauseListener);
        },
        toggleAudio() {
            var audio = this.$refs.player;
            if (audio.paused) {
                audio.play();
                this.isPlaying = true;
            } else {
                audio.pause();
                this.isPlaying = false;
            }
        },
   
        doStuff(){
            this.$store.state.currentPost = Number(this.$route.params.postID);
    var vm = this;
    var user = fb.auth().currentUser;
    var LikeArray=[];
   
    if(this.$store.state.currentPost){
    db.collection("music").where('postID','==',this.$store.state.currentPost).get().then(querySnapshot =>{
            querySnapshot.forEach(doc=>{ 
            this.postId = doc.id;
            this.postName = doc.data().postName;
            this.postBio = doc.data().postBio;
            this.postType = doc.data().postType;
            this.musicSrc = doc.data().musicSrc;
            this.imgSrc = doc.data().ImgSrc;
            this.postUserID = doc.data().postUser;
            LikeArray = doc.data().Likes;
            
            if(user){
                   for(var i=0; i<LikeArray.length;i++){
                var name = LikeArray[i];
                if(name == user.uid ){
                    this.like = false;
                    break;
                }else{
                    this.like = true;
                }
            }
            if(user.uid === this.postUserID){
                this.isthisyou = true;
            }
            }
         

            
    
    db.collection("profiles").doc(this.postUserID).get().then(doc =>{ 
        vm.postUser = doc.data().name;
        
    });
    fb.storage().ref("profiles/"+this.postUserID+"/profile.jpg").getDownloadURL().then(imgUrl=>{
    this.profileSrc = imgUrl;
    })
    
    })

        db.collection("comments").where('postID','==',this.postId).orderBy('date','desc').onSnapshot((querySnapshot)=>{
       let allcomments=[]
        querySnapshot.forEach(doc=>{
            allcomments.push(doc.data())
        })
       this.commentArray = allcomments
        
    })
    })
   }
        },

          chooseImgFile(e){
            var vm = this;
            if(e.target.files[0]){
            Imgfile = e.target.files[0];
            vm.imageupLoad = true;
            } 
        },

        updateMusic(){
           var vm = this;
             if (this.updatepostName === "") this.updatepostName = this.postName;
             else this.postName = this.updatepostName;
              if (this.updatepostBio === "") this.updatepostBio = this.postBio;
             else this.postBio = this.updatepostBio;
            if (this.updatepostType === "") this.updatepostType = this.postType;
             else this.postType = this.updatepostType;
            if(vm.imageupLoad){
                fb.storage().ref('music/'+ this.$store.state.userUID +'/' + this.postId +'/' +'Img.jpg').put(Imgfile).then(function(){
                 
                fb.storage().ref('music/'+ vm.$store.state.userUID +'/' + vm.postId +'/' + 'Img.jpg').getDownloadURL().then(url=>{
                vm.imgSrc = url;

           db.collection('music').doc(vm.postId).update({
                ImgSrc:vm.imgSrc,
                postName:vm.updatepostName,
                postBio:vm.updatepostBio,
                postType:vm.updatepostType 
            });
               
                });
                })

                 this.popupEdit = false;
            } else{

                db.collection('music').doc(this.postId).update({
                    postName:this.updatepostName,
                    postBio:this.updatepostBio,
                    postType:this.updatepostType 
            });
             this.popupEdit = false;
            }


           

        },  
      deleteMusic(){
        var vm = this;
        var storageRef = fb.storage().ref();
        console.log(vm.$store.state.userUID);
        console.log( vm.postId);

        db.collection("music").doc(vm.postId).delete().then(()=>{
            storageRef.child('music/'+ this.$store.state.userUID +'/' + this.postId +'/' +'Img.jpg').delete().then(()=>{
                storageRef.child('music/'+ this.$store.state.userUID +'/' + this.postId +'/' + 'Music.mp3').delete();
                 vm.$router.push('/'); 
            });
            db.collection('types').doc(vm.postType).update({
            posts: firebase.firestore.FieldValue.arrayRemove(this.postId)
            });
        })


        
     
        
     },
     reportOriginal(){
         this.popupReport = false;
         this.popupConfirm = true;
         db.collection('music').doc(this.postId).get().then(doc =>{ 
        var reportOriginal = doc.data().reportOriginal;
      
             return db.collection('music').doc(this.postId).update({
                reportOriginal:reportOriginal+1,
                
        });
        
        
    });
  
     },
      reportInappropriate(){
         this.popupReport = false;
         this.popupConfirm = true;
         db.collection('music').doc(this.postId).get().then(doc =>{ 
        var reportInappropriate = doc.data().reportInappropriate;
      
             return db.collection('music').doc(this.postId).update({
                reportInappropriate:reportInappropriate+1,
                
        });
        
        
    });
  
     },
     addLike(){
         var user = fb.auth().currentUser;

        db.collection('music').doc(this.postId).get().then(doc =>{ 
        var LikeCount = doc.data().LikeCount;
        db.collection('music').doc(this.postId).update({
            Likes: firebase.firestore.FieldValue.arrayUnion(user.uid),
            LikeCount:LikeCount+1
        });
          db.collection('profiles').doc(user.uid).update({
            LikedPosts: firebase.firestore.FieldValue.arrayUnion(this.postId)
        });
        this.like = false;
        
    });
         
     },
     removeLike(){
         var user = fb.auth().currentUser;

        db.collection('music').doc(this.postId).get().then(doc =>{ 
       var LikeCount = doc.data().LikeCount;
      
         db.collection('music').doc(this.postId).update({
            Likes: firebase.firestore.FieldValue.arrayRemove(user.uid),
            LikeCount:LikeCount-1
        });
          db.collection('profiles').doc(user.uid).update({
            LikedPosts: firebase.firestore.FieldValue.arrayRemove(this.postId)
        });
        this.like = true;
        
        
    });
      
     },
     addComment(){
         var date = new Date();
         var user = fb.auth().currentUser;
         var name;
         var profilePic;
         
        db.collection('profiles').doc(user.uid).get().then(doc=>{
            name = doc.data().name;
            profilePic = doc.data().profilePic;
               db.collection("comments").doc().set({
            name:name,
            profilePic:profilePic,
            user:user.uid,
            date:date,
            comment:this.comment,
            postID:this.postId
        });
        this.comment=""
          })
    
      
  }

    },
     mounted: function() {
      this.$nextTick(function() {
        var audio=this.$refs.player;
        audio.addEventListener(
          "loadedmetadata",
          function() {
            this.initSlider();
          }.bind(this)
        );
        audio.addEventListener(
          "canplay",
          function() {
            this.audioLoaded=true;
          }.bind(this)
        );
        this.$watch("isPlaying",function() {
          
          if(this.isPlaying) {
            var audio=this.$refs.player;
            this.initSlider();
            if(!this.listenerActive) {
              this.listenerActive=true;
              audio.addEventListener("timeupdate",this.playbackListener);
            }
          }
        });

        this.$watch("playbackTime",function() {
           console.log(this.playbackTime)
            var audio=this.$refs.player;
            var diff=Math.abs(this.playbackTime-audio.currentTime);
        
          if(diff>0.01) {
            this.$refs.player.currentTime=this.playbackTime;
          }
            var seconds = audio.currentTime;
           
            this.currentSeconds = this.convertTime(seconds);
        });
      });
    }
  
  
}
</script>

<style scoped>
h1{
    text-decoration: none;
    color: rgb(50, 26, 5);
}
h2{
    color: rgb(50, 26, 5);
}
p {
    color: rgb(50, 26, 5);
}


.time{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: auto;
    width: 430px;
}
.text-sm{
    color: #513E41;
    font-size:13px;
    margin: 2px 0px; 
}

.play-button{
    width: 32px;
    height: 32px;
}

input[type="range"] {
    margin: auto;
    -webkit-appearance: none;
    position: relative;
    overflow: hidden;
    width: 430px;
    height: 10px;
    cursor: pointer;
    outline: none;
    border-radius: 10px;
    background: transparent;
}
input[type="range"]:focus {
    outline: none;
}
::-webkit-slider-runnable-track {
    background: #D3CCC2;
}

::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 0;
    height: 40px;
    background: #D3CCC2;
    box-shadow: -100vw 0 0 100vw #513E41; 
    border: none;
}
::-moz-range-track {
    height: 40px;
    background: #D3CCC2;
}
::-moz-range-thumb {
    background: #D3CCC2;
    height: 40px;
    width: 0; /* 20px; */
    border: none; /* 3px solid #999; */
    border-radius: 0 !important;
    box-shadow: -100vw 0 0 100vw #513E41; 
    box-sizing: border-box;
}
::-ms-fill-lower {
    background: #513E41;
}
::-ms-thumb {
    background: #D3CCC2;
    border: 2px solid #999;
    height: 40px;
    width: 20px;
    box-sizing: border-box;
}
::-ms-ticks-after {
    display: none;
}
::-ms-ticks-before {
    display: none;
}
::-ms-track {
    background: #D3CCC2;
    color: transparent;
    height: 40px;
    border: none;
}
::-ms-tooltip {
    display: none;
}
.musicbackground{
    height: 100vh;
}
.musicpage{
    margin: 0px 100px 20px 100px;
    padding: 20px;
    background-color: white;
    border-radius:5px;
    display: flex;
    justify-content: flex-start;
    box-shadow: 1px 4px 10px #a5a5a5;
    height: 600px;
}
.musicPlayer{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;    
}

.seek {
 
  height: 60px;
  width: 85%;
  top: 0;
  left: unset;
  right: 0;
}

.title-and-time {
  height: 25px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.progress-container {
  position: relative;
  height: 10px;
  width: auto;
  display: flex;
  align-items: center;
}

 .progress {
  background-color: rgba(0, 0, 0, 0.05);
  height: 4px;
  width: 100%;
  margin: 0;
  padding: 0 2px;
  border-radius: 0;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.progress-handle {
  display: block;
  position: absolute;
  z-index: 6;
  margin-top: 0;
  margin-left: -2px;
  width: 8px;
  height: 8px;
  border-radius: 100%;
  background-color: #fff;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
.progress-handle:hover {
  background-color: #000;
}

.progress-container .progress .transparent-seeker-layer {
  width: 100%;
  height: 6px;
  background-color: transparent;
  position: absolute;
  cursor: pointer;
  z-index: 5;
}
.bar {
  width: 0;
  background-color: #fff;
  height: 4px;
  position: absolute;
}
.musicsrc{
    width: 430px;
    height: 430px;
    margin: 10px 20px;
    background-color:rgb(227, 221, 221);
    border-radius:15px;
    display: flex;
    align-items: flex-end;
    justify-content:center;
     object-fit: cover;
}

.audioControls{
display: flex;
align-items: center;
justify-content: center;
margin-top: 20px;


}
.play{
    padding-left: 2px;
}
.playbackbutton{
    outline: none;
    border: none;
    background-color: white;
    margin-right:30px;
    
}
.playbackbutton img{
    width: 16px;
    height: 16px;
      display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.playbutton{
    width: 55px;
    height: 55px;
    border-radius: 50%;
    border: 2px solid #513E41;
    display: flex; 
    justify-content: center;
    align-items: center;
    outline: none;
    cursor: pointer;
    background-color: white;
}
.playbutton img{
    width: 15px;
    height: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.volumebutton{
 outline: none;
    
    background-color: white;
   border: none;
   margin-left:30px;
}
.volumebutton img{
    cursor: pointer;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.postinfo{
    width: 350px;
    padding:20px 30px;
    text-align: left;
}
.postinfo h1{
    font-size: 50px;
    display: flex;
    justify-content: flex-start;
    margin-top: 0px;
    margin-bottom:20px;
}

.postinfo p{
    font-size:18px;
    display: flex;
    justify-content: flex-start;
    overflow: scroll;
    overflow-x: hidden;
    line-height: 28px;
    margin-bottom: 30px;
    width: 350px;

}

.postinfo p::-webkit-scrollbar {
  display: none;
}
.postinfo h2{
    font-size:20px;
    display: flex;
    justify-content: flex-start;
    margin: 30px 0px;
}

.postUser{
    display: flex;
    align-items: center;
}
.postUser h1{
    width: max-content;
    font-size: 20px;
    margin: auto;
    padding: 0;
    display: flex;
    justify-content: center;
}
.imgSrc{
    width: 45px;
    height: 45px; 
    border-radius: 50%;
    object-fit: cover;
    display: flex;
    justify-content: center;
    margin: auto;
    margin-right: 15px;
}

.commentSection{
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: flex-start;
    padding-top:25px;
    width: 350px;
  
}
.messageboard {
    overflow: scroll;
    overflow-x: hidden;
}
.messageboard::-webkit-scrollbar {
  display: none;
}
.postComment{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
.postComment input{
 border: 2px solid #bdb6ac;
 height: 35px;
 width: 250px;
 border-radius: 25px;
 outline: none;
 padding-left:10px;
}

.postComment input::placeholder{
    color: gray;
    transition: 0.1s;
    letter-spacing: 0.5px;
}
.postComment input:focus::placeholder {
   opacity: 0;
   transition: 0.1s; 
}
.postComment button{
    border: none;
    background-color:white;
    padding-left: 10px;
    

}
.postComment button img{
   width: 25px;
   cursor: pointer;
   opacity: 0.9;
    transition: 0.2s; 
}
.postComment button img:hover{
   transition: 0.2s; 
   opacity:1;
}
.comments{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin:10px 0px;
    padding: 10px 20px 15px 20px;
    width: 320px;
    border: 2px solid #513E41;
      
    
}

.commentUser{
    width: max-content;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 5px;
}
.commentImg{
    width: 30px;
    height: 30px;
    object-fit: cover;
    border-radius:50%;
    margin-right:10px;
}

.commentName{
    font-weight: bold;
    font-size: 16px;
    letter-spacing: 1px;
}
.commentContent{
    display: flex;
    justify-content: space-between;
     width: 320px;
     align-items: flex-end;
}

.timestamp{
    font-size: 12px;
    color:#b1aaa1;
    letter-spacing: 1px;
    
}
.Popoverlay {
    position: fixed;
    width: 100%;
    opacity: 0.5;
    top: 0px;
    margin: 0px;
    min-height: 200px;
    height: 100%;
    background-color: #000;
}

.Edittemplate  {
    left: 50%;
    top: 50%;
    width: 700px;
    height: 600px;
    margin-top: -300px;
    margin-left: -350px;
    position: fixed;
    background-color: rgb(239, 243, 243);
    border-radius: 15px;
}

.Deletetemplate  {
    left: 50%;
    top: 50%;
    width: 700px;
    height: 320px;
    margin-top: -160px;
    margin-left: -350px;
    position: fixed;
    background-color: rgb(239, 243, 243);
    border-radius: 15px;
}

.Reporttemplate  {
    left: 50%;
    top: 50%;
    width: 700px;
    height: 360px;
    margin-top: -180px;
    margin-left: -350px;
    position: fixed;
    background-color: rgb(239, 243, 243);
    border-radius: 15px;
}

.Confirmtemplate  {
    left: 50%;
    top: 50%;
    width: 700px;
    height: 200px;
    margin-top: -100px;
    margin-left: -350px;
    position: fixed;
    background-color: rgb(239, 243, 243);
    border-radius: 15px;
}





.Edittemplate h1 {
    letter-spacing: 1px;
    color: rgb(50, 26, 5);
    background-color: rgb(202, 206, 196);
    margin: 0;
    padding: 25px;
    border-radius: 15px 15px 0 0;
    display: flex;
    justify-content: center;
}

.Deletetemplate h1 {
    letter-spacing: 1px;
    color: rgb(50, 26, 5);
    background-color: rgb(202, 206, 196);
    margin: 0;
    padding: 25px;
    border-radius: 15px 15px 0 0;
    display: flex;
    justify-content: center;
}

.Reporttemplate h1 {
    letter-spacing: 1px;
    color: rgb(50, 26, 5);
    background-color: rgb(202, 206, 196);
    margin: 0;
    padding: 25px;
    border-radius: 15px 15px 0 0;
    display: flex;
    justify-content: center;
}

.Confirmtemplate p {
    letter-spacing: 1px;
    color: rgb(50, 26, 5);
    margin: 0;
    padding: 5px;
    display: flex;
    justify-content: center;
}


.editForm button{
font-size: 30px;
}

.deleteForm button{
    font-size: 30px;
    margin:0 10px;
}

.reportForm button{
    font-size: 20px;
    margin:0px 20px;
}

.confirmForm button{
    font-size: 20px;
    margin:0px 20px;
}

.input-edit p {
    color: rgb(50, 26, 5);
    font-size: 22px;
    margin-top: 20px;
    margin-bottom: 10px;
    margin-left: 30px;
    display: flex;
    justify-content: flex-start;
    letter-spacing: 1px;
}

.input-edit input {
    font-size: 18px;
    padding-left: 10px;
    background-color: rgb(239, 243, 243);
    width: 630px;
    height: 30px;
    margin: 0px 20px;
    border: none;
    border-bottom: 12px solid rgb(202, 206, 196);
    border-radius: 0 0 15px 15px;
    outline: none;
}

.input-edit input::placeholder {
    color: gray;
}

.input-edit button {
    background-color: rgb(239, 243, 243);
    
    margin-top: 30px;
    padding: 10px 70px;
    border: 2px solid rgb(50, 26, 5);
    border-radius: 30px;
    outline: none;
    letter-spacing: 1px;
    transition: 0.2s;
    cursor: pointer;
}



.input-edit button:hover {
    background-color: rgb(50, 26, 5);
    color: rgb(239, 243, 243);
}
.songName .songBio .songType {
    display: flex;
    justify-content: flex-start;
}




</style>
