.<template>
    <div class="chatroom">
        <div class="notActive">
            <div class="plus" v-on:click="opencontacts"></div>
        </div>
        <div class="activeContacts" v-if="opencontact"></div>
        <div class="activeChat" v-if="this.$store.state.openchat">
            <div class="chatUser">
                <img v-bind:src="imgSrc" alt="" class="imgSrc">
                <router-link :to="{name:'OtherProfile',
                    params:{
                        userID:this.$store.state.messageUser,
                    }}">
                <div class="chatName">{{this.name}}</div>
                </router-link>
                <div class="cross" v-on:click="closechat"></div>
            </div>
            <div id="container" class="messageboard">

                <div v-for="chat in messagesArray" :key="chat.message" class="messageSection">
                <div class="messageUser">
                    <img v-bind:src="chat.profilePic" alt="" class="messageImg">
               
                    <div class="messageContent">{{chat.message}}</div>
                    </div>
                </div>

                <div class="messagebox">
                    <input type="text" v-model="messages" @keyup.enter="message"/>
                    
                </div>
            </div>
      </div>
    </div>
</template>

<script>
import {fb,db,firebase} from './firebaseinit.js'
export default {   
    data() {
        return {
            opencontact:false,
            name:"",
            imgSrc:"",
            messages:"",
            messagesArray:[]
        };
    },
    created(){
       
    },
    watch:{
        '$store.state.messageUser': function() {
            var user = fb.auth().currentUser;
         var vm = this;
        if (this.$store.state.messageUser) {
            db.collection('profiles').doc(this.$store.state.messageUser).get().then(doc =>{ 
            vm.name = doc.data().name;

            fb.storage().ref('profiles/'+this.$store.state.messageUser+'/profile.jpg').getDownloadURL().then(imgUrl=>{
            this.imgSrc = imgUrl;
             })
         })

            db.collection('chats').doc(user.uid).collection(this.$store.state.messageUser).orderBy('date').onSnapshot((querySnapshot)=>{
            let allmessages=[]
        querySnapshot.forEach(doc=>{
            allmessages.push(doc.data())
        })
       this.messagesArray = allmessages;
        console.log(this.messagesArray);
    })

        
         } 
        }
    },
    methods: {
        opencontacts(){
            
            this.opencontact = true;
        },
        closechat(){
            this.$store.state.openchat = false;
        },
        message() {
            
          var date = new Date(); 
        var vm = this;
         var user = fb.auth().currentUser;
         var name;
         var profilePic;

        
        
         db.collection('profiles').doc(user.uid).get().then(doc =>{ 
           
            var messagesTime = doc.data().messagesTime;

            if(messagesTime){
                db.collection('profiles').doc(user.uid).update({
                messagesTime: firebase.firestore.FieldValue.arrayRemove(vm.$store.state.messageUser)
            });

                db.collection('profiles').doc(vm.$store.state.messageUser).update({
                messagesTime: firebase.firestore.FieldValue.arrayRemove(user.uid)
            });


                setTimeout(function(){           
                    db.collection('profiles').doc(user.uid).update({
                        messagesTime: firebase.firestore.FieldValue.arrayUnion(vm.$store.state.messageUser)
                    });
                    db.collection('profiles').doc(vm.$store.state.messageUser).update({
                    messagesTime: firebase.firestore.FieldValue.arrayUnion(user.uid)
                    });        
                }, 1000);
            } else{
                db.collection('profiles').doc(user.uid).update({
                    messagesTime: firebase.firestore.FieldValue.arrayUnion(vm.$store.state.messageUser)
                    });
                    db.collection('profiles').doc(vm.$store.state.messageUser).update({
                    messagesTime: firebase.firestore.FieldValue.arrayUnion(user.uid)
                    });     
            }
           
       
         });




        db.collection('profiles').doc(user.uid).get().then(doc=>{
            name = doc.data().name;
            profilePic = doc.data().profilePic;
            db.collection('chats').doc(user.uid).collection(this.$store.state.messageUser).doc().set({
            name:name,
            profilePic:profilePic,
            user:user.uid,
            date:date,
            message:this.messages,
            
        });
        
        db.collection("chats").doc(this.$store.state.messageUser).collection(user.uid).doc().set({
            name:name,
            profilePic:profilePic,
            user:user.uid,
            date:date,
            message:this.messages,
            
        });
        this.messages="",
        this.scrollToEnd();
          })
      },
      scrollToEnd() {    	
      var container = this.$el.querySelector("#container");
      container.scrollTop = container.scrollHeight;
    },
        
    }
 
}
</script>

<style scoped>

.notActive{
 
   position: fixed;
    bottom: 20px;
    right: 30px;
    
}
.activeChat{
     position: fixed;
    bottom: 20px;
    right: 100px;
    width: 300px;
    height: 400px;
    background-color: white;
   -webkit-box-shadow: 0 0 15px #a7a7a7;
	-moz-box-shadow: 0 0 15px #a7a7a7;
	box-shadow: 0 0 15px #a7a7a7;
}
.chatUser{
    padding: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color:rgb(227, 221, 221) ;
}
.chatUser img{
    width: 45px;
    height: 45px;
 
    margin-right: 15px;
}
.cross{
    position: absolute;
    right:12px;
    width: 25px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    cursor: pointer;
}
.cross:before, .cross:after {
  position: absolute;
  right:12px;
  content: ' ';
  height: 22px;
  width: 2px;
  background-color: rgb(48, 48, 48);
}
.cross:before {
  transform: rotate(45deg);
}
.cross:after {
  transform: rotate(-45deg);
}
.cross:hover {
   
   opacity: 1;
}
.messagebox{
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    
}
.messageboard{
    height: 301px;
    overflow: scroll;
    overflow-x: hidden;
    
}
.messageSection{
    width: 292px;
    
}
.messageUser{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 10px;
}
.messageUser img{
    width: 30px;
    border-radius: 50%;
    margin-left:10px;
    margin-right:10px;
}
.messageImg{
    width: 20px;
}
.messagebox input{
    width: 292px;
    height: 30px;
}
.plus {
    cursor: pointer;
    display:inline-block;
    width:60px;
    height:60px;
    background:
    linear-gradient(#fff,#fff),
    linear-gradient(#fff,#fff),
    #000;
    background-position:center;
    background-size: 50% 3px,3px 50%; /*thickness = 2px, length = 50% (25px)*/
    background-repeat:no-repeat;
    border-radius: 50%;
    transition: 0.4s;
}
.plus:hover {
    
    opacity: 0.8;
    transition: 0.4s;
   
}

</style>