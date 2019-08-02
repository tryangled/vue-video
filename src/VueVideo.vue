<template>
 <div>
  <div class="vue-video">
  <div class="vue-video__video-selector">
    <input 
      v-if="showInputTextBox"
      :style="inputStyle" 
      type="text"
      :placeholder="urlInputPlaceholderText"
      v-on:keypress.13="processVideoLink({videoUrl})"
      @blur="processVideoLink({videoUrl})"
      v-model="videoUrl"
      class="vue-video__video-selector__url"
    />
    <div class="vue-video__video-selector__list">
    <div class="vue-video__video-selector__item" v-for="(video, key) in videos" v-bind:key="key">
      <img :style="thumbStyle" class="vue-video__video-selector__thumbnail" v-bind:src="video.thumbUrl" @click="onVideoClick(video.Url,$event)">
      <div class="vue-video__video-selector__item__img" @click="onVideoDelete(key)"><!-- <img src="@/assets/delete.png" @click="onVideoDelete(key)" /> -->
    </div>
    

    </div>
    </div>
  </div>
  </div>

  </div>
</template>

<script>

export default {
 props: {
  thumbWidthPX: {
    type: String,
    default: "100"
  },
  urlInputBorder: {
    type: String,
    default: "gray"
  },
  urlInputTextColor: {
    type: String,
    default: "black"
  },
  urlInputPlaceholderText: {
    type: String,
    default: "Video link (Youtube or Vimeo)"
  },
  urlInputTextHeightPX: {
    type: String,
    default: "30"
  },
  limitVideoTo: {
    type: String,
    default: "3"
  }
 },
 computed: {
      inputStyle () {
        return 'border: 1px solid ' + this.urlInputBorder +'; color: ' + this.urlInputTextColor + ';' + '; height: ' + this.urlInputTextHeightPX + 'px ;' ;
      },
      thumbStyle () {
        return 'width: ' + this.thumbWidthPX + 'px ;' ;
      },
      showInputTextBox () {
        /* console.log("Videos Length - " + this.videos.length + this.limitVideoTo ); */
        if(this.limitVideoToComp == -1 || this.limitVideoToComp > this.videos.length)
          return true;
        else
          return false;
      },
      limitVideoToComp () {
        return parseInt(this.limitVideoTo,10);
      }
  },
  data() {
    return {
      videos: [],
      videoUrl: "",
    };
  },
 methods: {
  onVideoDelete (key) {
    /* console.log("Key - " + key); */
    var video = this.videos[key];
    this.videos.splice(key,1);
    this.$emit("VideoDeleted", {
              video: video,
              position: key,
              videos: this.videos
            });
  },
  onVideoClick(Url, event) {
   /* console.log("Url - " + Url); */
   this.$emit("thumbnailClick", Url);
  },
  addVideo(video) {
    
    this.videos.push(video);
    /* console.log("Video URL - " + video.Url);
    console.log("Video is valid - " + video.isValid);
    console.log("Video Thumb - " + video.thumbUrl);
    console.log("Type - " + video.type); */
    
    this.$emit("VideoAdded",{
              video: video,
              videos: this.videos
            });
    this.videoUrl = "";
  },
  processVideoLink(event) {
    var video = {Url: "", isValid: "", thumbUrl: "", type: ""};
    video.Url = event.videoUrl;
    /* console.log(video.Url ); */
    if(!video.isValid)
    {
      video.type = "UNKNOWN";
    if (video.Url == "") {
        // console.log("Do nothing");
        return 0;
      } else {
        video.isValid = false;
        video.thumbUrl = "";
        var notYoutube = false;
        var youtube_video_id = video.Url.match(
          /(youtu[be]*)(\.com|\.be).*(\?v=|\/embed\/|\/)(.{11})$/
        );
        /* 
        var youtube_video_id = this.videoUrl.match(
          /[youtube | youtu]\.[com|be].*(\?v=|\/embed\/|\/)(.{11})/
        );
        */
        //Check if it is youtube video or Vimeo
        if (youtube_video_id) {
          youtube_video_id = youtube_video_id.pop();
          //Verify the length of the youtube viceo id retreived
          if (youtube_video_id.length == 11) {
            var video_thumbnail =
              "https://img.youtube.com/vi/" + youtube_video_id + "/0.jpg";
            video.Url = "https://www.youtube.com/embed/" + youtube_video_id;
            video.isValid = true;
            video.thumbUrl = video_thumbnail;
            video.type = "YOUTUBE";
            
            this.addVideo(video);
          } else {
            notYoutube = true;
          }
        } else {
          notYoutube = true;
        }
        //To check for vimeo
        if (notYoutube) {
          var VIMEO_BASE_URL = "https://vimeo.com/api/oembed.json?url=";
          var videoTestUrl = video.Url;

          var self = this;


          fetch(VIMEO_BASE_URL + videoTestUrl).then(response => response.json()).then(
            function(response) {
              //console.log(response);
              video.Url =
                "https://player.vimeo.com/video/" + response.video_id;
              video.isValid = true;
              video.thumbUrl = response.thumbnail_url_with_play_button;
              video.type = "VIMEO";
              self.addVideo(video);
            },
            function(error) {
              self.$emit("VideoUrlError", video.Url);
              
            }
          );
        }



      }
    }
  },
 }
};
</script>


