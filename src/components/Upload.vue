<template>
<div class="upload">
 
    <p>Name :</p>
        <input type="text" v-model="postName" />
        <p>Bio :</p>
        <input type="text" v-model="postBio" />
        <p>Music Type :</p>
         <input type="text" v-model="postType" />
        <p>Choose File :</p>
        <input type="file" v-on:click="checkname" v-on:change="chooseFile" class="uploadMusic"/>
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
          
              var vm = this;
                fb.storage().ref('music/'+ this.$store.state.userUID +'/' + this.postName + '.mp3').getDownloadURL().then(url=>{
                    vm.musicSrc = url;
                    console.log(vm.musicSrc); 
                   
                    db.collection("music").add({
                    postName: this.postName,
                    postBio:this.postBio,
                    postType: this.postType,
                    postUrl:this.musicSrc,
                    postUser:this.$store.state.userUID
                })
                });
               
         
                
            
        },


           
         
 chooseFile(e){
          if(this.postName ===null) alert("Please input a name for your file");
          else{
               if(e.target.files[0]){
            file = e.target.files[0];
           var vm = this;
             fb.storage().ref('music/'+ this.$store.state.userUID +'/' + this.postName + '.mp3').put(file).then(function(){
                    console.log("upload success");
                    vm.upLoad = true;
                })
            }
          }
           
            
            
        }
     }
}
</script>

<style scoped>

</style>
