.<template>
    <div class="chatroom">
        <div class="notActive" v-if="this.$store.state.userloggedin" v-bind:class="{'displayChat':opencontact == true ||$store.state.openchat == true}">
            <div class="chatFixed" v-on:click="opencontact=!opencontact"><img  src="../images/chatFixed.svg" alt=""></div>
        </div>

        <div class="activeContacts" v-if="opencontact">
            <div class="chatTitle">
                <div class="circle">
                </div>
                聊天室
            </div>
            <div id="contactSection">
                       <div v-for="(contact,idx) in contacts" :key="idx" class="contactSection">
                <div class="contactUser" v-bind:data-id = "contact.userUID" v-on:click=" callchat">
                   
               
                      
                             <img v-bind:src="contact.profilePic" alt="" class="contactImg">
                        <p class="contactname">{{contact.name}}</p>
                      
                    </div>
                </div>
            </div>  
       
        </div>

        <div class="activeChat" v-if="this.$store.state.openchat" >
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

                <div v-for="(chat, idx) in messagesArray" :key="idx" class="messageSection">
                <div class="messageUser" v-bind:class="{'textRight':$store.state.userUID == chat.user}">
                    <img v-bind:src="chat.profilePic" alt="" class="messageImg">
               
                    <div class="messageContent">{{chat.message}}</div>
                    </div>
                </div>
            </div>
                <div class="messagebox">
                    <input type="text" v-model="messages" @keyup.enter="message"/>
                    
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
            messagesArray:[],
            contacts:[],
        };
    },

    created(){
     
 
    },
    watch:{
  
         '$store.state.userloggedin': function () {
              this.contacts=[];
        this.opencontact=false;
        this.$store.state.openchat=false;
             this.fetchContacts();  
    },
        '$store.state.messageUser': function() {
             
         this.name ="";
            this.imgSrc="";
            this.messages="";
            this.messagesArray= [];

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
        setTimeout(()=>{
            this.scrollToBottom();
        },1000);
       
    })

         } 
    setTimeout(()=>{
            this.scrollToBottom();
        },1000);
        }
    },
    methods: {
        fetchContacts(){
        
        var user = fb.auth().currentUser;
         var contacts = [];
        db.collection('profiles').doc(user.uid)
        .onSnapshot((doc) => {
        this.contacts = [];
        contacts = doc.data().messagesTime;
       
        if(user){
            this.notActive = true;
        }
         if(contacts){
             this.contacts = [];
                var j = Number(contacts.length)-1;
                for(j; j>=0;j--){
                    db.collection('profiles').doc(contacts[j]).get().then(doc =>{
                    this.contacts.push(doc.data());
                    
                    })
                }
            }
    });
        },
        scrollToBottom(){
            let box = document.querySelector('.messageboard');
            box.scrollTop=box.scrollHeight;
        },
        opencontacts(){
            
            this.opencontact = true;
        },

        closechat(){
            this.$store.state.openchat = false;
        },

        callchat(){
            
            this.$store.state.messageUser = event.target.dataset.id;
            this.$store.state.openchat = true;
           
             setTimeout(()=>{
            this.scrollToBottom();
        },1000);
        },

        message() {
            
          var date = new Date(); 
        var vm = this;
         var user = fb.auth().currentUser;
         var name;
         var profilePic;
        this.contacts = [];
        
        
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
        this.messages="";
       
          })
       setTimeout(()=>{
            this.scrollToBottom();
        },1000);

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
.activeContacts{
    border-radius: 10px; 
    position: fixed;
    bottom: 20px;
    right: 100px;
    width: 300px;
    height: 400px;
    background-color: white;
   -webkit-box-shadow: 0 0 15px #929292;
	-moz-box-shadow: 0 0 15px #929292;
	box-shadow: 0 0 15px #929292;
    margin-right: 20px;
}
#contactSection{
    overflow: scroll;
    overflow-x: hidden;
  height:340px;
}
.chatTitle{
    border-radius: 10px 10px 0px 0px; 
height: 60px;
display: flex;
justify-content: flex-start;
align-items: center;
color: rgb(50, 26, 5);
font-size: 18px;
background-color:#e8dfda ;
letter-spacing: 1px;

}
.circle{
    margin-left: 20px;
    margin-right: 10px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: rgb(50, 26, 5);
}
.contactUser{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding:10px 18px 10px 18px;
    transition: 0.2s;
    cursor: pointer;
   
}
.contactUser:hover{
 background-color: rgb(241, 241, 241);
 transition: 0.2s;
}

.contactImg{
    width: 42px;
    border-radius:50%;
    margin-right:10px;
}
.activeChat{
    position: fixed;
    bottom: 20px;
    right: 100px;
    width: 300px;
    height: 400px;
    background-color: white;
   -webkit-box-shadow: 0 0 15px #929292;
	-moz-box-shadow: 0 0 15px #929292;
	box-shadow: 0 0 15px #929292;
    margin-right: 20px;
}
.chatUser{
    padding: 10px;
    display: flex;
    font-size: 20px;
    font-weight: 500;
    justify-content: flex-start;
    align-items: center;
    background-color:#e8dfda;
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
.textRight{
    display: flex;
    justify-content: flex-end;
    
}
.textRight .messageContent{
    margin-right: 10px;
    background-color:#f7efef ;
}
.textRight img{
   display: none;
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
.messageContent{
    overflow: hidden;
    max-width: 180px;
    word-break: break-all;
    text-align: left;
    background-color:#e8dfda;
    padding: 6px 11px;
    border-radius: 25px;
    color:rgb(48, 48, 48);
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.messagebox input{
    width: 292px;
    height: 30px;
    outline: none;
    padding-left: 5px;
    border: 1px solid rgb(50, 26, 5);
}
.chatFixed {
    cursor: pointer;
    display:inline-block;
    width:65px;
    height:65px;
    background-color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    transition: 0.4s;
}
.chatFixed img{
    width: 35px;
}
.chatFixed:hover {
    
    opacity: 0.8;
    transition: 0.4s;
   
}

</style>