import { h, Component } from 'preact';
import { TweenMax, TimelineMax, Power0, RoughEase } from 'gsap';
import * as PIXI from 'pixi.js';
import 'pixi-filters';

import logo from './assets/logo.png';
import displacementTexture from './assets/displacementTexture.png';

import styles from './Canvas.css';

class Canvas extends Component {
  constructor (...args) {
    super(...args);

    const env = this.props.appState.env;

    this.isEnabled = !env.browser.name.match(/(ie|edge)/i);
    this.hasVisuals = env.os.name.match(/ios/i) ? parseFloat(env.os.version) >= 11 : true;
    this.hasAudio = !!this.props.appState.audioCtx;
  }

  componentDidMount () {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.showingVisuals = false;

    // WebGL renderer and stage
    this.renderer = new PIXI.WebGLRenderer(this.width, this.height, {
      legacy: true,
      antialias: false,
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
    this.background = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.background.tint = 0x111111;
    this.background.zIndex = 0;
    this.addToStage(this.background);

    // Background text
    this.bgTextWidthRatio = 2;

    const logoTexture = new PIXI.Texture.fromImage(logo);
    logoTexture.baseTexture.once('loaded', () => {
      this.drawText();
    });
    this.bgText = new PIXI.Sprite(logoTexture);
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
    this.subtitleMinRatioH = 1.2;
    this.subtitleText = null;
    this.subtitleTextStyle = new PIXI.TextStyle({
      fontFamily: 'Futura Std, sans-serif',
      fontSize: 24,
      fontWeight: 'bold',
      fill: 0xFFFFFF,
    });

    // Overlay
    this.overlay = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.overlay.tint = 0x000000;
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
    this.noiseFilter.noise = 0.0275;
    this.noiseFilter.seed = 0.1;
    TweenMax.to(this.noiseFilter, 1, { seed: 0.24, repeat: -1, yoyo: true });

    this.stage.filters = [this.noiseFilter];

    // Text distortion effect
    const displacementSprite = new PIXI.Sprite.fromImage(displacementTexture);
    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    this.displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
    this.displacementFilter.scale.x = 1;

    this.displacementTl = new TimelineMax({ paused: true, repeat: -1, yoyo: true });
    this.displacementTl.to(this.displacementFilter.scale, 0.05, { x: 50 });
    this.displacementTl.to(this.displacementFilter.scale, 0.05, { x: 1 });
    this.displacementTl.to(this.displacementFilter.scale, 0.1, {
      x: 100,
      repeat: 1,
      yoyo: true,
      ease: RoughEase.ease.config({
        template: Power0.easeNone,
        strength: 1,
        points: 20,
        taper: "none",
        randomize: true,
        clamp: false
      })
    });

    this.rgbSplitFilter = new PIXI.filters.RGBSplitFilter();
    this.rgbSplitFilter.enabled = false;
    this.rgbSplitFilter.red[0] = -1;
    this.rgbSplitFilter.red[1] = 0;
    this.rgbSplitFilter.green[0] = 0;
    this.rgbSplitFilter.green[1] = 0;
    this.rgbSplitFilter.blue[0] = 1;
    this.rgbSplitFilter.blue[1] = 0;

    this.bgText.filters = [this.displacementFilter, this.rgbSplitFilter];
    this.isWavingText = false;

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
    if (this.isEnabled) {
      if (!this.showBgText && newProps.appState.loadingAnimComplete) {
        this.showBgText = true;
        TweenMax.to(this.bgText, 0.8, { alpha: 1 });
      }

      if (newProps.scrollRatio !== this.scrollRatio) {
        this.scrollRatio = newProps.scrollRatio;
        !this.showingVisuals && this.moveText();
      }

      if (newProps.isWavingText !== this.isWavingText) {
        this.isWavingText = newProps.isWavingText;
        this.waveText();
      }

      if (this.hasVisuals) {
        // Debounce calls to the update method
        clearTimeout(this.updateVisualsTimeout);

        this.updateVisualsTimeout = setTimeout(() => {
          this.updateVisualsTimeout = null;
          this.updateVisuals(newProps.visuals);
        }, this.updateVisualsTimeout === null ? 0 : 500);
      }
    }
  }

  updateVisuals = (visualsInfo) => {
    if (visualsInfo !== this.visualsInfo) {
      this.visualsInfo = visualsInfo;

      if (this.visualsInfo) {
        this.setVisuals();
      } else {
        this.moveText(true);
        this.removeVisuals();
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
        const isVideo = this.visualsInfo.type === "video";
        this.visualsTexture = isVideo
          ? PIXI.Texture.fromVideo(this.visualsInfo.url)
          : PIXI.Texture.fromImage(this.visualsInfo.url);

        const source = this.visualsTexture.baseTexture.source;

        if (isVideo) {
          source.autoplay = false;
          source.setAttribute("muted", "");
          source.setAttribute("loop", "");
          source.setAttribute("playsinline", "");
        }

        this.visualsTexture.baseTexture.once("loaded", () => {
          // Abort if the visuals have been removed in the meantime
          if (!this.visualsTexture) {
            this.removeVisuals();
            return;
          }

          this.resizeVisuals();
          this.addToStage(this.visualsTextureSprite);
          isVideo && source.play();

          const ratioH = this.visualsTextureSprite.height / this.height;
          this.subtitleText = new PIXI.Text(subtitle, this.subtitleTextStyle);
          this.subtitleText.alpha = 0;
          this.subtitleText.zIndex = 3;

          this.resizeSubtitle();
          this.addToStage(this.subtitleText);

          this.showingVisuals = true;

          const tl = new TimelineMax();
          !switchingVisuals && tl.fromTo(this.overlay, 0.2, { alpha: 0 }, { alpha: 0.85 });
          tl.fromTo([this.visualsTextureSprite, (ratioH >= this.subtitleMinRatioH) ? this.subtitleText : null], 0.2, { alpha: 0 }, { alpha: 1 }, switchingVisuals ? 0 : 0.1);
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
  };

  resizeSubtitle = (checkAlpha) => {
    const textMetrics = PIXI.TextMetrics.measureText(this.subtitleText.text, this.subtitleTextStyle);
    this.subtitleText.x = (this.width - Math.floor(textMetrics.width)) / 2;
    this.subtitleText.y = this.height - (1.5 * Math.floor(textMetrics.height));

    if (checkAlpha) {
      const ratioH = this.visualsTextureSprite && this.visualsTextureSprite.height / this.height;
      this.subtitleText.alpha = this.visualsTextureSprite && ratioH >= this.subtitleMinRatioH ? 1 : 0;
    }
  }

  addToStage = (child) => {
    this.stage.addChild(child);
    this.stage.children.sort((a, b) => a.zIndex > b.zIndex);
  };

  removeFromStage = (child) => {
    this.stage.removeChild(child);
    this.stage.children.sort((a, b) => a.zIndex > b.zIndex);
  }

  drawBackground = () => {
    this.background.cacheAsBitmap = false;
    this.background.width = this.width;
    this.background.height = this.height;
    this.background.cacheAsBitmap = true;
  }

  drawText = () => {
    const width = this.width * this.bgTextWidthRatio;
    const source = this.bgText.texture.baseTexture.source;

    this.bgText.width = width;
    this.bgText.height = width * (source.naturalHeight / source.naturalWidth);
    TweenMax.to(this.bgText, 0.2, { y: this.height - this.bgText.height });
  };

  moveText = (skipAnim) => {
    if (skipAnim) {
      this.currentScrollRatio = this.scrollRatio;
      this.bgText.x = getNewX.call(this, this.currentScrollRatio);
      return;
    }

    TweenMax.killTweensOf(this, { currentScrollRatio: true });
    TweenMax.killTweensOf(this.bgText.skew, { x: true });
    const direction = this.scrollRatio > this.currentScrollRatio ? -1 : 1;

    const tl = new TimelineMax();
    tl.to(this.bgText.skew, 0.4, { x: degToRad(direction * 15) }, 0);
    tl.to(this, 0.4, {
      currentScrollRatio: this.scrollRatio,
      onUpdate: () => {
        this.bgText.x = getNewX.call(this, this.currentScrollRatio);
      }
    }, 0);
    tl.to(this.bgText.skew, 0.4, { x: 0 }, "-=0.2");

    function degToRad (deg) { return (deg * Math.PI) / 180; }
    function getNewX (scrollRatio) {
      return -1 * ((this.bgText.width / 2) * scrollRatio);
    }
  };

  waveText = () => {
    if (this.isWavingText) {
      this.displacementTl.play();
    } else {
      this.displacementTl.stop();
      TweenMax.to(this.displacementFilter.scale, 0.1, { x: 1 });
    }

    this.rgbSplitFilter.enabled = this.isWavingText;
  };

  drawOverlay = () => {
    this.overlay.width = this.width;
    this.overlay.height = this.height;
  };

  drawWaveform = (dataArray) => {
    const nbEQband = 150;
    const bandWidth = Math.ceil(this.width / nbEQband);
    const zoom = 1.5;
    const pointSize = 1;
    const top = this.height + pointSize;

    this.visualizer.clear();
    for (let i = 0; i <= nbEQband; i++) {
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
    if (this.isEnabled) {
      this.rAF = requestAnimationFrame(this.draw);
    }
  };

  stop = () => {
    if (this.isEnabled) {
      cancelAnimationFrame(this.rAF);
    }
  };

  onResize = () => {
    const DOM = this.props.appState.dom.canvas;

    this.width = DOM.width = window.innerWidth;
    this.height = DOM.height = window.innerHeight;
    this.renderer.resize(this.width, this.height);
    this.stage.filterArea = new PIXI.Rectangle(0, 0, this.width, this.height);

    this.drawBackground();
    this.drawText();
    this.moveText();

    if (this.showingVisuals) {
      this.visualsTexture && this.resizeVisuals();
      this.subtitleText && this.resizeSubtitle(true);
    }

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
