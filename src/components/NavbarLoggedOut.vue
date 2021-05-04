<template>
<div>
    <div class="navbar">
        <div class="navbarLogo">
            <router-link to="/">
            <img src="../images/logosvg.svg" alt="">
            </router-link>
        </div>


     <div class="navbarButtons">  
        <button v-on:click="popupsignin=!popupsignin;" class="signinBtn">登入</button>
        <button v-on:click="popupsignup=!popupsignup;" class="signupBtn" v-bind:class="{'signupBtnColor':$route.name == 'MusicPage'}">註冊</button>
    </div>
    </div>
    <div v-if="popupsignin" v-on:click="popupsignup=false;popupsignin=false" class="signoverlay"></div>
    <div v-if="popupsignup" v-on:click="popupsignup=false;popupsignin=false" class="signoverlay"></div>

    <div v-if="popupsignin" class="signtemplate signintemplate">
        <h1>登入</h1>
        <form @submit.prevent="pressed">
            <div class="input-email-password">
                <div class="login">
                    <p>電子郵件:</p>
                    <input type="text" placeholder="example@gmail.com" v-model="email" />
                </div>
                <div class="password">
                    <p>密碼:</p>
                    <input type="password" placeholder="password" v-model="password" />
                </div>

                <button v-on:click="Login">登入</button>
            </div>
        </form>
        <div class="error" v-if="error">{{error.message}}</div>
        <div class="switch-template">
            <p>還沒有帳號嗎?</p><button v-on:click="popupsignup=true;popupsignin=false">立刻註冊!</button>
        </div>
    </div>

    <div v-if="popupsignup" class="signtemplate signuptemplate">
        <h1>註冊</h1>
        <div>
            <form @submit.prevent="pressed">
                <div class="input-email-password">
                <div class="name">
                        <p>暱稱:</p>
                        <input type="text" v-model="name" placeholder="Name" />
                    </div>
                    <div class="email">
                        <p>電子信箱:</p>
                        <input type="email" v-model="email" placeholder="example@gmail.com" />
                    </div>
                    <div class="password">
                        <p>密碼:</p>
                        <input type="password" v-model="password" placeholder="password" />
                    </div>

                    <button v-on:click="Register" type="submit">註冊</button>
                </div>
            </form>
            <div class="error" v-if="error">{{error.message}}</div>
            <div class="switch-template">
                <p>已經有帳號了?</p><button v-on:click="popupsignup=false;popupsignin=true">立刻登入!</button>
            </div>
        </div>
    </div>
</div>
</template>

<script>


import {fb,db} from './firebaseinit.js'
export default {
    data() {
        return {
            popupsignin: false,
            popupsignup: false,
            email: null,
            password: null,
            error: "",
            name:"",
            
        }
    },
    computed: {

    },
    methods: {
        Login() { 
           
                fb.auth()
                .signInWithEmailAndPassword(this.email, this.password)
                .then(() =>  {
                   
                    var user = fb.auth().currentUser;
                    this.$store.state.userUID = user.uid;
                    this.$store.state.userloggedin = true;
                })
                .catch(error => {
                    this.error = error;
                });
        },

        Register() {
           
                if (this.name === "")
                alert("Please input a name");
                else{
                fb.auth().createUserWithEmailAndPassword(this.email, this.password)
                .then((user) => {
                    db.collection("profiles").doc(user.user.uid).set({
                        userUID:user.user.uid,
                        name: this.name,
                        bio:"",
                        profilePic:"https://firebasestorage.googleapis.com/v0/b/vue2-41a3c.appspot.com/o/Red.jpg?alt=media&token=b6ee019f-d2c8-4e26-b734-e315b4a99cd6",
                        Facebook:"",
                        Instagram:"",
                        Twitter:"",
                        LikedPosts:[],
                        Following:[],
                        Followers:[],
                        messagesTime:[]
                    })
                    
                })
                .catch(error => (this.error = error));}
        }
    }
}
</script>

<style>
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right:100px;
}

