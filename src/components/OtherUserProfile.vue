<template>
<div class="profile">

<div v-if="this.$store.state.userProfilePic" class="profile-pic">
<img v-bind:src="imgSrc" alt="" class="imgSrc">
</div>
<div v-else class="circle-pic"></div>
<div class="profile-name">{{name}}</div>
<div class="profile-bio">{{bio}}</div>


</div>
</template>

<script>
import {fb,db} from './firebaseinit.js'
export default {
    name:'OtherProfile',
  data() {
        return {
            name:"",
            imgSrc:"",
            bio:""
        };
    },
    created() {
        var vm = this;
        if (this.$route.params.postUserID) {
            db.collection('profiles').doc(this.$route.params.postUserID).get().then(doc =>{ 
            vm.bio = doc.data().bio;
            vm.name = doc.data().name;
            fb.storage().ref('profiles/'+this.$route.params.postUserID+'/profile.jpg').getDownloadURL().then(imgUrl=>{
            this.imgSrc = imgUrl;
             })
         })}  
     },
}
</script>

<style scoped>

.imgSrc{
     width: 250px;
    height: 250px;
     border-radius: 50%;
     object-fit: cover;
     display: flex;
    justify-content: center;
    margin: auto;
    margin-top: 80px;
}

.circle-pic{
    width: 250px;
    height: 250px;
    background-color: rgb(50, 26, 5) ;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    margin: auto;
    margin-top: 80px;
}
.profile-name{
    font-size: 35px;
    background-color: rgb(180, 167, 156) ;
    padding: 12px 40px;
    display: flex;
    justify-content: center;
    margin: 40px auto;
    width:max-content;
    border-radius: 30px;
    color:rgb(50, 26, 5);
}

</style>
