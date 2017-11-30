import { h, Component } from 'preact';
import { TweenMax, TimelineMax } from 'gsap';
import * as PIXI from 'pixi.js';

import styles from './Canvas.css';

class Canvas extends Component {
  isDisabled = false;
  hasAudio = !!this.props.appState.audioCtx;

  componentDidMount () {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas2d = document.createElement("canvas");
    this.showingVisuals = false;

    // WebGL renderer and stage
    this.renderer = new PIXI.WebGLRenderer(this.width, this.height, {
      antialias: true,
      transparent: true,
      resolution: 1,
      view: this.props.appState.dom.canvas,
    });

    this.stage = new PIXI.Container();

    /* Composition (background to foreground):
      - Background
      - Background text
      - Visuals
      - Subtitle
      - Overlay
      - Audio visualizer
    */

    // Background
    this.background = new PIXI.Graphics();
    this.background.zIndex = 0;
    this.addToStage(this.background);

    // Background text
    this.bgTextString = "orion9";
    this.bgTextWidthRatio = 1.75;
    this.bgTextWidthBleedRatio = 0.2;
    this.bgTextStyle = new PIXI.TextStyle({
      fontFamily: 'Didot, serif',
      fontSize: 1,
      fill: 0x0F0F0F,
    });

    this.bgText = new PIXI.Text(this.bgTextString, this.bgTextStyle);
    this.bgText.alpha = 0;
    this.bgText.zIndex = 1;
    this.addToStage(this.bgText);

    this.scrollRatio = 0;
    this.currentScrollRatio = 0;

    // Visuals
    this.updateVisualsTimeout = null;
    this.visualsInfo = null;

    this.visualsTexture = null;
    this.visualsTextureSprite = null;

    // Subtitle
    this.subtitleText = null;
    this.subtitleTextStyle = new PIXI.TextStyle({
      fontFamily: 'Futura Std, sans-serif',
      fontSize: 24,
      fontWeight: 'bold',
      fill: 0xFFFFFF,
    });

    // Overlay
    this.overlay = new PIXI.Graphics();
    this.overlay.alpha = 0;
    this.overlay.zIndex = 4;
    this.addToStage(this.overlay);

    // Audio visualizer
    this.visualizer = new PIXI.Graphics();
    this.visualizer.alpha = 0.75;
    this.visualizer.zIndex = 5;
    this.addToStage(this.visualizer);

    // Noise effect
    this.noiseFilter = new PIXI.filters.NoiseFilter();
    this.noiseFilter.noise = 0.025;
    this.noiseFilter.seed = 0.1;
    TweenMax.to(this.noiseFilter, 1, { seed: 0.24, repeat: -1, yoyo: true });

    this.stage.filters = [this.noiseFilter];

    // Resize handler
    this.onResizeTimeout = null;
    this.debouncedResize = () => {
      // Debounce calls to the resize handler
      clearTimeout(this.onResizeTimeout);

      this.onResizeTimeout = setTimeout(() => {
        this.onResizeTimeout = null;
        this.onResize();
      }, this.onResizeTimeout === null ? 0 : 500);
    };

    window.addEventListener("resize", this.debouncedResize);
    this.onResize();
    this.start();
  }

  componentWillUnmount () {
    window.removeEventListener("resize", this.debouncedResize);
    this.stop();
  }

  componentWillReceiveProps (newProps) {
    if (!this.showBgText && newProps.appState.loadingAnimComplete) {
      this.showBgText = true;
      TweenMax.to(this.bgText, 0.8, { alpha: 1 });
    }

    if (newProps.scrollRatio !== this.scrollRatio) {
      this.scrollRatio = newProps.scrollRatio;
      !this.showingVisuals && this.moveText();
    }

    // Debounce calls to the update method
    clearTimeout(this.updateVisualsTimeout);

    this.updateVisualsTimeout = setTimeout(() => {
      this.updateVisualsTimeout = null;
      this.updateVisuals(newProps.visuals);
    }, this.updateVisualsTimeout === null ? 0 : 500);
  }

  updateVisuals = (visualsInfo) => {
    if (visualsInfo !== this.visualsInfo) {
      this.visualsInfo = visualsInfo;

      if (this.visualsInfo) {
        this.setVisuals();
      } else {
        this.removeVisuals();
        this.moveText();
      }
    }
  };

