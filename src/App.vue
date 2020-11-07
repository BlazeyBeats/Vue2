<template>
<div id="app">
    <app-firebasetest></app-firebasetest>
    <app-navbar></app-navbar>
    <app-intro></app-intro>
    <app-body></app-body>

</div>
</template>

<script>
import Navbar from './components/Navbar';
import Intro from './components/Intro';
import Body from './components/Body';
import FirebaseTest from './components/FirebaseTest';

export default {
    components: {
        'app-firebasetest': FirebaseTest,
        'app-navbar': Navbar,
        'app-intro': Intro,
        'app-body': Body
    }
};
</script>  

<style lang="scss">
body {
    margin: 0;

    background-color: rgb(227, 221, 221);
    ;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: -0px !important;
}
</style>
