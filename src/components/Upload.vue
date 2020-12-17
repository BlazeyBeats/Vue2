<template>
<div class="upload">
 
    <p>Name :</p>
        <input type="text" v-model="postName"/>
        <p>Bio :</p>
        <input type="text" v-model="postBio" />
        <p>Music Type :</p>
         <input type="text" v-model="postType" />
        <p>Choose File :</p>
        <input type="file" v-on:change="chooseFile" class="uploadMusic"/>
    <button v-on:click="uploadMusic" v-if="upLoad">Upload</button>
</div>
</template>

<script>
import {fb,db} from './firebaseinit.js'

let file = {};

export default {
 data() {
        return {
            postName:"",
            postBio:"",
            postType:"",  
            musicSrc:"",
            upLoad:false   
        };
    },
    created(){
        var user = fb.auth().currentUser;
         this.$store.state.userUID = user.uid;
         
    },
    methods:{
    
        uploadMusic(){
     
            var ID;
            db.collection('music').orderBy("postID","desc").limit(1).get().then(querySnapshot =>{
            querySnapshot.forEach(doc=>{
                ID = doc.data().postID;
            })
        })
            var vm = this;  
            fb.storage().ref('music/'+ this.$store.state.userUID +'/' + this.postName + '.mp3').put(file).then(function(){
                    alert("Upload Success!");
                    fb.storage().ref('music/'+ vm.$store.state.userUID +'/' + vm.postName + '.mp3').getDownloadURL().then(url=>{
                    vm.musicSrc = url;
                    db.collection("music").add({
                    postName: vm.postName,
                    postBio:vm.postBio,
                    postType: vm.postType,
                    postUrl:vm.musicSrc,
                    postUser:vm.$store.state.userUID,
                    postID:ID+1
                })
                });
                })
        },  
        chooseFile(e){
            var vm = this;
            if(e.target.files[0]){
            file = e.target.files[0];
            vm.upLoad = true;   
        }}
     }
}
</script>

<style scoped>

</style>
