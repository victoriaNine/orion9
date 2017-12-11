import classnames from 'classnames';
import { h, Component } from 'preact';

import * as _$ from 'utils';

import styles from './DefaultHeadline.css';

class DefaultHeadline extends Component {
  componentDidMount () {
    this.props.onMount(this.DOM);
  }

  componentWillEnter (callback) {
    _$.transitionIn(this.DOM, callback);
  }

  componentWillLeave (callback) {
    _$.transitionOut(this.DOM, callback);
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
