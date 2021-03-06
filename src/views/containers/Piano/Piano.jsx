import classnames from 'classnames';
import { h, Component } from 'preact';
import { TimelineMax } from 'gsap';
import * as Tone from 'tone';

import data from './Piano.data';
import * as _$ from 'utils';

import styles from './Piano.css';

class Piano extends Component {
  constructor (...args) {
    super(...args);

    this.layout = this.getKeyLayout(this.props.language);
    this.pointerType = this.props.appState.pointerType;

    this.keysDOM = {};
    this.keyWidth = parseFloat(styles.keyWidth);
    this.keyGap = parseFloat(styles.keyGap);
    this.keySpacing = this.keyWidth + this.keyGap;

    this.isPressing = false;
    this.pointerPressedKeys = [];

    this.isPlaying = false;

    this.synth = this.props.appState.audio.synth;
    this.midiInput = null;
  }

  componentDidMount () {
    document.querySelector("html").classList.add("scrollingLocked");
    window.addEventListener("keypress", this.onKeypress);
    window.addEventListener("keyup", this.onKeyup);

    const keyboardDOM = this.DOM.querySelector(`.${styles.keyboard}`);
    keyboardDOM.addEventListener(_$.eventsMap.down[this.pointerType], this.onPointerDown);
    window.addEventListener(_$.eventsMap.move[this.pointerType], this.onPointerMove);
    window.addEventListener(_$.eventsMap.up[this.pointerType], this.onPointerUp);

    navigator.requestMIDIAccess && navigator.requestMIDIAccess().then(this.onMIDIInit).catch(error => {
      __IS_DEV__ && console.error("MIDI initialization failed", error);
    });

    !this.props.appState.pianoLanding && this.enable();

    this.props.onMount(this.DOM, this);
  }

  componentWillUnmount () {
    document.querySelector("html").classList.remove("scrollingLocked");
    window.removeEventListener("keypress", this.onKeypress);
    window.removeEventListener("keyup", this.onKeyup);

    const keyboardDOM = this.DOM.querySelector(`.${styles.keyboard}`);
    keyboardDOM.removeEventListener(_$.eventsMap.down[this.pointerType], this.onPointerDown);
    window.removeEventListener(_$.eventsMap.move[this.pointerType], this.onPointerMove);
    window.removeEventListener(_$.eventsMap.up[this.pointerType], this.onPointerUp);

    Object.keys(this.keysDOM).forEach((keyCode) => {
      this.deactivateKey(keyCode);
    });

    if (this.midiInput && this.midiInput.value) {
      this.midiInput.value.removeEventListener('midimessage', this.onMIDIMessageEvent);
      this.midiInput.value.removeEventListener('statechange', this.onMIDIConnectionEvent);
      this.midiInput.value.close();
    }

    this.props.appState.pianoLanding && this.props.setAppState({ pianoLanding: false });

    this.synth.triggerAttackRelease("A5", "8n");
    this.props.setAppState({ isPianoPlaying: true });
    setTimeout(() => {
      this.props.setAppState({ isPianoPlaying: false });
    }, Tone.Time("8n").toSeconds() * 1000);
  }

  componentWillReceiveProps (newProps) {
    this.layout = this.getKeyLayout(newProps.language);
    this.pointerType = newProps.appState.pointerType;
    this.synth = newProps.appState.audio.synth;

    if (Tone.Master.mute && this.props.appState.pianoLanding && newProps.appState.loadingAnimComplete) {
      this.enable();
    }
  }

  componentWillEnter (callback) {
    const tl = _$.transitionIn(this.DOM, callback);
    tl.add(this.fadeInKeys(), 0);
  }

  componentWillLeave (callback) {
    _$.transitionOut(this.DOM, callback);
  }

  getKeyLayout = (language) => {
    return language === 'fr' ? 'azerty' : 'qwerty';
  };

  fadeInKeys = () => {
    const tl = new TimelineMax();
    tl.staggerFrom(this.DOM.querySelectorAll(`.${styles.key}:not(.${styles.isAccidental})`), 0.2, { opacity: 0, y: `-=${_$.transitionYDelta}`, clearProps: "opacity" }, 0.04);
    tl.staggerFrom(this.DOM.querySelectorAll(`.${styles.key}.${styles.isAccidental}`), 0.2, { opacity: 0, y: `-=${_$.transitionYDelta}`, clearProps: "opacity" }, 0.04, 0);

    return tl;
  };

