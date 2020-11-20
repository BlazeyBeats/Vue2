<template>
<div>
    <div class="navbar">
        <button v-on:click="popupsignin=!popupsignin;" class="signinBtn">Sign In</button>
        <button v-on:click="popupsignup=!popupsignup;" class="signupBtn">Sign Up</button>
    </div>
    <div v-if="popupsignin" v-on:click="popupsignup=false;popupsignin=false" class="signoverlay"></div>
    <div v-if="popupsignup" v-on:click="popupsignup=false;popupsignin=false" class="signoverlay"></div>

    <div v-if="popupsignin" class="signtemplate">
        <h1>SIGN IN</h1>
        <form @submit.prevent="pressed">
            <div class="input-email-password">
                <div class="login">
                    <p>Email :</p>
                    <input type="text" placeholder="example@gmail.com" v-model="email" />
                </div>
                <div class="password">
                    <p>Password :</p>
                    <input type="password" placeholder="password" v-model="password" />
                </div>

                <button v-on:click="Login">SIGN IN</button>
            </div>
        </form>
        <div class="error" v-if="error">{{error.message}}</div>
        <div class="switch-template">
            <p>Don't have an account?</p><button v-on:click="popupsignup=true;popupsignin=false">Sign Up</button>
        </div>
    </div>

    <div v-if="popupsignup" class="signtemplate">
        <h1>SIGN UP</h1>
        <div>
            <form @submit.prevent="pressed">
                <div class="input-email-password">
                <div class="name">
                        <p>Name :</p>
                        <input type="text" v-model="name" placeholder="Name" />
                    </div>
                    <div class="email">
                        <p>Email :</p>
                        <input type="email" v-model="email" placeholder="example@gmail.com" />
                    </div>
                    <div class="password">
                        <p>Password :</p>
                        <input type="password" v-model="password" placeholder="password" />
                    </div>

                    <button v-on:click="Register" type="submit">SIGN UP</button>
                </div>
            </form>
            <div class="error" v-if="error">{{error.message}}</div>
            <div class="switch-template">
                <p>Already have an account?</p><button v-on:click="popupsignup=false;popupsignin=true">Sign in</button>
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
             name:null,
            
        }
    },
    computed: {

    },
    methods: {
        Login() { 
           
                fb.auth()
                .signInWithEmailAndPassword(this.email, this.password)
                .then(data => {
                    console.log(data);
                  
                })
                .catch(error => {
                    this.error = error;
                });
        },

        Register() {
           
                
                fb.auth().createUserWithEmailAndPassword(this.email, this.password)
                .then((user) => {
                    db.collection("profiles").doc(user.user.uid).set({
                        name: this.name
                    })
                   

                })
                .catch(error => (this.error = error));
        }
    }
}
</script>

<style>
.navbar {
    display: flex;
    justify-content: flex-end;
}

.navbar button {
    font-size: 20px;
    margin: 30px 10px;
    border: none;
    outline: none;
    background: transparent;
    cursor: pointer;
}

.signupBtn {
    padding-right: 100px;
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

.signtemplate {
    left: 50%;
    top: 50%;
    width: 700px;
    height: 550px;
    margin-top: -275px;
    margin-left: -350px;
    position: fixed;
    background-color: rgb(239, 243, 243);
    border-radius: 15px;
}

.signtemplate h1 {
    letter-spacing: 1px;
    color: rgb(50, 26, 5);
    background-color: rgb(202, 206, 196);
    margin: 0;
    padding: 25px;
    border-radius: 15px 15px 0 0;
    display: flex;
    justify-content: center;
}

.input-email-password p {
    color: rgb(50, 26, 5);
    font-size: 22px;
    margin-top: 30px;
    margin-bottom: 20px;
    margin-left: 30px;
    display: flex;
    justify-content: flex-start;
    letter-spacing: 1px;
}

.input-email-password input {
    font-size: 18px;
    padding-left: 10px;
    background-color: rgb(239, 243, 243);
    width: 630px;
    height: 30px;
    margin: 0px 20px;
    border: none;
    border-bottom: 12px solid rgb(202, 206, 196);
    border-radius: 0 0 15px 15px;
    outline: none;
}

.input-email-password input::placeholder {
    color: gray;
}

.input-email-password button {
    background-color: rgb(239, 243, 243);
    font-size: 30px;
    margin-top: 30px;
    padding: 10px 70px;
    border: 2px solid rgb(50, 26, 5);
    border-radius: 30px;
    outline: none;
    letter-spacing: 1px;
    transition: 0.2s;
    cursor: pointer;
}

.input-email-password button:hover {
    background-color: rgb(50, 26, 5);
    color: rgb(239, 243, 243);
}

.login .password {
    display: flex;
    justify-content: flex-start;
}

.error {
    display: flex;
    justify-content: flex-start;
    margin-left: 30px;
    margin-top: 30px;
}

.switch-template {
    display: flex;
    justify-content: flex-start;
    margin: 10px 30px;
    font-size: 15px;
}

.switch-template button {
    outline: none;
    border: none;
    cursor: pointer;
    color: red;
    font-size: 15px;
    margin-left: 5px;
}
</style>
