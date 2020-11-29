<template>
<div class="manage">
   <div class="update-profile">
    <p>Name :</p>
        <input type="text" v-model="name" />
        <p>Bio :</p>
        <input type="text" v-model="bio" />
    </div>
    <button v-on:click="updateProfile">Update</button>

</div>
</template>

<script>
import {fb,db} from './firebaseinit.js'
 var user = fb.auth().currentUser;
export default {
  data() {
        return {
             name:"",
             bio:""
             
        };
    },
    created(){},
     methods:{
         
         updateProfile(){
            var profileUpdate = db.collection("profiles").doc(user.uid);
            return profileUpdate.update({
                name:this.name,
                bio:this.bio   
            }).then(function() {
                alert("update success");
            })
        }
    }
}
</script>

<style scoped>

</style>
