<template>
<div>
    <div class="navbar">
        <button v-on:click="popupsignin=!popupsignin;" class="upload">Upload</button>
        <button v-on:click="signOut" class="signoutBtn">Log Out</button>
        <button class="user">User</button>
    </div>

</div>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";
export default {
    mounted() {
        this.setupFirebase();
    },
    data() {
        return {

        }
    },
    computed: {

    },
    methods: {
        signOut() {
            firebase
                .auth()
                .signOut()
                .then(() => {
                    this.$router.replace({
                        name: "login"
                    });
                });
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

.user {
    padding-right: 100px;
}
</style>