.navbarButtons{
    display: flex;
    justify-content: center;
    align-items:center;
    outline: none;
}
.navbarButtons button{
    outline: none;
    cursor: pointer;
}
.navbar button {
    font-size: 20px;
    outline: none;

}
.signinBtn{
    padding: 3px 17px 3px 20px;
     border: 2px solid #513E41;
     border-radius: 25px;
     color:#FFF6F6;
     background-color: #513E41;
    letter-spacing: 2px;
    transition: 0.2s;

}
.signinBtn:hover{
    border: 2px solid #513E41;
     color:#513E41;
     background-color: #FFF6F6;
     transition: 0.2s;
}
.signupBtn {
    
    margin-left:30px;
    border: none;
    color: #513E41;
    background-color:#FFF6F6;
}
.signupBtnColor{
background-color:#e8dfda !important;
}
.signoverlay {
    position: fixed;
    width: 100%;
    opacity: 0.5;
    top: 0px;
    margin: 0px;
    min-height: 200px;
    height: 100%;
    background-color: #000;
}

.signintemplate  {
    left: 50%;
    top: 50%;
    width: 550px;
    height: 600px;
    margin-top: -300px;
    margin-left: -275px;
    position: fixed;
    background-color: rgb(239, 243, 243);
    border-radius: 10px;
}

.signuptemplate  {
    left: 50%;
    top: 50%;
    width: 550px;
    height: 680px;
    margin-top: -340px;
    margin-left: -275px;
    position: fixed;
    background-color: rgb(239, 243, 243);
    border-radius: 10px;
}


.signtemplate h1 {
    font-size: 40px;
    letter-spacing: 2px;
    color: #513E41;
    background-color: #bdb6ac;
    margin: 0;
    padding: 25px;
    border-radius: 10px 10px 0 0;
    display: flex;
    justify-content: center;
}
.input-email-password{
    margin: 0px 55px;
    display: flex;
    justify-content: center;
    flex-direction: column;
}

.input-email-password p {
    color: #513E41;
    font-size: 20px;
    margin-top: 25px;
    margin-bottom: 15px;
    
    display: flex;
    justify-content: flex-start;
    letter-spacing: 1px;
}

.input-email-password input {
    font-size: 18px;
    padding-left: 20px;
    background-color: rgb(239, 243, 243);
    width: 430px;
    height: 50px;
    border: 2px solid #bdb6ac;
    border-radius: 55px;
    outline: none;
}

.input-email-password input::placeholder {
    color: gray;
   
    transition: 0.1s;
}

.input-email-password input:focus::placeholder {
   opacity: 0;
   transition: 0.1s; 
}


.input-email-password button {
    background-color: rgb(239, 243, 243);
    font-size: 28px;
    margin: 40px 100px 0px 90px;
   
    padding: 15px 50px;
    border: 2px solid #513E41;
    border-radius: 40px;
    outline: none;
    letter-spacing: 1px;
    transition: 0.2s;
    cursor: pointer;
}

.input-email-password button:hover {
    background-color: #513E41;
    color: rgb(239, 243, 243);
}

.login .password {
    display: flex;
    justify-content: flex-start;
}

.error {
    display: flex;
    justify-content: flex-start;
    font-size: 20px;
    margin: 30px;
}

.switch-template {
    display: flex;
    justify-content: center;
    margin: 10px 55px;
    font-size: 20px;
    letter-spacing: 2px;
}

.switch-template button {
    outline: none;
    border: none;
    cursor: pointer;
    background-color:rgb(239, 243, 243) ;
    color: red;
    font-size: 20px;
    letter-spacing: 2px;
    margin-left: 5px;
}

@media screen and (max-width: 425px) {
.navbar button {
    font-size: 16px;
}
  .signinBtn{
    padding: 2px 12px 2px 16px;
}
.signupBtn {
    margin-left:15px;
}

.signintemplate  {
    width: 360px;
    height: 470px;
    margin-top: -235px;
    margin-left: -180px;
}

.signuptemplate  {
   width: 360px;
    height: 470px;
    margin-top: -235px;
    margin-left: -180px;
   
}
.signtemplate h1 {
    font-size: 22px;
    padding: 15px;
   
}
.input-email-password{
    margin: 0px 20px;
}
.input-email-password p {
    font-size: 16px;
    margin-top: 20px;
    margin-bottom: 10px;
    
  
}

.input-email-password input {
    font-size: 15px;
    padding-left: 15px;
    width: 280px;
    height: 28px;
}
.input-email-password button { 
    font-size: 17px;
    margin: 30px auto 10px auto;
    padding: 6px 20px 6px 23px;
    width: max-content;
}
.error {
    font-size: 14px;
    margin: 10px;
}

.switch-template {
    margin: 10px 55px;
    font-size: 15px;
}

.switch-template button {
    font-size: 15px;
    margin-left: 5px;
}
}
</style>
