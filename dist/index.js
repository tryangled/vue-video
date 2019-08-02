/*!
 * @tryangled/vue-video v1.0.0
 * (c) Vinay Samtani
 * Released under the MIT License.
 */
'use strict';

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script = {
  props: {
    thumbWidthPX: {
      type: String,
      "default": "100"
    },
    urlInputBorder: {
      type: String,
      "default": "gray"
    },
    urlInputTextColor: {
      type: String,
      "default": "black"
    },
    urlInputPlaceholderText: {
      type: String,
      "default": "Video link (Youtube or Vimeo)"
    },
    urlInputTextHeightPX: {
      type: String,
      "default": "30"
    },
    limitVideoTo: {
      type: String,
      "default": "3"
    }
  },
  computed: {
    inputStyle: function inputStyle() {
      return 'border: 1px solid ' + this.urlInputBorder + '; color: ' + this.urlInputTextColor + ';' + '; height: ' + this.urlInputTextHeightPX + 'px ;';
    },
    thumbStyle: function thumbStyle() {
      return 'width: ' + this.thumbWidthPX + 'px ;';
    },
    showInputTextBox: function showInputTextBox() {
      /* console.log("Videos Length - " + this.videos.length + this.limitVideoTo ); */
      if (this.limitVideoToComp == -1 || this.limitVideoToComp > this.videos.length) return true;else return false;
    },
    limitVideoToComp: function limitVideoToComp() {
      return parseInt(this.limitVideoTo, 10);
    }
  },
  data: function data() {
    return {
      videos: [],
      videoUrl: ""
    };
  },
  methods: {
    onVideoDelete: function onVideoDelete(key) {
      /* console.log("Key - " + key); */
      var video = this.videos[key];
      this.videos.splice(key, 1);
      this.$emit("VideoDeleted", {
        video: video,
        position: key,
        videos: this.videos
      });
    },
    onVideoClick: function onVideoClick(Url, event) {
      /* console.log("Url - " + Url); */
      this.$emit("thumbnailClick", Url);
    },
    addVideo: function addVideo(video) {
      this.videos.push(video);
      /* console.log("Video URL - " + video.Url);
      console.log("Video is valid - " + video.isValid);
      console.log("Video Thumb - " + video.thumbUrl);
      console.log("Type - " + video.type); */

      this.$emit("VideoAdded", {
        video: video,
        videos: this.videos
      });
      this.videoUrl = "";
    },
    processVideoLink: function processVideoLink(event) {
      var video = {
        Url: "",
        isValid: "",
        thumbUrl: "",
        type: ""
      };
      video.Url = event.videoUrl;
      /* console.log(video.Url ); */

      if (!video.isValid) {
        video.type = "UNKNOWN";

        if (video.Url == "") {
          // console.log("Do nothing");
          return 0;
        } else {
          video.isValid = false;
          video.thumbUrl = "";
          var notYoutube = false;
          var youtube_video_id = video.Url.match(/(youtu[be]*)(\.com|\.be).*(\?v=|\/embed\/|\/)(.{11})$/);
          /* 
          var youtube_video_id = this.videoUrl.match(
            /[youtube | youtu]\.[com|be].*(\?v=|\/embed\/|\/)(.{11})/
          );
          */
          //Check if it is youtube video or Vimeo

          if (youtube_video_id) {
            youtube_video_id = youtube_video_id.pop(); //Verify the length of the youtube viceo id retreived

            if (youtube_video_id.length == 11) {
              var video_thumbnail = "https://img.youtube.com/vi/" + youtube_video_id + "/0.jpg";
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
          } //To check for vimeo


          if (notYoutube) {
            var VIMEO_BASE_URL = "https://vimeo.com/api/oembed.json?url=";
            var videoTestUrl = video.Url;
            var self = this;
            fetch(VIMEO_BASE_URL + videoTestUrl).then(function (response) {
              return response.json();
            }).then(function (response) {
              //console.log(response);
              video.Url = "https://player.vimeo.com/video/" + response.video_id;
              video.isValid = true;
              video.thumbUrl = response.thumbnail_url_with_play_button;
              video.type = "VIMEO";
              self.addVideo(video);
            }, function (error) {
              self.$emit("VideoUrlError", video.Url);
            });
          }
        }
      }
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD;
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) style.element.setAttribute('media', css.media);

      if (HEAD === undefined) {
        HEAD = document.head || document.getElementsByTagName('head')[0];
      }

      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) style.element.removeChild(nodes[index]);
      if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
    }
  }
}

var browser = createInjector;

