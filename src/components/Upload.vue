<template>
<div class="upload">

 <div class="uploadContent" style="display:flex; height:max-content">
<div class="uploadImgAudio">
            <div class="" v-if="!chooseImg">
            <p class="imgSrc" @click="inputImgFiles()" style="cursor:pointer;">點我上傳圖片</p>
        </div>
        <div v-else class="currentPic">
            <div class="loading">
            <div v-if="imgUploading" class="lds-ring"><div></div><div></div><div></div><div></div></div>
            <img v-else v-bind:src="this.currentPic" alt="" class="imgSrc" @click="inputImgFiles()" style="cursor:pointer;"> 
         </div> 
      </div>
          <div class= "musicPlayer" v-if="musicUpload">
        <div >
            <audio
                style="display:none"
                ref="player"
                :id="playerid"
               :src="currentAudio"
            >  
            </audio>
        </div>
          <div >
                <div id="player-row" class="audioflex">
                               
                    <div class="controlPanel">
                           <div class="audioControls"> 
                      <button @click="toggleAudio()" class="playbutton">
                            <img src="../images/playButton.svg" v-if="!isPlaying" class="play-button">
                            <img src="../images/pauseButton.svg" class="pause" v-else>
                        </button>

                   </div>
                   
                    </div>
                    <div>
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
                 
                    </div>
              
                 
                </div>
        
    </div>   
      <div class="editControls"> 


            <div id="myProgress" v-if="progresschange">
            <div id="myBar"></div>
            </div>

            <input id="ImgUpload" v-on:change=" chooseImgFile" type="file" hidden/>
            
            <button class="editInput" @click="inputAudioFiles()">選擇音樂</button>
            <input id="AudioUpload" v-on:change=" chooseAudioFile" type="file" hidden/>
        </div>


        </div>
        
       
         <div class="userProfile">
       <div>
            <p>歌名:</p>
        <input type="text" v-model="postName" />
      </div>
          <div>
        <p>音樂類型:</p>
        <input type="text" v-model="postType" />
    </div>
    <div class="bio">
        <p>歌曲簡介:</p>
        <textarea v-model="postBio" ></textarea>   
    </div> 
    </div>
    <div v-if="audioLoaded && postName!=''" style="height: 430px;display:flex; align-items:flex-end;">
        <button class="uploadButton" @click="uploadMusic()">上傳</button>
    </div>
 </div>
        
</div>

    


</template>

<script>
import {fb,db,firebase} from './firebaseinit.js'



let Musicfile = {};
let Imgfile ={};
var currentFirestore;


