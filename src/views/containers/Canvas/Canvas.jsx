import { h, Component } from 'preact';
import { TweenMax, TimelineMax, SteppedEase } from 'gsap';

import Seriously from 'seriously';
import 'seriously/effects/seriously.noise';

import styles from './Canvas.css';

class Canvas extends Component {
  componentDidMount () {
    this.bgColor             = getComputedStyle(document.body).backgroundColor;
    this.seriously           = new Seriously();
    this.reformatNode        = this.seriously.transform("reformat");
    this.reformatNode.mode   = "none";

    this.noiseSettings       = { time: 1 };
    this.noiseSettings.tween = TweenMax.to(this.noiseSettings, 1, { time: 0.9, repeat: -1, yoyo: true, ease: SteppedEase.config(15) });

    this.noiseNode           = this.seriously.effect("noise");
    this.noiseNode.overlay   = false;
    this.noiseNode.amount    = 0.04;
    this.noiseNode.time      = this.noiseSettings.time;
    this.noiseNode.source    = this.reformatNode;

    this.targetNode          = this.seriously.target(this.DOM);
    this.targetNode.source   = this.noiseNode;

    this.canvas2dDOM = document.createElement("canvas");
    this.ctx2d = this.canvas2dDOM.getContext("2d");

    this.videoDOM = document.createElement("video");
    this.videoDOM.loop = true;
    this.videoDOM.muted = true;

    this.imageDOM = document.createElement("img");

    this.updateVisualsTimeout = null;
    this.visualsInfo = null;
    this.visualsDOM = null;
    this.visualsOpacity = 0;
    this.overlayOpacity = 0;

    window.addEventListener("resize", this.onResize);
    this.onResize();
    this.start();
  }

  componentWillUnmount () {
    window.removeEventListener("resize", this.onResize);
    this.stop();
  }

  componentWillUpdate (newProps) {
    // Debounce calls to the update method
    clearTimeout(this.updateVisualsTimeout);

    this.updateVisualsTimeout = setTimeout(() => {
      this.updateVisualsTimeout = null;
      this.updateVisuals(newProps.visuals);
    }, 500);
  }

  updateVisuals = (visualsInfo) => {
    if (visualsInfo !== this.visualsInfo) {
      this.visualsInfo = visualsInfo;

      if (this.visualsInfo) {
        this.setVisuals();
      } else {
        this.removeVisuals();
      }
    }
  };

  setVisuals () {
    const prevVisuals = this.visualsDOM;
    let eventName;

    if (prevVisuals) {
      this.switchingVisuals = true;
      TweenMax.to(this, 0.2, { visualsOpacity: 0, onComplete: () => {
        proceed.call(this);
      }});
    } else {
      proceed.call(this);
    }

    function proceed () {
      if (this.visualsInfo.url) {
        switch (this.visualsInfo.type) {
          case "video":
            this.visualsDOM = this.videoDOM;
            eventName = "canplaythrough";
            break;
          case "image":
            this.visualsDOM = this.imageDOM;
            eventName = "load";
            break;
        }

        this.visualsDOM.addEventListener(eventName, function handler (event) {
          event.target.removeEventListener(eventName, handler);

          if (this.visualsDOM && this.visualsInfo) {
            this.resizeVisuals(this.visualsInfo.type);
            this.showVisuals = true;

            if (this.visualsInfo.type === "video") {
              this.visualsDOM.play().then(() => {
                fadeIn.call(this);
              });
            } else {
              fadeIn.call(this);
            }
          }
        }.bind(this));

        this.visualsDOM.src = this.visualsInfo.url;
      }
    }

    function fadeIn () {
      const tl = new TimelineMax({ onComplete: () => {
        if (prevVisuals) {
          this.switchingVisuals = false;
        }
      }});

      !this.switchingVisuals && tl.fromTo(this, 0.2, { overlayOpacity: 0 }, { overlayOpacity: 1 });
      tl.fromTo(this, 0.2, { visualsOpacity: 0 }, { visualsOpacity: 1 }, this.switchingVisuals ? 0 : 0.1);
    }
  }

  removeVisuals () {
    const tl = new TimelineMax({ onComplete: () => {
      this.showVisuals = false;
      this.visualsDOM = null;
    }});
    tl.to(this, 0.2, { visualsOpacity: 0 });
    tl.to(this, 0.2, { overlayOpacity: 0 }, 0.1);
  }

  onResize = () => {
    this.DOM.width = this.canvas2dDOM.width
      = this.reformatNode.width = this.noiseNode.width = this.targetNode.width
      = document.querySelector('html').offsetWidth;

    this.DOM.height = this.canvas2dDOM.height
      = this.reformatNode.height = this.noiseNode.height = this.targetNode.height
      = document.querySelector('html').offsetHeight;

    if (this.showVisuals && this.visualsDOM) {
      this.resizeVisuals(this.visualsInfo.type);
    }

    if (this.reformatNode.source) { this.reformatNode.source.destroy(); }
    this.reformatNode.source = this.seriously.source(this.canvas2dDOM);
  };

  resizeVisuals = (visualType) => {
    let widthPropName;
    let heightPropName;

    switch (visualType) {
      case "video":
        widthPropName = "videoWidth";
        heightPropName = "videoHeight";
        break;
      case "image":
        widthPropName = "naturalWidth";
        heightPropName = "naturalHeight";
        break;
    }

    const ratioW = this.videoDOM[widthPropName] / this.DOM.width;
    const ratioH = this.videoDOM[heightPropName] / this.DOM.height;

    if (ratioW >= ratioH) {
      this.videoDOM.width = this.DOM.height * (this.videoDOM[widthPropName] / this.videoDOM[heightPropName]);
      this.videoDOM.height = this.DOM.height;
    } else {
      this.videoDOM.width = this.DOM.width;
      this.videoDOM.height = this.DOM.width * (this.videoDOM[heightPropName] / this.videoDOM[widthPropName]);
    }
  };

  setDOM = (ref) => { this.DOM = ref; };

  start () {
    this.seriously.go();
    this.rAF = requestAnimationFrame(this.draw);
  }

  stop () {
    cancelAnimationFrame(this.rAF);
    this.seriously.stop();
  }

  draw = () => {
    this.ctx2d.clearRect(0, 0, this.DOM.width, this.DOM.height);

    this.ctx2d.fillStyle = this.bgColor;
    this.ctx2d.fillRect(0, 0, this.DOM.width, this.DOM.height);

    if (this.showVisuals && this.visualsDOM) {
      this.ctx2d.save();
      this.ctx2d.globalAlpha = this.visualsOpacity;
      this.ctx2d.drawImage(
        this.visualsDOM,
        (this.DOM.width - this.visualsDOM.width) / 2,
        (this.DOM.height - this.visualsDOM.height) / 2,
        this.visualsDOM.width,
        this.visualsDOM.height
      );
      this.ctx2d.restore();

      this.ctx2d.fillStyle = `rgba(0, 0, 0, ${0.9 * this.overlayOpacity})`;
      this.ctx2d.fillRect(0, 0, this.DOM.width, this.DOM.height);
    }

    if (this.reformatNode.source) {
      this.reformatNode.source.update();
    }

    this.noiseNode.time = this.noiseSettings.time;
    this.rAF            = requestAnimationFrame(this.draw);
  };

  render () {
    return (
      <canvas className={styles.Canvas} ref={this.setDOM} />
    );
  }
}

export default Canvas;
