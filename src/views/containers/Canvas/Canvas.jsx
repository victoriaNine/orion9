import { h, Component } from 'preact';
import { TweenMax, SteppedEase } from 'gsap';

import Seriously from 'seriously';
import 'seriously/effects/seriously.noise';

import styles from './Canvas.css';

function createCanvas (width, height) {
  const canvas  = document.createElement("canvas");
  canvas.width  = width;
  canvas.height = height;
  return canvas;
}

class Canvas extends Component {
  componentDidMount() {
    window.addEventListener("resize", this.onResize);

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

    this.canvas2d = createCanvas();
    this.ctx2d = this.canvas2d.getContext("2d");

    this.onResize();
    this.start();
  }

  onResize = () => {
    this.DOM.width = this.canvas2d.width = this.reformatNode.width = this.noiseNode.width = this.targetNode.width = document.querySelector('html').offsetWidth;
    this.DOM.height = this.canvas2d.height = this.reformatNode.height = this.noiseNode.height = this.targetNode.height = document.querySelector('html').offsetHeight;

    if (this.reformatNode.source) { this.reformatNode.source.destroy(); }
    this.reformatNode.source = this.seriously.source(this.canvas2d);
  };

  setDOM = (ref) => {
    this.DOM = ref;
  };

  start () {
    this.seriously.go();
    this.rAF = requestAnimationFrame(this.draw);
  }

  draw = () => {
    this.ctx2d.clearRect(0, 0, this.DOM.width, this.DOM.height);
    this.ctx2d.fillStyle = this.bgColor;
    this.ctx2d.fillRect(0, 0, this.DOM.width, this.DOM.height);

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
