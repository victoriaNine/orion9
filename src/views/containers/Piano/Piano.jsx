import classnames from 'classnames';
import { h, Component } from 'preact';

import data from './Piano.data';
import styles from './Piano.css';

class Piano extends Component {
  keysDOM = {};
  layout = this.props.language === 'fr' ? 'azerty' : 'qwerty';

  componentDidMount () {
    window.addEventListener("keypress", this.activateKey);
    window.addEventListener("keyup", this.deactivateKey);
    document.querySelector("html").classList.add("scrollingLocked");

    this.props.onMount(this.DOM);
  }

  componentWillUnmount () {
    window.removeEventListener("keypress", this.activateKey);
    window.removeEventListener("keyup", this.deactivateKey);
    document.querySelector("html").classList.remove("scrollingLocked");
  }

  setDOM = (ref) => { this.DOM = ref; };

  activateKey = (event) => {
    if (this.keysDOM[event.code]) {
      this.keysDOM[event.code].classList.add(styles['is--active']);
      data.keys.find((key) => key.code === event.code).pressed = true;
    }
  };

  deactivateKey = (event) => {
    if (this.keysDOM[event.code]) {
      this.keysDOM[event.code].classList.remove(styles['is--active']);
      data.keys.find((key) => key.code === event.code).pressed = false;
    }
  };

  buildKeyboard = () => {
    const keySpacing = (30 + 4);

    const whiteKeys = data.keys.filter((key) => !key.note.match("#")).map((key, index) => {
      return (
        <div
          className={styles.key}
          style={{ transform: `translate3d(${ index * keySpacing }px, 0, 0)` }}
          ref={(ref) => { this.keysDOM[key.code] = ref; }}
        >
          {data.keyLayout[key.code][this.layout]}
        </div>
      );
    });

    let prevX = -1 * keySpacing;
    const blackKeys = data.keys.filter((key) => !!key.note.match("#")).map((key, index) => {
      prevX += keySpacing;

      if ((index % 5 === 2) || (index % 5 === 0 && index !== 0)) {
        prevX += keySpacing;
      }

      return (
        <div
          className={classnames(styles.key, styles.isAccidental)}
          style={{ transform: `translate3d(${ prevX + 15 }px, -33px, 0)` }}
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
        <div className={styles.keyboardWrapper}>
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
