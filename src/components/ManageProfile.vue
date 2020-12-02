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
 
export default {
  data() {
        return {
             name:"",
             bio:""
             
        };
    },
    created(){
        var user = fb.auth().currentUser;
         this.$store.state.userUID = user.uid;
    },
     methods:{
         
         updateProfile(){
             var user = fb.auth().currentUser; 
             if (this.name === "") this.name = this.$store.state.name
             else this.$store.state.name = this.name;
           if (user) {
            var profileUpdate = db.collection("profiles").doc(this.$store.state.userUID);
         
               return profileUpdate.update({
                name:this.name,
                bio:this.bio   
            }).then(function() {
                
                alert("update success");

            })}
            
           
          
        }
    }
}
</script>

<style scoped>

</style>
