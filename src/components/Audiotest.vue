
<template>
    <div id="audio-player-root" >

        <!-- Hide the default audio player -->
        <div >
            <audio
                style="display:none"
                ref="player"
                :id="playerid"
                src="https://firebasestorage.googleapis.com/v0/b/vue2-41a3c.appspot.com/o/music%2FFVr5E4KoEvX6aCvIw5Pa9joQqDo2%2FaVbG7bQxhbfKJYVTmOcQ%2FMusic.mp3?alt=media&token=4dc9458f-347d-4f0a-91ec-528ba900812c"
            >
                
            </audio>
        </div>
            
            <div>
                <div id="player-row" >
                    <div id="button-div" class="flex-initial pr-3">
                        <button @click="toggleAudio()" class="playbutton">
                            <img src="../images/playButton.svg" v-if="!isPlaying" class="play-button">
                            <img src="../images/pauseButton.svg" class="pause" v-else>
                        </button>
                      
                 
                    </div>
                       <div
                                v-show="audioLoaded"
                                class="time"
                            >
                            
                                <span class="text-sm" v-html="elapsedTime()">{{this.currentSeconds}}</span>

                                <span class="text-sm" v-html="totalTime()"> 00:00 </span>
                                
                            </div>
                    <div id="progress-bar">
                        <div>
                            <input
                                v-model="playbackTime"
                                type="range"
                                min="0"
                                :max="audioDuration"
                                class="slider"
                                id="position"
                                name="position"
                            />

                            <!-- Show loading indicator until audio has been loaded -->

                            <div v-show="!audioLoaded"
                            class="pointer-events-none"
                            style="color: #513E41">
                            加載中..
                            </div>
                            
                         

                            </div>
                        </div>
                    </div>
                </div>
     
        </div>
   
</template>

<script>

