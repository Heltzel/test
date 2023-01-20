"use strict";

function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
class LightBoxVideo {
  constructor() {
    _defineProperty(this, "lightBoxVideo", () => {
      this.setEvents();
      this.setMutationObserver();
    });
    _defineProperty(this, "setMutationObserver", () => {
      const observer = new MutationObserver((mutation) => {
        const imageMutations = mutation.filter((m) => {
          return m.attributeName === "src" && m.target.className === "lb-image";
        });
        const overlayDisplay = window.getComputedStyle(
          document.querySelector(".lightboxOverlay"),
          null
        ).display;
        if ("none" === overlayDisplay) {
          this.removeVideoElement();
        }
        if (imageMutations.length > 0) {
          if (this.videos[imageMutations[0].target.src]) {
            this.removeVideoElement();
            this.setVideoElement(this.videos[imageMutations[0].target.src]);
          }
        }
      });
      observer.observe(document.body, {
        childList: false,
        attributes: true,
        subtree: true,
        characterData: false,
      });
    });
    _defineProperty(this, "setEvents", () => {
      const videoLinks = this.findVideoLinks();
      videoLinks.forEach((link) => {
        this.videos[link.href] = link;
        link.addEventListener("click", (e) => {
          this.removeVideoElement();
          this.setVideoElement(e.target);
        });
      });
    });
    _defineProperty(this, "setVideoElement", (element) => {
      const lightbox = document.querySelector(".lightbox");
      const container = lightbox.querySelector(".lb-container");
      const videoElement = this.createVideoElement(element);
      container.prepend(videoElement);
    });
    _defineProperty(this, "removeVideoElement", () => {
      const lightbox = document.querySelector(".lightbox");
      const container = lightbox.querySelector(".lb-container");
      const video = container.querySelector("video");
      if (video) {
        container.removeChild(video);
      }
    });
    _defineProperty(this, "createVideoElement", (element) => {
      const video = document.createElement("video");
      video.setAttribute("poster", element.href);
      video.setAttribute("controls", "true");
      const source = document.createElement("source");
      source.setAttribute("src", element.dataset.href);
      source.setAttribute("type", "video/mp4");
      video.append(source);
      return video;
    });
    _defineProperty(this, "findVideoLinks", () => {
      const hrefs = document.querySelectorAll("a[data-lightbox]");
      const regex = /\.(mp4|mov|flv|wmv)$/;
      if (0 === hrefs.length) {
        return [];
      }
      return Array.from(hrefs).filter((href) => {
        return !!href.dataset.href.match(regex);
      });
    });
    this.videos = {};
    this.lightBoxVideo();
  }
}
window.addEventListener("DOMContentLoaded", () => {
  new LightBoxVideo();
});
