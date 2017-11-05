import classnames from 'classnames';
import { h } from 'preact';

import styles from './Title.css';

const Title = ({ isActive, backgroundColor, children }) => (
  <div className={classnames(styles.Title, {
    [styles['is--active']]: isActive
  })}>
    <div className={styles.background} style={{ background: backgroundColor }} />
    <div className={styles.contents}>
      {children}
    </div>
  </div>
);

export default Title;