<style>
.vue-video {
  width: 100%;
  float: left;
}
.vue-video__video-selector {
  width: 95%;
  margin: 0 auto;

}
.vue-video__video-selector__url {
  width: 100%;
  height: 30px;
  border-radius: 10px;
  outline: none;
  border: 1px solid gray;
  padding: 0 10px;
  margin: 0px 0 10px 0;

}
.vue-video__video-selector__list {
  width: 100%;
  float: left;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
.vue-video__video-selector__item {
  float: left; 
  margin: 10px;
  position: relative;
}
.vue-video__video-selector__thumbnail {
  width: 100px;
}
.vue-video__video-selector__item__img {
  position: absolute;
  top: -10px;
  right: -10px;
  width:25px;
  height:25px;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABmJLR0QA/wD/AP+gvaeTAAADbUlEQVRIia2WS2xUZRTHf+e706GdaaeUcVrDgrZEYkHTOJaGWmLAhSaE2FZNU8skHdq6UAJRgw+CielKcIEGfCyMTNuoPITg0EYWRBMfUUhEUlg0BkxaGk2xUi32RVt6j4tp6XS4c0eCZ3OT7/zP/3e++z3uFTKEggzURR9WpQrVIhFTqGoPIVzFts6WdLefz+Qh6RKXN0UCHq9np8BWYIWLx4CKtE/ZZl9ZV2z0P0P6a6IR4F2EUKYuk2JIhZdK452HXSHa1mb6z/ftEeG1OzBPMdS9K8Ir35C2Nnt+zJMsuFsAgCK7Bnr6FNi9AJ4H1EQjCJ/eDSCZpSpbSrs6jgAYgF9qWvIQ9qUqrUAevqoKMMbZyhh8j6zFCuSlZkTQA5c3RQK3IEtk9hWgKFVZ0LqF0K4dBF+IOjKCz0cJvb6dgpbG25NCyJtlvQxgFMRAs5PJ5LkeUCX38Q3kP7N5US7w9GZyn9gAqkyeu+DYhArNCmK11EUrFF51Es0M/I4YQ/aDZWSXr+Hm4B/MXPkNX3VlYnYijBw9yeiprx0hIEtHVofjHlVd53ImGTkSx1MUwr+xmuD2Vkwgj4KmehBh/JsfuX70ZNpaAGyqDMhyV5Eqw+8d5MbFXsSbxbLnIojXy1TvJYY/iIGqa7lgLzcoy9xbAZ2dZfjDjgVDVa4d+BiduZmpFJB7DIbhjDLLIrhtK8jcaxUhuKMVyfK41gGo8KdBddCdkDDMLl+DTk/z18FD6PQM2Q/cT3Bb8wI4PWXQYFtn3TRLG2rxb6xOrM37MUa7T3Nt/0egiv+x9eTXP+nOsMwZM/c96HcS+B9dR35DLQB/f3Kc8e8S/Uz88BMjn51INNH4FL71lekQV1Z+EbtgEjOSTidJTmUYRBg7/S3/nPhyUe768W7GvvoeRPCtfcgRIUgs8QSG6utzJ6Z9v5JytZhcP0tWr2Ly54tg27e7WBY5FeVM9V7CHhtPzQ7dUOu+sq7Y6K1V66uLNopyKM287zRUhGeL452fw9wFCVAa7zysyNv/E+StecAiCEBJuGS3oHsB92OcPlSEPcXh0jeTBx03eV9tU4Mg+3G4/l3iqggvJs/AFQKJzTA5lbNThWaQYhfzfoH2HO/EO4XHjo05CTIc1zmXmqawGqlCuddAoQ2J/y7kTGm8oydT/b9zrCHroTf7/wAAAABJRU5ErkJggg==');
}
</style>