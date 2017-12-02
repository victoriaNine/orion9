import { h, Component } from 'preact';
import mojs from 'mo-js';

import styles from './Note.css';

class Note extends Component {
  componentDidMount () {
    this.burst = new mojs.Burst({
      parent: this.DOM,
      radius: { 10: 12 },
      count: 6,
      children: {
        shape: 'line',
        fill : 'white',
        radius: { 4: 0 },
        scale: 1,
        stroke: 'currentColor',
        strokeWidth: 1,
        duration: 1500,
        easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
        opacity: 0.5
      },
      onComplete: () => {
        setTimeout(() => {
          this.burst.replay();
        }, 500);
      }
    });

    this.burst.play();
    this.props.onMount(this.DOM);
  }

  componentWillUnmount () {
    this.burst.stop();
  }

  setDOM = (ref) => {
    this.DOM = ref;
  };

  render () {
    return (
      <div className={styles.Note} ref={this.setDOM} onClick={this.props.onClick}>
        <i className="fa fa-music" aria-hidden="true" />
      </div>
    );
  }
}

export default Note;