export default {
     props: ["url", "playerid"],
 data() {
        return {
            postName:"",
            postBio:"",
            postType:"",  
            musicSrc:"",
            ImgSrc:"",
            currentPic:'',
            currentAudio:'',
            chooseImg:false,
            upLoad:false,
            imgUploading:false,
            imageupLoad:false,
            musicUpload:false,
            progress:'尚無上傳音樂',
            audioPause:true,
            playbackTime: 0,
            audioDuration: 100,
            audioLoaded: false,
            isPlaying: false,
            currentSeconds:"00:00",
            progresschange:false
        };
    },
    created(){
        var user = fb.auth().currentUser;
         this.$store.state.userUID = user.uid;   
    },

     watch: {
        'progress':function(){
            this.progresschange = true;
         const progressbar = document.querySelector('#myBar')
         progressbar.style.width = `${this.progress}%`;
  
        },
        'musicUpload': function () {
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
    },

    methods:{
        inputImgFiles(){
            document.getElementById("ImgUpload").click();
        },
        inputAudioFiles(){
            document.getElementById("AudioUpload").click();
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
        uploadMusic(){
           
            fb.storage().ref().child('music/'+ this.$store.state.userUID +'/' + 'Temp' +'/' +'Temporary.mp3').delete();
            this.postType = this.postType.toLowerCase().trim();
            var vm = this;
            var ID;
            db.collection('music').orderBy("postID","desc").limit(1).get().then(querySnapshot =>{
            querySnapshot.forEach(doc=>{
                ID = doc.data().postID;
            })
           
            db.collection("music").add({
                    postName: vm.postName,
                    postBio:vm.postBio,
                    postType: vm.postType,
                    postUser:vm.$store.state.userUID,
                    postID:ID+1,
                    reportOriginal:0,
                    reportInappropriate:0,
                    Likes:[],
                    LikeCount:0
            });

            db.collection("types").doc(vm.postType).set({
                posts:[]
            });
            db.collection('music').orderBy("postID","desc").limit(1).get().then(querySnapshot =>{
               
            querySnapshot.forEach(doc=>{
                currentFirestore = doc.id;
             
            })

            db.collection('types').doc(vm.postType).update({
            posts: firebase.firestore.FieldValue.arrayUnion(currentFirestore)
            });

            fb.storage().ref('music/'+ this.$store.state.userUID +'/' + currentFirestore +'/' + 'Music.mp3').put(Musicfile).then(function(){ 
                    fb.storage().ref('music/'+ vm.$store.state.userUID +'/' + currentFirestore +'/' +  'Music.mp3').getDownloadURL().then(url=>{
                    vm.musicSrc = url;
                   
           db.collection('music').doc(currentFirestore).update({
                musicSrc:vm.musicSrc,
            });
            vm.$router.push('/');
            });
            
            })

               if(vm.imageupLoad){
                  
                fb.storage().ref().child('music/'+ this.$store.state.userUID +'/' + 'Temp' +'/' +'Temporary.jpg').delete();
                fb.storage().ref('music/'+ this.$store.state.userUID +'/' + currentFirestore +'/' + 'Img.jpg').put(Imgfile).then(function(){
                 
                fb.storage().ref('music/'+ vm.$store.state.userUID +'/' + currentFirestore +'/' + 'Img.jpg').getDownloadURL().then(url=>{
                    vm.ImgSrc = url;
                    
                    db.collection('music').doc(currentFirestore).update({
                        ImgSrc:vm.ImgSrc,
                    });
                    
                });
                 
                })
            }
            else {
                 
                 db.collection('music').doc(currentFirestore).update({
                ImgSrc:"https://firebasestorage.googleapis.com/v0/b/vue2-41a3c.appspot.com/o/Denji.jpg?alt=media&token=0e754707-0876-4d40-aadd-c1e6cbbd0fe3",
            }); 
             
            }
         
       

            });

        });

        },  


     chooseImgFile(e){
          var vm = this;
            if(e.target.files[0]){
                this.chooseImg = true;
               this.imgUploading = true;
             Imgfile = e.target.files[0];
            fb.storage().ref('music/'+ this.$store.state.userUID +'/' + 'Temp' +'/' +'Temporary.jpg').put(Imgfile).then(function(){
                    fb.storage().ref('music/'+ vm.$store.state.userUID +'/' + 'Temp' +'/' +'Temporary.jpg').getDownloadURL().then(url=>{
                    vm.currentPic = url;
                   vm.imgUploading = false;
                });      
                });
            vm.imageupLoad = true; 
        }    
        },


     chooseAudioFile(e){ 
         var vm = this;
        if(e.target.files[0]){
                this.musicUpload = false;
                Musicfile = e.target.files[0];
                var uploadTask = fb.storage().ref('music/'+ this.$store.state.userUID +'/' + 'Temp' +'/' +'Temporary.mp3').put(Musicfile);
                    uploadTask.on('state_changed', 
                (snapshot) => {
                this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: 
                break;
                case firebase.storage.TaskState.RUNNING: 
                break;
        }
        }, 
          () => {
        
        }, 
        () => {
              uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                 vm.currentAudio = downloadURL;
                 vm.musicUpload = true;
                 vm.progresschange = false;
            });
           
            }
        );

         }
     },
     }
}
</script>

