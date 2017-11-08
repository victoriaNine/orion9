import classnames from 'classnames';
import { h, Component } from 'preact';
import { TimelineMax } from 'gsap';

import styles from './DefaultHeadline.css';

class DefaultHeadline extends Component {
  componentDidMount () {
    this.props.onMount(this.DOM);
  }

  componentWillEnter (callback) {
    const tl = new TimelineMax({ delay: 0.2, onComplete: () => { callback(); } });
    tl.from(this.DOM, 0.2, { opacity: 0, y: -12, clearProps: "all" });
  }

  componentWillLeave (callback) {
    const tl = new TimelineMax({ onComplete: () => { callback(); } });
    tl.to(this.DOM, 0.2, { opacity: 0, y: -12, clearProps: "all" });
  }

  setDOM = (ref) => { this.DOM = ref; };

  render () {
    const { baseline1, baseline2, hasMaxWidth } = this.props;

    return (
      <div className={styles.DefaultHeadline} ref={this.setDOM}>
        <h1 className={classnames(styles.baseline1, { [styles['has--maxWidth']]: hasMaxWidth })}>{baseline1}</h1>
        <h2 className={styles.baseline2}>{baseline2}</h2>
      </div>
    );
  }
}

export default DefaultHeadline;