export default {
    props: ["url", "playerid"],
    /**
     * playbackTime = local var that syncs to audio.currentTime
     * audioDuration = duration of audio file in seconds
     * isPlaying = boolean (true if audio is playing)
     *
     **/
    data() {
        return {
            playbackTime: 0,
            audioDuration: 100,
            audioLoaded: false,
            isPlaying: false,
            currentSeconds:"00:00"
        };
    },
    methods: {
        //Set the range slider max value equal to audio duration
        initSlider() {
            var audio = this.$refs.player;
            if (audio) {
                this.audioDuration = Math.round(audio.duration);
            }
        },
        //Convert audio current time from seconds to min:sec display
        convertTime(seconds){
                            const format = val => `0${Math.floor(val)}`.slice(-2);
                
                var minutes = (seconds % 3600) / 60;
                return [minutes, seconds % 60].map(format).join(":");
        },
        //Show the total duration of audio file
        totalTime() {
            var audio = this.$refs.player;
            if (audio) {
                var seconds = audio.duration;
                return this.convertTime(seconds);
            } else {
                return '00:00';
            }
        },
        //Display the audio time elapsed so far
        elapsedTime() {
            var audio = this.$refs.player;
            if (audio) {
                var seconds = audio.currentTime;
                return this.convertTime(seconds);
            } else {
                return '00:00';
            }
        },
        //Playback listener function runs every 100ms while audio is playing
        playbackListener() {
            var audio = this.$refs.player;
            //Sync local 'playbackTime' var to audio.currentTime and update global state
            this.playbackTime = audio.currentTime;
            
            //console.log("update: " + audio.currentTime);
            //Add listeners for audio pause and audio end events
            audio.addEventListener("ended", this.endListener);
            audio.addEventListener("pause", this.pauseListener);
        },
        //Function to run when audio is paused by user
        pauseListener() {
            this.isPlaying = false;
            this.listenerActive = false;
            this.cleanupListeners();
        },
        //Function to run when audio play reaches the end of file
        endListener() {
            this.isPlaying = false;
            this.listenerActive = false;
            this.cleanupListeners();
        },
        //Remove listeners after audio play stops
        cleanupListeners() {
            var audio = this.$refs.player;
            audio.removeEventListener("timeupdate", this.playbackListener);
            audio.removeEventListener("ended", this.endListener);
            audio.removeEventListener("pause", this.pauseListener);
            //console.log("All cleaned up!");
        },
        toggleAudio() {
            var audio = this.$refs.player;
            //var audio = document.getElementById("audio-player");
            if (audio.paused) {
                audio.play();
                this.isPlaying = true;
            } else {
                audio.pause();
                this.isPlaying = false;
            }
        },
    },
    mounted: function() {
      // nextTick code will run only after the entire view has been rendered
      this.$nextTick(function() {
        
        var audio=this.$refs.player;
        //Wait for audio to load, then run initSlider() to get audio duration and set the max value of our slider 
        // "loademetadata" Event https://www.w3schools.com/tags/av_event_loadedmetadata.asp
        audio.addEventListener(
          "loadedmetadata",
          function() {
            this.initSlider();
          }.bind(this)
        );
        // "canplay" HTML Event lets us know audio is ready for play https://www.w3schools.com/tags/av_event_canplay.asp
        audio.addEventListener(
          "canplay",
          function() {
            this.audioLoaded=true;
          }.bind(this)
        );
        //Wait for audio to begin play, then start playback listener function
        this.$watch("isPlaying",function() {
          if(this.isPlaying) {
            var audio=this.$refs.player;
            this.initSlider();
            //console.log("Audio playback started.");
            //prevent starting multiple listeners at the same time
            if(!this.listenerActive) {
              this.listenerActive=true;
              //for a more consistent timeupdate, include freqtimeupdate.js and replace both instances of 'timeupdate' with 'freqtimeupdate'
              audio.addEventListener("timeupdate",this.playbackListener);
            }
          }
        });
        //Update current audio position when user drags progress slider
        this.$watch("playbackTime",function() {
           
            var audio=this.$refs.player;
        var diff=Math.abs(this.playbackTime-audio.currentTime);
        
           
            
          //Throttle synchronization to prevent infinite loop between playback listener and this watcher
          if(diff>0.01) {
            this.$refs.player.currentTime=this.playbackTime;
          }
            var seconds = audio.currentTime;
           
            this.currentSeconds = this.convertTime(seconds);
        });
      });
    }
};
</script>

<style scoped>

.playbutton{
    width: 55px;
    height: 55px;
    border-radius: 50%;
    border: 2px solid black;
    display: flex; 
    justify-content: center;
    align-items: center;
    outline: none;
    cursor: pointer;
    background-color: white;
}

.time{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: auto;
    width: 450px;
}
.text-sm{
    color: #513E41;
}
.play-button{
    height: 45px
}
input[type="range"] {
    margin: auto;
    -webkit-appearance: none;
    position: relative;
    overflow: hidden;
    width: 450px;
    height: 10px;
    cursor: pointer;
    outline: none;
    border-radius: 10px;
    background: transparent;
}
input[type="range"]:focus {
    outline: none;
}
::-webkit-slider-runnable-track {
    background: #D3CCC2;
}

::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 0;
    height: 40px;
    background: #D3CCC2;
    box-shadow: -100vw 0 0 100vw #513E41; 
    border: none; 
}
::-moz-range-track {
    height: 40px;
    background: #D3CCC2;
}
::-moz-range-thumb {
    background: #D3CCC2;
    height: 40px;
    width: 0; 
    border: none;
    border-radius: 0 !important;
    box-shadow: -100vw 0 0 100vw #513E41; 
    box-sizing: border-box;
}
::-ms-fill-lower {
    background: #513E41;
}
::-ms-thumb {
    background: #D3CCC2;
    border: 2px solid #999;
    height: 40px;
    width: 20px;
    box-sizing: border-box;
}
::-ms-ticks-after {
    display: none;
}
::-ms-ticks-before {
    display: none;
}
::-ms-track {
    background: #D3CCC2;
    color: transparent;
    height: 40px;
    border: none;
}
::-ms-tooltip {
    display: none;
}
</style>