<style scoped>
#myProgress {
    margin:15px 0px;
  width: 430px;
  border-radius: 10px;
  background-color: #D3CCC2;
}

#myBar {
  width: 1%;
  height: 20px;
  border-radius: 10px;
  background-color: #513E41;
}
.audioflex{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 430px;
  
}
.time{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: auto;
    width: 360px;
    margin: 5px 0px;
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
    width: 360px;
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
    width: 0; 
    border: none; 
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
    font-size: 20px;
    letter-spacing: 1px;
    align-items: center;
    justify-content:center;
     object-fit: cover;
}
.imgSrc{
    width: 430px;
    height: 430px;
    margin: 10px 20px;
    background-color:rgb(227, 221, 221);
    border-radius:15px;
    display: flex;
    font-size: 25px;
    color:rgb(50, 26, 5);
    letter-spacing: 1px;
    align-items: center;
    justify-content:center;
     object-fit: cover;
    
}
.loading{
   width: 430px;
   height: 430px;
   display: flex;
   justify-content: center;
   align-items: center;
   margin: 10px 20px;
}

.playbutton{
    width: 55px;
    height: 55px;
    border: none;
    display: flex; 
    justify-content: center;
    align-items: center;
    outline: none;
    cursor: pointer;
    background-color: #FFF6F6;
}
.playbutton img{
    width: 22px;
    height: 22px;
    margin-right: 20px;
   
}
.audioControls{
display: flex;
align-items: center;
justify-content: center;
margin-top: 30px;
}
.upload{
    height: 90vh;
    padding: 0;
    display: flex;
    justify-content: center;
}
.editControls{
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
}

.editControls button{
    
    font-size: 22px;
    margin: 10px 0px;
    letter-spacing: 1px;
    font-weight: bold;
   background-color: #FFF6F6;
   color: rgb(50, 26, 5);
    margin-right:0px;
    width: max-content;
    text-align: center;
    cursor: pointer;
    outline: none;
    border:2px solid rgb(50, 26, 5);
    border-radius: 35px;
    padding: 10px 15px; 
}

.uploadblock{
    display: flex;
    justify-content: center;
    height: 500px;
    width: 1000px;

}


.uploadButton{ 
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    letter-spacing: 1px;
    color: white;
    font-size: 25px;
    background-color: rgb(50, 26, 5);
    padding: 20px;
    border-style: solid;
    border-color: rgb(50, 26, 5);
    border-radius: 35px;
    cursor: pointer;
    transition: 0.3s;
    outline: none;
}

.uploadButton :hover{
    color: rgb(50, 26, 5);
    background-color: rgb(227, 221, 221);
    border-color: rgb(50, 26, 5);
    transition: 0.3s;
}

.userProfile{
    margin:10px 40px;
    height: 430px;
    display: flex;
    flex-direction: column;

    justify-content: space-between;
}
.userProfile input{
   font-size: 18px;
    padding-left: 10px;
    background-color: #fff;
    width:450px;
    height: 30px;
    resize: none;
    border: 2px solid #bdb6ac;
    border-radius: 55px;
    outline: none;
}

.userProfile div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    margin-bottom: 10px;
   
}

.userProfile p{
   color:rgb(50, 26, 5);
   font-size:18px ;
   letter-spacing: 1px;
}
.bio{
    outline: none;
    border: none;
}
.bio textarea{
   font-family: Avenir, Helvetica, Arial, sans-serif;
    background-color: #fff;
   border: 2px solid #bdb6ac;
   width: 450px;
   border-radius: 35px;
   outline: none;
   height: 100px;
   padding-top: 10px;
    padding-left: 10px;
    font-size: 18px;
    resize: none;
}

.bio textarea:focus {
        resize: none;
        outline: none;
    }


.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid #513E41;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #513E41 transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