  setVisuals = () => {
    const prevTexture = this.visualsTexture;
    const prevSprite = this.visualsTextureSprite;
    const subtitle = this.visualsInfo.options && this.visualsInfo.options.subtitle || "";
    let switchingVisuals = false;

    if (prevTexture) {
      switchingVisuals = true;

      TweenMax.to([prevSprite, this.subtitleText], 0.2, { alpha: 0, onComplete: () => {
        if (this.subtitleText && !subtitle) {
          this.removeFromStage(this.subtitleText);
          this.subtitleText = null;
        }

        this.removeFromStage(prevSprite);
        prevTexture.baseTexture.dispose();
        prevTexture.baseTexture.destroy();
        PIXI.BaseTexture.removeFromCache(prevTexture.baseTexture);

        proceed.call(this);
      }});
    } else {
      proceed.call(this);
    }

    function proceed () {
      if (this.visualsInfo && this.visualsInfo.url) {
        this.visualsTexture = this.visualsInfo.type === "video"
          ? PIXI.Texture.fromVideo(this.visualsInfo.url)
          : PIXI.Texture.fromImage(this.visualsInfo.url);

        if (this.visualsInfo.type === "video") {
          this.visualsTexture.baseTexture.source.muted = true;
          this.visualsTexture.baseTexture.source.loop = true;
        }

        if (subtitle) {
          this.subtitleText = new PIXI.Text(subtitle, this.subtitleTextStyle);
          this.subtitleText.alpha = 0;
          this.subtitleText.zIndex = 3;
          this.addToStage(this.subtitleText);
        }

        this.visualsTexture.baseTexture.once("loaded", () => {
          // Abort if the visuals have been removed in the meantime
          if (!this.visualsTexture) {
            return;
          }

          this.resizeVisuals();
          this.addToStage(this.visualsTextureSprite);
          this.showingVisuals = true;

          const tl = new TimelineMax();
          !switchingVisuals && tl.fromTo(this.overlay, 0.2, { alpha: 0 }, { alpha: 1 });
          tl.fromTo([this.visualsTextureSprite, this.subtitleText], 0.2, { alpha: 0 }, { alpha: 1 }, switchingVisuals ? 0 : 0.1);
        });

        this.visualsTextureSprite = new PIXI.Sprite.from(this.visualsTexture);
        this.visualsTextureSprite.zIndex = 2;
      }
    }
  };

  removeVisuals = () => {
    const tl = new TimelineMax({ onComplete: () => {
      this.visualsTexture && this.disposeVisuals();
      this.showingVisuals = false;
    }});

    tl.to([this.visualsTextureSprite, this.subtitleText], 0.2, { alpha: 0 });
    tl.to(this.overlay, 0.2, { alpha: 0 }, 0.1);
  };

  disposeVisuals = () => {
    if (this.subtitleText) {
      this.removeFromStage(this.subtitleText);
      this.subtitleText = null;
    }

    this.removeFromStage(this.visualsTextureSprite);
    this.visualsTexture.baseTexture.dispose();
    this.visualsTexture.baseTexture.destroy();
    PIXI.BaseTexture.removeFromCache(this.visualsTexture.baseTexture);
    this.visualsTextureSprite = null;
    this.visualsTexture = null;
  };

  resizeVisuals = () => {
    const source = this.visualsTexture.baseTexture.source;
    const type = source.tagName.toLowerCase();
    let widthPropName;
    let heightPropName;

    switch (type) {
      case "video":
        widthPropName = "videoWidth";
        heightPropName = "videoHeight";
        break;
      case "img":
        widthPropName = "naturalWidth";
        heightPropName = "naturalHeight";
        break;
    }

    const ratioW = source[widthPropName] / this.width;
    const ratioH = source[heightPropName] / this.height;

    if (ratioW >= ratioH) {
      this.visualsTextureSprite.width = this.height * (source[widthPropName] / source[heightPropName]);
      this.visualsTextureSprite.height = this.height;
    } else {
      this.visualsTextureSprite.width = this.width;
      this.visualsTextureSprite.height = this.width * (source[heightPropName] / source[widthPropName]);
    }

    this.visualsTextureSprite.x = (this.width - this.visualsTextureSprite.width) / 2;
    this.visualsTextureSprite.y = (this.height - this.visualsTextureSprite.height) / 2;

    if (this.subtitleText) {
      const textMetrics = PIXI.TextMetrics.measureText(this.subtitleText.text, this.subtitleTextStyle);
      this.subtitleText.x = (this.width - Math.floor(textMetrics.width)) / 2;
      this.subtitleText.y = this.height - (1.5 * Math.floor(textMetrics.height));
    }
  };

  addToStage = (child) => {
    this.stage.addChild(child);
    this.stage.children.sort((a, b) => a.zIndex > b.zIndex);
  };

