<template>
<div class="intro">
    <div class="introBlock">
        <div class="introcontentleft">

            <p>Upload your music</p>
            <p>Make friends</p>
            <button v-on:click="upload" class="uploadBtn">Upload Now</button>
        </div>
    </div>
</div>
</template>

<script>
export default {

}
</script>

<style scoped>
.introBlock {
    margin: 0 30px;
    padding: 180px;
    background-color: white;
    border-radius: 25px;
}

.introcontentleft {
    width: 300px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
}

.introcontentleft p {
    font-size: 30px;
    margin-left: 10px;
    margin-top: 0;
}

.uploadBtn {
    color: white;
    font-size: 28px;
    background-color: rgb(50, 26, 5);
    padding: 20px;
    border-style: solid;
    border-color: rgb(50, 26, 5);
    border-radius: 10px;
    cursor: pointer;
    transition: 0.3s;
    outline: none;
}

.uploadBtn:hover {
    color: rgb(50, 26, 5);

    background-color: white;
    border-color: rgb(50, 26, 5);
    transition: 0.3s;
}
</style>
