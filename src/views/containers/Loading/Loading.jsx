import { h, Component } from 'preact';
import { TimelineMax } from 'gsap';
import * as Tone from 'tone';

import styles from './Loading.css';

class Loading extends Component {
  state = {
    message: ''
  };

  setDOM = (ref) => {
    this.props.setAppState({
      dom: { ...this.props.appState.dom, loading: ref },
      instances: { ...this.props.appState.instances, loading: this }
    });
  };

  play = () => {
    const DOM = this.props.appState.dom.loading;
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
      "9",
      "n9",
      "on9",
      "ion9",
      "rion9",
      "orion9"
    ];

    const tl = new TimelineMax({ onComplete: () => { this.props.setAppState({ loadingAnimComplete: true }); } });
    let duration = 0.04;
    messages.forEach((message, index) => {
      if (index === 11) {
        duration = 0.06;
        tl.set(DOM.querySelector(`.${styles.message}`), { fontSize: "2em" });
        tl.set(DOM.querySelector(`.${styles.message}`), { clearProps: "fontSize" }, `+=${duration}`);
      } else if (index === 13) {
        duration = 0.08;
        tl.set(DOM.querySelector(`.${styles.message}`), { fontSize: "4em", className: `+=${styles.didot}` });
        tl.set(DOM.querySelector(`.${styles.message}`), { clearProps: "fontSize", className: `-=${styles.didot}` }, `+=${duration}`);
      } else if (index === 15) {
        duration = 0.08;
        tl.set(DOM.querySelector(`.${styles.message}`), { fontSize: "2em", className: `+=${styles.didot}` });
        tl.set(DOM.querySelector(`.${styles.message}`), { clearProps: "fontSize", className: `-=${styles.didot}` }, `+=${duration}`);
      } else {
        duration = 0.04;
      }

      tl.call(() => {
        this.setState({ message });
      }, [], null, !index ? 0 : tl.recent().endTime() + duration);

      if (index === messages.length - 1) {
        tl.addLabel("messagesDone");
      }
    });

    tl.call(() => {
      Tone.Master.mute = true;

      const sequence = new Tone.Sequence((time, note) => {
        this.props.appState.audio.synth.triggerAttackRelease(note, "16n");
      }, [
        "C2", "D2", "E2", "F2", "G2", "A2", "B2",
        "C3", "D3", "E3", "F3", "G3", "A3", "B3",
        "C4", "D4", "E4", "F4", "G4", "A4", "B4",
        "C5", "D5", "E5", "F5", "G5", "A5", "B5"
      ], "64n").start();
      sequence.loop = false;

      // eslint-disable-next-line no-unused-vars
      const unMute = new Tone.Event(() => {
        Tone.Master.mute = false;
      }).start("10 * 16n");

      Tone.Transport.start();
    }, [], null, "messagesDone");

    tl.set(DOM.querySelector(`.${styles.message}`), { opacity: 0 }, "messagesDone+=0.2");
    tl.set(DOM.querySelector(`.${styles.message}`), { opacity: 1, fontSize: "2em" }, "+=0.1");
    tl.set(DOM.querySelector(`.${styles.message}`), { opacity: 0 }, "+=0.1");
    tl.set(DOM.querySelector(`.${styles.message}`), { clearProps: "fontSize", opacity: 1, className: `+=${styles.didot}` }, "+=0.1");
    tl.set(DOM.querySelector(`.${styles.message}`), { className: `+=${styles.skew}` });
    tl.to(DOM.querySelector(`.${styles.message}`), 0.4, { opacity: 0 }, "+=0.4");

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
