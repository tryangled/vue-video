import VueVideo from "./VueVideo.vue";

export default {
 install(Vue, options) {
  // Let's register our component globally
  // https://vuejs.org/v2/guide/components-registration.html
  Vue.component("vue-video", VueVideo);
 }
};