/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', [_c('div', {
    staticClass: "vue-video"
  }, [_c('div', {
    staticClass: "vue-video__video-selector"
  }, [_vm.showInputTextBox ? _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.videoUrl,
      expression: "videoUrl"
    }],
    staticClass: "vue-video__video-selector__url",
    style: _vm.inputStyle,
    attrs: {
      "type": "text",
      "placeholder": _vm.urlInputPlaceholderText
    },
    domProps: {
      "value": _vm.videoUrl
    },
    on: {
      "keypress": function keypress($event) {
        if (!$event.type.indexOf('key') && $event.keyCode !== 13) {
          return null;
        }

        return _vm.processVideoLink({
          videoUrl: _vm.videoUrl
        });
      },
      "blur": function blur($event) {
        return _vm.processVideoLink({
          videoUrl: _vm.videoUrl
        });
      },
      "input": function input($event) {
        if ($event.target.composing) {
          return;
        }

        _vm.videoUrl = $event.target.value;
      }
    }
  }) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "vue-video__video-selector__list"
  }, _vm._l(_vm.videos, function (video, key) {
    return _c('div', {
      key: key,
      staticClass: "vue-video__video-selector__item"
    }, [_c('img', {
      staticClass: "vue-video__video-selector__thumbnail",
      style: _vm.thumbStyle,
      attrs: {
        "src": video.thumbUrl
      },
      on: {
        "click": function click($event) {
          return _vm.onVideoClick(video.Url, $event);
        }
      }
    }), _vm._v(" "), _c('div', {
      staticClass: "vue-video__video-selector__item__img",
      on: {
        "click": function click($event) {
          return _vm.onVideoDelete(key);
        }
      }
    })]);
  }), 0)])])]);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-dab702d2_0", {
    source: ".vue-video{width:100%;float:left}.vue-video__video-selector{width:95%;margin:0 auto}.vue-video__video-selector__url{width:100%;height:30px;border-radius:10px;outline:0;border:1px solid gray;padding:0 10px;margin:0 0 10px 0}.vue-video__video-selector__list{width:100%;float:left;display:flex;align-items:center;justify-content:center;flex-wrap:wrap}.vue-video__video-selector__item{float:left;margin:10px;position:relative}.vue-video__video-selector__thumbnail{width:100px}.vue-video__video-selector__item__img{position:absolute;top:-10px;right:-10px;width:25px;height:25px;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABmJLR0QA/wD/AP+gvaeTAAADbUlEQVRIia2WS2xUZRTHf+e706GdaaeUcVrDgrZEYkHTOJaGWmLAhSaE2FZNU8skHdq6UAJRgw+CielKcIEGfCyMTNuoPITg0EYWRBMfUUhEUlg0BkxaGk2xUi32RVt6j4tp6XS4c0eCZ3OT7/zP/3e++z3uFTKEggzURR9WpQrVIhFTqGoPIVzFts6WdLefz+Qh6RKXN0UCHq9np8BWYIWLx4CKtE/ZZl9ZV2z0P0P6a6IR4F2EUKYuk2JIhZdK452HXSHa1mb6z/ftEeG1OzBPMdS9K8Ir35C2Nnt+zJMsuFsAgCK7Bnr6FNi9AJ4H1EQjCJ/eDSCZpSpbSrs6jgAYgF9qWvIQ9qUqrUAevqoKMMbZyhh8j6zFCuSlZkTQA5c3RQK3IEtk9hWgKFVZ0LqF0K4dBF+IOjKCz0cJvb6dgpbG25NCyJtlvQxgFMRAs5PJ5LkeUCX38Q3kP7N5US7w9GZyn9gAqkyeu+DYhArNCmK11EUrFF51Es0M/I4YQ/aDZWSXr+Hm4B/MXPkNX3VlYnYijBw9yeiprx0hIEtHVofjHlVd53ImGTkSx1MUwr+xmuD2Vkwgj4KmehBh/JsfuX70ZNpaAGyqDMhyV5Eqw+8d5MbFXsSbxbLnIojXy1TvJYY/iIGqa7lgLzcoy9xbAZ2dZfjDjgVDVa4d+BiduZmpFJB7DIbhjDLLIrhtK8jcaxUhuKMVyfK41gGo8KdBddCdkDDMLl+DTk/z18FD6PQM2Q/cT3Bb8wI4PWXQYFtn3TRLG2rxb6xOrM37MUa7T3Nt/0egiv+x9eTXP+nOsMwZM/c96HcS+B9dR35DLQB/f3Kc8e8S/Uz88BMjn51INNH4FL71lekQV1Z+EbtgEjOSTidJTmUYRBg7/S3/nPhyUe768W7GvvoeRPCtfcgRIUgs8QSG6utzJ6Z9v5JytZhcP0tWr2Ly54tg27e7WBY5FeVM9V7CHhtPzQ7dUOu+sq7Y6K1V66uLNopyKM287zRUhGeL452fw9wFCVAa7zysyNv/E+StecAiCEBJuGS3oHsB92OcPlSEPcXh0jeTBx03eV9tU4Mg+3G4/l3iqggvJs/AFQKJzTA5lbNThWaQYhfzfoH2HO/EO4XHjo05CTIc1zmXmqawGqlCuddAoQ2J/y7kTGm8oydT/b9zrCHroTf7/wAAAABJRU5ErkJggg==)}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = undefined;
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject SSR */

var VueVideo = normalizeComponent_1({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, browser, undefined);

var index = {
  install: function install(Vue, options) {
    // Let's register our component globally
    // https://vuejs.org/v2/guide/components-registration.html
    Vue.component("vue-video", VueVideo);
  }
};

module.exports = index;
