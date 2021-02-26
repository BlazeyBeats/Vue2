<template>
<div class="mainpage">
<div class="intro">
    <div class="introBlock">
        <div class="introcontentleft">

            <p>Upload your music</p>
            <p>Make friends</p>
      
        </div>
    </div>
</div>
<div class="musics">
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
    margin: 10px 70px;
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

.musics{
   display: flex;
  flex-direction: row;
   flex-wrap: wrap;
  padding: 30px 0;
  margin: 0 80px;

}
.postcollection-square{
    width: 220px;
    height: 220px;
    background-color: rgb(227, 221, 221);
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
   background-color: white;
   border-radius: 15px;
}
.postname{
    font-size:20px;

}
</style>
