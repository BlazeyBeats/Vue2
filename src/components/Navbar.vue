<template>
<div>
    <div class="navbar">
        <button v-on:click="popupsignin=!popupsignin;popupsignup=false" class="signinBtn">Sign In</button>
        <button v-on:click="popupsignup=!popupsignup;popupsignin=false" class="signupBtn">Sign Up</button>
    </div>
    <div v-if="popupsignin" v-on:click="popupsignup=false;popupsignin=false" class="signoverlay"></div>
    <div v-if="popupsignup" v-on:click="popupsignup=false;popupsignin=false" class="signoverlay"></div>

    <div v-if="popupsignin" class="signtemplate">
        <h1>SIGN IN</h1>
        <form @submit.prevent="pressed">
            <div class="login">
                <input type="text" placeholder="login" v-model="email" />
            </div>
            <div class="password">
                <input type="password" placeholder="password" v-model="password" />
            </div>
            <button v-on:click="Login">Login</button>
        </form>
        <div class="error" v-if="error">{{error.message}}</div>
        <p>Don't have an account?</p><button v-on:click="popupsignup=true;popupsignin=false">Sign Up</button>
    </div>

    <div v-if="popupsignup" class="signtemplate">
        <h1>SIGN UP</h1>
        <div>
            <div class="error" v-if="error">{{error.message}}</div>
            <form @submit.prevent="pressed">

                <div class="email">
                    <input type="email" v-model="email" placeholder="email" />
                </div>
                <div class="password">
                    <input type="password" v-model="password" placeholder="password" />
                </div>
                <button v-on:click="Register" type="submit">Sign Up</button>
                <p>Already have an account?</p><button v-on:click="popupsignup=false;popupsignin=true">Sign in</button>
            </form>
        </div>
    </div>
</div>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";
export default {
    data() {
        return {
            popupsignin: false,
            popupsignup: false,
            email: "",
            password: "",
            error: ""
        }
    },
    computed: {

    },
    methods: {
        Login() {
            firebase
                .auth()
                .signInWithEmailAndPassword(this.email, this.password)
                .then(data => {
                    console.log(data);
                    this.$router.replace({
                        name: "secret"
                    });
                })
                .catch(error => {
                    this.error = error;
                });
        },

        Register() {
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.email, this.password)
                .then(() => {
                    console.log("here");

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
    height: 600px;
    margin-top: -300px;
    margin-left: -350px;
    position: fixed;
    background-color: rgb(239, 243, 243);
    border-radius: 15px;
}

.signtemplate h1 {
    color: rgb(50, 26, 5);
    background-color: rgb(202, 206, 196);
    margin: 0;
    padding: 25px;
    border-radius: 15px 15px 0 0;
    display: flex;
    justify-content: center;
}
</style>
