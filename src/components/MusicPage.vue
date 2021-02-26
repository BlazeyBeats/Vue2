<template>
<div>
<div class="musicpage">
    <div>
        <img :src="imgSrc" alt="" class="musicsrc">
        <audio controls :src="musicSrc" alt="" class="audio">
        </audio>
    </div>
    <div class="postinfo">
    <h1>{{postName}}</h1>
    <h2>{{postType}}</h2>
    <p>{{postBio}}</p>
   
    <div class="postUser">
      
        <div v-if="profileSrc" class="profile-pic">
            <img v-bind:src="profileSrc" alt="" class="imgSrc">
        </div>
        <div v-else class="circle-pic"></div>
        <router-link :to="{name:'OtherProfile',
            params:{
                userID:postUserID,
            }}">
            <h1>{{postUser}}</h1>
        </router-link>
        <div v-if="isthisyou">
            <button v-on:click="popupEdit=!popupEdit" >Edit</button>
            <button v-on:click="popupDelete=!popupDelete">Delete</button>
        </div>
        <div v-else>
            <button v-on:click="popupReport=!popupReport" >Report</button>
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
import {fb,db} from './firebaseinit.js';

export default {
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
        updatepostName:"",
        updatepostBio:"",
        updatepostType:"",
     }
 },
created(){
    this.$store.state.currentPost = Number(this.$route.params.postID);
    var vm = this;
    var user = fb.auth().currentUser;
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
            if(user.uid === this.postUserID){
                this.isthisyou = true;
            }
    if(this.postUserID){
    db.collection("profiles").doc(this.postUserID).get().then(doc =>{ 
        vm.postUser = doc.data().name;
    });
    fb.storage().ref("profiles/"+this.postUserID+"/profile.jpg").getDownloadURL().then(imgUrl=>{
    this.profileSrc = imgUrl;
    })
    }
    })
    })
   }
 },
    methods:{
        

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
        storageRef.child('music/'+ this.$store.state.userUID +'/' + this.postId +'/' +'Img.jpg').delete().then(()=>{
            storageRef.child('music/'+ this.$store.state.userUID +'/' + this.postId +'/' + 'Music.mp3').delete().then(()=>{
            db.collection("music").doc(vm.postId).delete();
            vm.$router.push('/'); 
        })
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
  
     }

    },
  
  
}
</script>

<style scoped>
.musicpage{
    margin: 20px 100px;
    padding: 20px;
    background-color: white;
    border-radius:20px;
    display: flex;
 
    height: 600px;
}
.musicsrc{
    width: 500px;
    margin:30px 30px -30px 30px;
    background-color:rgb(227, 221, 221);
    border-radius:20px;
    display: flex;
    align-items: flex-end;
    justify-content:center ;
}

audio::-webkit-media-controls-panel {
     background-color:rgb(247, 247, 247);
}

audio:focus{
      outline: none;
}


.audio{
    background-color:rgb(247, 247, 247);
    padding:10px 0 10px 0;
    width: 500px;
    border-radius: 0;
    
}
.postinfo{
    margin-left:50px;
    text-align: left;
}
.postinfo h1{
 font-size: 50px;
    display: flex;
    justify-content: flex-start;
}

.postinfo p{
    font-size:18px;
    display: flex;
    justify-content: flex-start;
  
    line-height: 28px;
    margin-bottom: 30px;
    width: 600px;
}
.postinfo h2{
    font-size:20px;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 30px;
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
    
    width: 50px;
    height: 50px; 
    border-radius: 50%;
    object-fit: cover;
    display: flex;
    justify-content: center;
    margin: auto;
    margin-right: 20px;
}
.circle-pic{
    width: 50px;
    height: 50px; 
    border-radius: 50%;
    background-color: rgb(50, 26, 5) ;
   display: flex;
    justify-content: center;
    margin: auto;
    margin-top: 80px;
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