  enable = () => {
    Tone.Master.mute = false;
    this.synth.triggerAttackRelease("C6", "8n", "+0.2");

    setTimeout(() => {
      this.props.setAppState({ isPianoPlaying: true });
      setTimeout(() => {
        this.props.setAppState({ isPianoPlaying: false });
      }, Tone.Time("8n").toSeconds() * 1000);
    }, 200);
  };

  setDOM = (ref) => { this.DOM = ref; };

  onKeypress = (event) => {
    if (this.keysDOM[event.code] && !this.pointerPressedKeys.includes(event.code)) {
      this.activateKey(event.code);
    }
  };

  onKeyup = (event) => {
    if (this.keysDOM[event.code] && !this.pointerPressedKeys.includes(event.code)) {
      this.deactivateKey(event.code);
    }
  };

  onPointerDown = (event) => {
    if (!this.isPressing) {
      Object.keys(this.keysDOM).forEach((keyCode) => {
        if (event.target === this.keysDOM[keyCode]) {
          this.activateKey(keyCode) && this.pointerPressedKeys.push(keyCode);
        }
      });

      this.isPressing = true;
    }
  };

  onPointerMove = (event) => {
    if (this.isPressing) {
      const target = event.type === 'touchmove' ? document.elementFromPoint(event.touches[0].pageX, event.touches[0].pageY) : event.target;
      Object.keys(this.keysDOM).forEach((keyCode) => {
        if (target === this.keysDOM[keyCode]) {
          this.activateKey(keyCode) && this.pointerPressedKeys.push(keyCode);
        } else if (this.pointerPressedKeys.includes(keyCode)) {
          this.deactivateKey(keyCode) && this.pointerPressedKeys.splice(this.pointerPressedKeys.indexOf(keyCode), 1);
        }
      });
    }
  };

  onPointerUp = () => {
    if (this.isPressing) {
      this.pointerPressedKeys.forEach((keyCode) => {
        this.deactivateKey(keyCode);
      });

      this.pointerPressedKeys.length = 0;
      this.isPressing = false;
    }
  };

  onMIDIInit = (midiAccess) => {
    const inputs = midiAccess.inputs.values();

    this.midiInput = inputs.next();
    if (this.midiInput.value) {
      this.midiInput.value.addEventListener('midimessage', this.onMIDIMessageEvent);
      this.midiInput.value.addEventListener('statechange', this.onMIDIConnectionEvent);
    }
  };

  onMIDIConnectionEvent = (event) => {
    if (event.port.state === 'connected') {
      this.props.setAppState({ midiStatus: true });
    }

    if (event.port.state === 'disconnected') {
      this.props.setAppState({ midiStatus: false, midiLastNote: null });
    }
  };

