<template>
<div class="upload">
 
    <p>Name :</p>
        <input type="text" v-model="postName"/>
        <p >Bio :</p>
        <input type="text" class="bio" v-model="postBio" />
        <p>Music Type :</p>
         <input type="text" v-model="postType" />
         <p>Choose Picture File :</p>
        <input type="file" v-on:change="chooseImgFile" class="uploadMusic"/>
        <p>Choose Music File :</p>
        <input type="file" v-on:change="chooseMusicFile" class="uploadMusic"/>
    <button class="uploadButton" v-on:click="uploadMusic" v-if="upLoad">Upload</button>
</div>
</template>

<script>
import {fb,db} from './firebaseinit.js'



let Musicfile = {};
let Imgfile ={};
var currentFirestore;


export default {
 data() {
        return {
            postName:"",
            postBio:"",
            postType:"",  
            musicSrc:"",
            musicPath:"",
            ImgSrc:"",
            ImgPath:"",
            upLoad:false   
        };
    },
    created(){
        var user = fb.auth().currentUser;
         this.$store.state.userUID = user.uid;
         
    },
    methods:{
    
        uploadMusic(){
     
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
                    reportInappropriate:0
            });

            db.collection('music').orderBy("postID","desc").limit(1).get().then(querySnapshot =>{
            querySnapshot.forEach(doc=>{
                currentFirestore = doc.id;
                console.log(currentFirestore);
            })

            fb.storage().ref('music/'+ this.$store.state.userUID +'/' + currentFirestore +'/' + this.postName + '.mp3').put(Musicfile).then(function(){
                    var storageRef = fb.storage().ref();
                    fb.storage().ref('music/'+ vm.$store.state.userUID +'/' + currentFirestore +'/' + vm.postName + '.mp3').getDownloadURL().then(url=>{
                    vm.musicSrc = url;
                    vm.musicPath = storageRef.child('music/'+ vm.$store.state.userUID +'/' + currentFirestore +'/' + vm.postName + '.mp3').fullPath; 
           db.collection('music').doc(currentFirestore).update({
                musicSrc:vm.musicSrc,
                musicPath:vm.musicPath,
            });
            });
                })

              fb.storage().ref('music/'+ this.$store.state.userUID +'/' + currentFirestore +'/' + this.postName + '.jpg').put(Imgfile).then(function(){
                  alert('Upload success!')
                    var storageRef = fb.storage().ref();
                    fb.storage().ref('music/'+ vm.$store.state.userUID +'/' + currentFirestore +'/' + vm.postName + '.jpg').getDownloadURL().then(url=>{
                    vm.ImgSrc = url;
                    vm.ImgPath = storageRef.child('music/'+ vm.$store.state.userUID +'/' + currentFirestore +'/' + vm.postName + '.jpg').fullPath;   
           db.collection('music').doc(currentFirestore).update({
                ImgSrc:vm.ImgSrc,
                ImgPath:vm.ImgPath,
            });
                vm.$router.push('');
                });
                })

            });

        });

        },  

        chooseImgFile(e){
            if(e.target.files[0]){
            Imgfile = e.target.files[0];
            console.log(Imgfile);
            }
        },
        chooseMusicFile(e){
            var vm = this;
            if(e.target.files[0]){
            Musicfile = e.target.files[0];
            vm.upLoad = true;   
        }}
     }
}
</script>

<style scoped>
.upload{
    width: 400px;
    margin: auto;
}
.uploadButton{
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

.uploadButton:hover{
    color: rgb(50, 26, 5);
    background-color: rgb(227, 221, 221);
    border-color: rgb(50, 26, 5);
    transition: 0.3s;
}

.bio{
    padding-bottom: 60px;
}
</style>
