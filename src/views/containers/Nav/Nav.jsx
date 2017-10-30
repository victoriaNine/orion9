import classnames from 'classnames';
import { h, Component } from 'preact';
import { NavLink } from 'react-router-dom';

import Title from 'Components/Title';

import styles from './Nav.css';

class Nav extends Component {
  render () {
    const location = this.props.location.pathname.slice(1) || 'home';

    return (
      <nav role="navigation" className={styles.Nav}>
        <Title>
          <div className={styles.linkWrapper}>
            <NavLink to="/home" className={classnames(styles.link, { [styles['is--active']] : location === 'about' })}>Home</NavLink>
            <NavLink to="/about" className={classnames(styles.link, { [styles['is--active']] : location === 'home' })}>About</NavLink>
          </div>
        </Title>
        <ul className={styles.langNav}>
          <li className={styles.langItem} onClick={() => { this.props.languageUpdate('fr'); }}>FR</li> |
          <li className={styles.langItem} onClick={() => { this.props.languageUpdate('en'); }}>EN</li> |
          <li className={styles.langItem} onClick={() => { this.props.languageUpdate('jp'); }}>JP</li>
        </ul>
      </nav>
    );
  }
}

export default Nav;
