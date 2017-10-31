import classnames from 'classnames';
import { h, Component } from 'preact';

import styles from './Title.css';

class Title extends Component {
  render () {
    return (
      <div className={classnames(styles.Title, {
        [styles['is--active']]: this.props.isActive
      })}>
        <div className={styles.background} style={{ background: this.props.backgroundColor }} />
        <div className={styles.contents}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Title;
