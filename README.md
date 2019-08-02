# @tryangled/vue-video youtube and vimeo component for Vue.js

## TL;DR
Component to take as input Youtube and/or Vimeo urls and return the correct video url, type (youtube/vimeo), valid/invalid and thumbnail url.

- Demo Link - https://ve1jk.csb.app/

## Features

- Lightweight (<6KB gzipped)
- Dependency free
- Mobile support
- Returns an array of videos
- Retreives the thumbnail of the video

## Usage

### A. Globally

```js
import Vue from 'vue'
import vue-video from '@tryangled/vue-video'

// register component <vue-video>
Vue.use(vue-video)
```

### B. Use as component: https://codesandbox.io/embed/vue-video-sample-app-ve1jk?fontsize=14

```html
<template>
  <div>
    <vue-video
      thumbWidthPX="100"
      urlInputBorder="blue"
      urlInputTextColor="green"
      urlInputPlaceholderText="Add Youtube / Vimeo Link"
      urlInputTextHeightPX="30"
      limitVideoTo="3"
      @VideoDeleted="onVideoDeleted"
      @thumbnailClick="onThumbClicked"
      @VideoAdded="onVideoAdded"
      @VideoUrlError="onVideoUrlError"
    ></vue-video>
  </div>
</template>

<script>
  import {vueVideo} from '@tryangled/vue-video'

  export default {
    data () {
      return {
        }
      },
    methods: {
      onVideoDeleted(value) {
        //write your code here
        console.log(value.position);
        console.log(value.videos);
        console.log(value.video);
        },
      onThumbClicked(url) {
        //write your code here
        console.log(url);
        },
      onVideoAdded(value) {
        //write your code here
        console.log(value.videos);
        console.log(value.video);
        },
      onVideoUrlError(url) {
        //write your code here
        console.log(url);
        }
      }
    }
</script>
```

## Custom attributes


| Attribute               | Required | Type    | Default | Description                                             |
|-------------------------|----------|---------|---------------------------------|------------------------------|
| thumbWidthPX            | optional | String  | "100"                           | Thumbnail Width in px             |
| urlInputBorder          | optional | String  | "gray"                          | Input Border Color           |
| urlInputTextColor       | optional | String  | "black"                         | Input Text Color             |
| urlInputPlaceholderText | optional | String  | "Video link (Youtube or Vimeo)" | Input placeholder Text       |
| urlInputTextHeightPX    | optional | String  | "30"                            | Input Height in px                |
| limitVideoTo            | optional | String  | "-1"                             | Limit of videos ("-1" = unlimited)    |


## Event handlers
| Event handler  | Parameter                 | Type   | Description                                             |
|----------------|---------------------------|-------------------------------------------------------------------------------------|---------------------------------|------------------------------|
| VideoDeleted   | {position, video, videos} | {String, {Url, isValid, thumbUrl, type}, [{Url, isValid, thumbUrl, type}, ... ]}    | event triggered when a video is deleted from the list |
| thumbnailClick | videoUrl                  | String                                                                              | event triggered when a thumbnail is clicked, parameter passed is the video URL |
| VideoAdded     | {video, videos}  | {{Url, isValid, thumbUrl, type}, [{Url, isValid, thumbUrl, type}, ... ]}            | event triggered when a valid video is added to the list             |
| VideoUrlError  | url | String  | event triggered when the url entered cannot be resolved to a valid youtube / vimeo url      |

### References

- https://developer.vimeo.com/api/guides/start