  removeFromStage = (child) => {
    this.stage.removeChild(child);
    this.stage.children.sort((a, b) => a.zIndex > b.zIndex);
  }

  drawBackground = () => {
    this.background.clear();
    this.background.beginFill(0x111111);
    this.background.drawRect(0, 0, this.width, this.height);
    this.background.endFill();
  }

  drawText = () => {
    this.bgTextStyle.fontSize = 1;

    const context = this.canvas2d.getContext('2d');

    context.save();
    context.font = `${this.bgTextStyle.fontSize}px 'Didot, serif'`;
    while (Math.floor(context.measureText(this.bgTextString).width) < this.width * (this.bgTextWidthRatio + this.bgTextWidthBleedRatio)) {
      context.font = `${this.bgTextStyle.fontSize++}px 'Didot, serif'`;
    }
    context.restore();

    const textMetrics = PIXI.TextMetrics.measureText(this.bgTextString, this.bgTextStyle);
    this.bgText.style = this.bgTextStyle;
    this.bgText.y = this.height - Math.floor(textMetrics.fontProperties.ascent);
  };

  moveText = () => {
    TweenMax.killTweensOf(this, { currentScrollRatio: true });
    TweenMax.killTweensOf(this.bgText.skew, { x: true });
    const direction = this.scrollRatio > this.currentScrollRatio ? -1 : 1;

    const tl = new TimelineMax();
    tl.to(this.bgText.skew, 0.4, { x: degToRad(direction * 15) }, 0);
    tl.to(this, 0.4, {
      currentScrollRatio: this.scrollRatio,
      onUpdate: () => {
        this.bgText.x = -1 * ((this.bgText.width / 2) * this.currentScrollRatio) - (this.width * this.bgTextWidthBleedRatio / 4);
      }
    }, 0);
    tl.to(this.bgText.skew, 0.4, { x: 0 }, "-=0.2");

    function degToRad (deg) { return (deg * Math.PI) / 180; }
  };

  drawOverlay = () => {
    this.overlay.clear();
    this.overlay.beginFill(0x000000, 0.85);
    this.overlay.drawRect(0, 0, this.width, this.height);
    this.overlay.endFill();
  };

  drawWaveform = (dataArray) => {
    const nbEQband = 150;
    const bandWidth = Math.ceil(this.width / nbEQband);
    const zoom = 1.5;
    const pointSize = 1;
    const top = this.height + pointSize;

    this.visualizer.clear();
    for (let i = 0; i <= nbEQband; i++) {
      // const pointNb = Math.ceil(i * (dataArray.length / nbEQband));

      this.visualizer.beginFill(0xFF0000);
      this.visualizer.drawRect(i * bandWidth - pointSize, top - (dataArray[i] * zoom), pointSize, pointSize);
      this.visualizer.endFill();

      this.visualizer.beginFill(0x00FF00);
      this.visualizer.drawRect(i * bandWidth, top - (dataArray[i] * zoom), pointSize, pointSize);
      this.visualizer.endFill();

      this.visualizer.beginFill(0x0000FF);
      this.visualizer.drawRect(i * bandWidth + pointSize, top - (dataArray[i] * zoom), pointSize, pointSize);
      this.visualizer.endFill();
    }
  };

  draw = () => {
    if (this.hasAudio) {
      const analyser = this.props.appState.audio.analyser;
      const dataArray = new Uint8Array(analyser.output.frequencyBinCount);
      analyser.output.getByteFrequencyData(dataArray);

      this.drawWaveform(dataArray);
    }

    this.renderer.render(this.stage);
    this.rAF = requestAnimationFrame(this.draw);
  };

  start = () => {
    if (!this.isDisabled) {
      this.rAF = requestAnimationFrame(this.draw);
    }
  };

  stop = () => {
    if (!this.isDisabled) {
      cancelAnimationFrame(this.rAF);
    }
  };

  onResize = () => {
    const DOM = this.props.appState.dom.canvas;

    this.width = DOM.width = window.innerWidth;
    this.height = DOM.height = window.innerHeight;
    this.renderer.resize(this.width, this.height);

    this.drawBackground();
    this.drawText();
    this.moveText();
    this.showingVisuals && this.visualsTexture && this.resizeVisuals();
    this.drawOverlay();
  };

  setDOM = (ref) => {
    this.props.setAppState({ dom: { ...this.props.appState.dom, canvas: ref } });
  };

  render () {
    return (
      <canvas className={styles.Canvas} ref={this.setDOM} />
    );
  }
}

export default Canvas;
