<template>
<div class="mainpage">
<div class="intro">
    <div class="introBlock">
        <div class="introcontentleft">

            <p>Upload your music</p>
            <p>Make friends</p>
            <button class="uploadBtn">Upload Now</button>
        </div>
    </div>
</div>

<div class="musics">
<div v-for="music in musics" :key="music.postName" class="postcollection">
   
        <router-link :to="{name:'MusicPage',
        params:{
            postID:music.postID,
        }}">
            <div class="postname">{{music.postName}}</div>
        </router-link>
        <div class="postbio">{{music.postBio}}</div>
        <div class="posttype">{{music.postType}}</div>
</div> 
</div>

</div>
</template>

<script>
import {db} from './firebaseinit.js'
export default {
data() {
        return {
            musics:[],
           
             
        };
    },
    created(){   
         
  
        db.collection('music').orderBy("postID","desc").get().then(querySnapshot =>{
            querySnapshot.forEach(doc=>{          
            this.musics.push(doc.data())
            })
        })

    }
}
</script>

<style scoped>
.introBlock {
    margin: 0 30px;
    padding: 180px;
    background-color: white;
    border-radius: 25px;
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

.uploadBtn {
    color: white;
    font-size: 28px;
    background-color: rgb(50, 26, 5);
    padding: 20px;
    border-style: solid;
    border-color: rgb(50, 26, 5);
    border-radius: 10px;
    cursor: pointer;
    transition: 0.3s;
    outline: none;
}

.uploadBtn:hover {
    color: rgb(50, 26, 5);
    
    background-color: white;
    border-color: rgb(50, 26, 5);
    transition: 0.3s;
}
.musics{
   display: flex;
  flex-direction: row;
   flex-wrap: wrap;
  padding: 30px 125px;

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
   background-color: white;
   border-radius: 15px;
}
</style>
