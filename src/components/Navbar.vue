<template>
<div class="navbar">
    <button v-on:click="popupsignin=!popupsignin;popupsignup=false" class="signinBtn">Sign In</button>
    <button v-on:click="popupsignup=!popupsignup;popupsignin=false" class="signupBtn">Sign Up</button>
</div>
<div v-if="popupsignin" v-on:click="popupsignup=false;popupsignin=false" class="signoverlay"></div>
<div v-if="popupsignup" v-on:click="popupsignup=false;popupsignin=false" class="signoverlay"></div>
<div v-if="popupsignin" class="signtemplate">
    <h1>SIGN IN</h1>

</div>
<div v-if="popupsignup" class="signtemplate">
    <h1>SIGN UP</h1>

</div>
</template>

<script>
export default {
    data() {
        return {
            popupsignin: false,
            popupsignup: false
        }
    },
    computed: {

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
}
</style>
