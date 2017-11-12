import { h, Component } from 'preact';
import { TweenMax, TimelineMax, SteppedEase } from 'gsap';

import Seriously from 'seriously';
import 'seriously/effects/seriously.noise';

import styles from './Canvas.css';

class Canvas extends Component {
  componentDidMount () {
    this.bgColor             = getComputedStyle(document.body).backgroundColor;
    this.width               = null;
    this.height              = null;

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

    this.targetNode          = this.seriously.target(this.props.appState.dom.canvas);
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

  componentWillReceiveProps (newProps) {
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

        this.visualsDOM.subtitle = this.visualsInfo.options && this.visualsInfo.options.subtitle || "";
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
      const tl = new TimelineMax();
      !this.overlayOpacity && tl.fromTo(this, 0.2, { overlayOpacity: 0 }, { overlayOpacity: 1 });
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
    const DOM = this.props.appState.dom.canvas;

    this.width = DOM.width = this.canvas2dDOM.width
      = this.reformatNode.width = this.noiseNode.width = this.targetNode.width
      = document.querySelector('html').offsetWidth;

    this.height = DOM.height = this.canvas2dDOM.height
      = this.reformatNode.height = this.noiseNode.height = this.targetNode.height
      = document.querySelector('html').offsetHeight;

    if (this.showVisuals && this.visualsDOM) {
      let type;
      switch (this.visualsDOM.localName) {
        case 'video':
          type = 'video';
          break;
        case 'img':
          type = 'image';
          break;
      }

      this.resizeVisuals(type);
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

    const ratioW = this.videoDOM[widthPropName] / this.width;
    const ratioH = this.videoDOM[heightPropName] / this.height;

    if (ratioW >= ratioH) {
      this.videoDOM.width = this.height * (this.videoDOM[widthPropName] / this.videoDOM[heightPropName]);
      this.videoDOM.height = this.height;
    } else {
      this.videoDOM.width = this.width;
      this.videoDOM.height = this.width * (this.videoDOM[heightPropName] / this.videoDOM[widthPropName]);
    }
  };

  setDOM = (ref) => {
    this.props.setAppState({ dom: { ...this.props.appState.dom, canvas: ref } });
  };

  start () {
    this.seriously.go();
    this.rAF = requestAnimationFrame(this.draw);
  }

  stop () {
    cancelAnimationFrame(this.rAF);
    this.seriously.stop();
  }

  draw = () => {
    this.ctx2d.clearRect(0, 0, this.width, this.height);

    this.ctx2d.fillStyle = this.bgColor;
    this.ctx2d.fillRect(0, 0, this.width, this.height);

    if (this.showVisuals && this.visualsDOM) {
      this.ctx2d.save();
      this.ctx2d.globalAlpha = this.visualsOpacity;
      this.ctx2d.drawImage(
        this.visualsDOM,
        (this.width - this.visualsDOM.width) / 2,
        (this.height - this.visualsDOM.height) / 2,
        this.visualsDOM.width,
        this.visualsDOM.height
      );

      const ratioW = this.videoDOM.width / this.width;
      const ratioH = this.videoDOM.height / this.height;

      if (this.visualsDOM.subtitle && ratioW < ratioH) {
        this.ctx2d.font = "600 30px 'Futura Std'";
        this.ctx2d.fillStyle = 'white';
        this.ctx2d.strokeStyle = 'black';
        this.ctx2d.lineWidth = 2;

        const txtSize = this.ctx2d.measureText(this.visualsDOM.subtitle);
        this.ctx2d.fillText(this.visualsDOM.subtitle, (this.width - txtSize.width) / 2, this.height - 30);
      }

      this.ctx2d.restore();

      this.ctx2d.fillStyle = `rgba(0, 0, 0, ${0.8 * this.overlayOpacity})`;
      this.ctx2d.fillRect(0, 0, this.width, this.height);
    }

    const analyser = this.props.appState.audio.analyser;
    const dataArray = new Uint8Array(analyser.output.frequencyBinCount);
	  analyser.output.getByteFrequencyData(dataArray);

    this.drawWaveform(dataArray);

    if (this.reformatNode.source) {
      this.reformatNode.source.update();
    }

    this.noiseNode.time = this.noiseSettings.time;
    this.rAF            = requestAnimationFrame(this.draw);
  };

  drawOscilloscope = (dataArray) => {
    const nbEQband = 175;
    const bandWidth = Math.ceil(this.width / nbEQband);
    const zoom = 1;
    const top = this.height + 1;
    const layers = [
      { color: "#00FF00", offset: 0 },
      { color: "#FF0000", offset: -1 },
      { color: "#0000FF", offset: 1 }
    ];

    for (let j = 0, jj = layers.length; j < jj; j++) {
      this.ctx2d.save();
      this.ctx2d.beginPath();

      this.ctx2d.moveTo(0, top);

      for (let i = 0; i <= nbEQband; i++) {
        // const pointNb = Math.ceil(i * (dataArray.length / nbEQband));

        this.ctx2d.fillStyle = layers[j].color;
        this.ctx2d.strokeStyle = layers[j].color;
        this.ctx2d.lineTo(i * bandWidth + layers[j].offset, top - (dataArray[i] * zoom));
      }

      this.ctx2d.lineTo(this.width, top);
      this.ctx2d.fill();
      this.ctx2d.stroke();

      this.ctx2d.closePath();
      this.ctx2d.restore();
    }
  };

  drawWaveform = (dataArray) => {
    const nbEQband = 150;
    const bandWidth = Math.ceil(this.width / nbEQband);
    const zoom = 1.5;
    const top = this.height + 1;
    const dotSize = 1;

    this.ctx2d.save();
    this.ctx2d.globalAlpha = 0.75;

    for (let i = 0; i <= nbEQband; i++) {
      // const pointNb = Math.ceil(i * (dataArray.length / nbEQband));

      this.ctx2d.fillStyle = "#00FF00";
      this.ctx2d.fillRect(i * bandWidth, top - (dataArray[i] * zoom), dotSize, dotSize);
      this.ctx2d.fillStyle = "#FF0000";
      this.ctx2d.fillRect(i * bandWidth - dotSize, top - (dataArray[i] * zoom), dotSize, dotSize);
      this.ctx2d.fillStyle = "#0000FF";
      this.ctx2d.fillRect(i * bandWidth + dotSize, top - (dataArray[i] * zoom), dotSize, dotSize);
    }

    this.ctx2d.restore();
  };

  drawDiagonalLines = (dataArray) => {
    const nbEQband = 75;
    const bandWidth = Math.round(this.width / nbEQband);

    this.ctx2d.save();
    this.ctx2d.lineWidth = 1;

    for (let i = 0; i <= nbEQband; i++) {
      this.ctx2d.moveTo(i * bandWidth + dataArray[i], dataArray[i]);
      this.ctx2d.lineTo(-dataArray[i] + 500, -i * 1 - dataArray[i] + 500);
    }

    this.ctx2d.stroke();
    this.ctx2d.restore();
  };

  drawHorizontalLines = (dataArray) => {
    const nbEQband = 100;

    this.ctx2d.save();
    this.ctx2d.lineWidth = 1;

    for (let i = 0; i <= nbEQband; i++) {
      this.ctx2d.moveTo(1e3 * dataArray[i], 2 * dataArray[i]);
      this.ctx2d.lineTo(1e3 * -dataArray[i], -1 * dataArray[i]);
    }

    this.ctx2d.stroke();
    this.ctx2d.restore();
  };

  render () {
    return (
      <canvas className={styles.Canvas} ref={this.setDOM} />
    );
  }
}

export default Canvas;
