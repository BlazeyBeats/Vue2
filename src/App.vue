<template>
<div class="main">
    <app-navbar></app-navbar>
    <app-intro></app-intro>
    <app-body></app-body>
</div>
</template>

<script>
//Imports
import Navbar from './components/Navbar';
import Intro from './components/Intro';
import Body from './components/Body';

export default {
    components: {
        'app-navbar': Navbar,
        'app-intro': Intro,
        'app-body': Body
    }
}
</script>

<style>
body {
    margin: 0;
    background-color: rgb(227, 221, 221);
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
