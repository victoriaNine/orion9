import { h, Component } from 'preact';
import { TimelineMax } from 'gsap';

let Tone;

import styles from './Loading.css';

class Loading extends Component {
  constructor (...args) {
    super(...args);

    this.state = {
      message: ''
    };

    if (this.props.appState.audioCtx) {
      Tone = require('tone');
    }
  }

  setDOM = (ref) => {
    this.DOM = ref;
    this.props.setAppState({
      instances: { ...this.props.appState.instances, loading: this }
    });
  };

  play = () => {
    const { audioCtx, env, audio } = this.props.appState;

    const messages = [
      "|",
      "| |",
      "| | |",
      "| | | |",
      "| | | | |",
      "| | | | | |",
      "| | | | | | |",
      "| | | | | | | |",
      "| | | | | | | | |",
      "I X",
      "neuf",
      "I X",
      "nine",
      "I X",
      "九",
      "I X",
      "9",
      "n9",
      "on9",
      "ion9",
      "rion9",
      "orion9"
    ];

    const tl = new TimelineMax({
      onComplete: () => {
        setTimeout(() => {
          this.props.setAppState({ loadingAnimComplete: true });
        }, 100);
      }
    });

    let duration = 0.04;
    messages.forEach((message, index) => {
      if (index === 11) {
        duration = 0.06;

        tl.set(this.DOM.querySelector(`.${styles.message}`), { fontSize: "2em" });
        tl.set(this.DOM.querySelector(`.${styles.message}`), { clearProps: "fontSize" }, `+=${duration}`);
      } else if (index === 13) {
        duration = 0.08;

        tl.set(this.DOM.querySelector(`.${styles.message}`), { fontSize: "4em", className: `+=${styles.didot}` });
        tl.set(this.DOM.querySelector(`.${styles.message}`), { clearProps: "fontSize", className: `-=${styles.didot}` }, `+=${duration}`);
      } else if (index === 15) {
        duration = 0.08;

        tl.set(this.DOM.querySelector(`.${styles.message}`), { fontSize: "2em", className: `+=${styles.didot}` });
        tl.set(this.DOM.querySelector(`.${styles.message}`), { clearProps: "fontSize", className: `-=${styles.didot}` }, `+=${duration}`);
      } else {
        duration = 0.04;
      }

      tl.call(() => {
        this.setState({ message });
      }, [], null, !index ? 0 : tl.recent().endTime() + duration);
    });

    tl.addLabel("messagesDone");

    audioCtx && (!env.device.type || env.device.type === "desktop") && tl.call(() => {
      Tone.Master.mute = true;

      const sequence = new Tone.Sequence((time, note) => {
        audio.synth.triggerAttackRelease(note, "16n");
      }, [
        "C2", "D2", "E2", "F2", "G2", "A2", "B2",
        "C3", "D3", "E3", "F3", "G3", "A3", "B3",
        "C4", "D4", "E4", "F4", "G4", "A4", "B4",
        "C5", "D5", "E5", "F5", "G5", "A5", "B5"
      ], "64n").start();
      sequence.loop = false;

      Tone.Transport.start();
    }, [], null, "messagesDone");

    tl.set(this.DOM.querySelector(`.${styles.message}`), { opacity: 0 }, "messagesDone+=0.2");
    tl.set(this.DOM.querySelector(`.${styles.message}`), { opacity: 1, fontSize: "2em" }, "+=0.1");
    tl.set(this.DOM.querySelector(`.${styles.message}`), { opacity: 0 }, "+=0.1");
    tl.set(this.DOM.querySelector(`.${styles.message}`), { clearProps: "fontSize", opacity: 1, className: `+=${styles.didot}` }, "+=0.1");
    tl.set(this.DOM.querySelector(`.${styles.message}`), { className: `+=${styles.skew}` });
    tl.to(this.DOM.querySelector(`.${styles.message}`), 0.4, { opacity: 0 }, "+=0.4");

    return tl;
  };

  render () {
    return (
      <div className={styles.Loading} ref={this.setDOM}>
        <div className={styles.message}>
          {this.state.message}
        </div>
      </div>
    );
  }
}

export default Loading;