  onMIDIMessageEvent = (event) => {
    const note = Tone.Frequency(event.data[1], "midi").toNote();
    const velocity = event.data[2] / 127;
    const channel = event.data[0];
    const key = data.keys.find((key) => key.note === note);

    // If it's an attack
    if (channel !== 128) {
      this.props.setAppState({ midiLastNote: note });

      // If the note played has a corresponding key in the DOM
      if (key) {
        // Use the activateKey method to update the visuals as well
        this.activateKey(key.code, velocity);
      } else {
        // Otherwise just play the note
        this.synth.triggerAttack(note, null, velocity);
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (key) {
        this.deactivateKey(key.code);
      } else {
        this.synth.triggerRelease(note);
      }
    }
  };

  activateKey = (keyCode, velocity = 1) => {
    const key = data.keys.find((key) => key.code === keyCode);
    let stateChange = false;

    if (!key.pressed) {
      this.keysDOM[keyCode].classList.add(styles['is--active']);
      key.pressed = true;
      this.synth.triggerAttack(key.note, null, velocity);

      stateChange = true;
    }

    const isPlaying = data.keys.some((key) => key.pressed);
    if (isPlaying !== this.isPlaying) {
      this.isPlaying = isPlaying;
      this.props.setAppState({ isPianoPlaying: this.isPlaying });
    }

    return stateChange;
  };

  deactivateKey = (keyCode) => {
    const key = data.keys.find((key) => key.code === keyCode);
    let stateChange = false;

    if (key.pressed) {
      this.keysDOM[keyCode].classList.remove(styles['is--active']);
      key.pressed = false;
      this.synth.triggerRelease(key.note);

      stateChange = true;
    }

    const isPlaying = data.keys.some((key) => key.pressed);
    if (isPlaying !== this.isPlaying) {
      this.isPlaying = isPlaying;
      this.props.setAppState({ isPianoPlaying: this.isPlaying });
    }

    return stateChange;
  };

  buildKeyboard = () => {
    const whiteKeys = data.keys.filter((key) => !key.note.match(/(#|b)/)).map((key, index) => {
      return (
        <div
          className={styles.key}
          style={{ transform: `translate3d(${ index * this.keySpacing }px, 0, 0)` }}
          ref={(ref) => { this.keysDOM[key.code] = ref; }}
        >
          {data.keyLayout[key.code][this.layout]}
        </div>
      );
    });

    let prevX = -1 * this.keySpacing;
    const blackKeys = data.keys.filter((key) => !!key.note.match("#")).map((key, index) => {
      prevX += this.keySpacing;

      // Add spacing to form group of 2 and 3 keys
      if ((index % 5 === 2) || (index % 5 === 0 && index !== 0)) {
        prevX += this.keySpacing;
      }

      return (
        <div
          className={classnames(styles.key, styles.isAccidental)}
          style={{ transform: `translate3d(${ prevX + (this.keyWidth / 2) }px, -33.33%, 0)` }}
          ref={(ref) => { this.keysDOM[key.code] = ref; }}
        >
          {data.keyLayout[key.code][this.layout]}
        </div>
      );
    });

    return whiteKeys.concat(blackKeys);
  };

  parseNoteName = (note) => {
    // Get the note name using the notation system corresponding to the keyboard layout
    // (azerty => 'Do Ré Mi Fa Sol La Si' / qwerty => 'A B C D E F G')
    return data.noteNames[note.at(0)][this.layout] + note.slice(1);
  };

  render () {
    const { language, appState } = this.props;

    // Get the current layout's key map
    const keyLayout = Object.keys(data.keyLayout).reduce((acc, keyCode) => (
      { ...acc, [keyCode]: data.keyLayout[keyCode][this.layout] }
    ), {});

    return (
      <div className={styles.Piano} ref={this.setDOM}>
        <div className={styles.keyboard}>
          {this.buildKeyboard()}
        </div>
        <div className={styles.close} onClick={this.props.onClose}>
          <i className="fa fa-times-circle" aria-hidden="true" />
        </div>
        <div className={styles.hint}>
          <div className={styles.label}>
            <div className={styles.dash} /><span>Hedwig's Theme</span>
          </div>
          <div className={styles.hintContent}>
            {`${keyLayout.KeyM} ${keyLayout.KeyE}${keyLayout.KeyT}${keyLayout.Digit5}${keyLayout.KeyE}${keyLayout.KeyU} ${keyLayout.KeyY}${keyLayout.Digit5} ${keyLayout.KeyE}${keyLayout.KeyT}${keyLayout.Digit5}${keyLayout.KeyW}${keyLayout.KeyR} ${keyLayout.KeyM}`}
            <br/>
            {`${keyLayout.KeyM} ${keyLayout.KeyE}${keyLayout.KeyT}${keyLayout.Digit5}${keyLayout.KeyE}${keyLayout.KeyM} ${keyLayout.KeyW}${keyLayout.Digit2} ${keyLayout.KeyQ}${keyLayout.Digit6} ${keyLayout.KeyI}${keyLayout.KeyU}${keyLayout.Digit7} ${keyLayout.KeyJ}${keyLayout.KeyT} ${keyLayout.KeyE}`}
          </div>
        </div>
        <div className={styles.hint}>
          <div className={styles.label}>
            <div className={styles.dash} /><span>{data.translations.midi[language]}</span>
          </div>
          <div className={styles.hintContent}>
            {data.translations.status[language]}: {appState.midiStatus ? data.translations.connected[language] : data.translations.disconnected[language]}<br />
            {data.translations.note[language]}: {(appState.midiLastNote && this.parseNoteName(appState.midiLastNote)) || '—'}
          </div>
        </div>
      </div>
    );
  }
}

export default Piano;
