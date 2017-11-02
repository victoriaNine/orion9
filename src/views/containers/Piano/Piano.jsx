import classnames from 'classnames';
import { h, Component } from 'preact';

import data from './Piano.data';
import * as _$ from 'utils';

import styles from './Piano.css';

class Piano extends Component {
  keysDOM = {};
  layout = this.props.language === 'fr' ? 'azerty' : 'qwerty';
  keyWidth = 30;
  keyGap = 4;
  keySpacing = this.keyWidth + this.keyGap;
  deviceType = this.props.appState.deviceType;

  isPressing = false;
  pointerPressedKeys = [];

  componentDidMount () {
    document.querySelector("html").classList.add("scrollingLocked");
    window.addEventListener("keypress", this.onKeypress);
    window.addEventListener("keyup", this.onKeyup);

    const keyboardDOM = this.DOM.querySelector(`.${styles.keyboard}`);
    keyboardDOM.addEventListener(_$.eventsMap.down[this.deviceType], this.onPointerDown);
    window.addEventListener(_$.eventsMap.move[this.deviceType], this.onPointerMove);
    window.addEventListener(_$.eventsMap.up[this.deviceType], this.onPointerUp);

    this.props.onMount(this.DOM);
  }

  componentWillUnmount () {
    document.querySelector("html").classList.remove("scrollingLocked");
    window.removeEventListener("keypress", this.onKeypress);
    window.removeEventListener("keyup", this.onKeyup);

    const keyboardDOM = this.DOM.querySelector(`.${styles.keyboard}`);
    keyboardDOM.removeEventListener(_$.eventsMap.down[this.deviceType], this.onPointerDown);
    window.removeEventListener(_$.eventsMap.move[this.deviceType], this.onPointerMove);
    window.removeEventListener(_$.eventsMap.up[this.deviceType], this.onPointerUp);
  }

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

  activateKey = (keyCode) => {
    const key = data.keys.find((key) => key.code === keyCode);

    if (!key.pressed) {
      this.keysDOM[keyCode].classList.add(styles['is--active']);
      key.pressed = true;

      return true;
    }

    return false;
  };

  deactivateKey = (keyCode) => {
    const key = data.keys.find((key) => key.code === keyCode);

    if (key.pressed) {
      this.keysDOM[keyCode].classList.remove(styles['is--active']);
      key.pressed = false;

      return true;
    }

    return false;
  };

  buildKeyboard = () => {
    const whiteKeys = data.keys.filter((key) => !key.note.match("#")).map((key, index) => {
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

  render () {
    const { language, appState } = this.props;

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
            a b cd e / efh d / a b cd e / efh d<br />
            a b cd e / efh d
          </div>
        </div>
        <div className={styles.hint}>
          <div className={styles.label}>
            <div className={styles.dash} /><span>{data.translations.midi[language]}</span>
          </div>
          <div className={styles.hintContent}>
            {data.translations.status[language]}: {appState.midiStatus ? data.translations.connected[language] : data.translations.disconnected[language]}<br />
            {data.translations.note[language]}: {appState.midiLastNote || '—'}
          </div>
        </div>
      </div>
    );
  }
}

export default Piano;
