import classnames from 'classnames';
import { h, Component } from 'preact';
import { NavLink } from 'react-router-dom';

import Title from 'Components/Title';

import styles from './Nav.css';

class Nav extends Component {
  componentDidMount() {
    let languageFromPath = this.props.location.pathname.match(/\/(fr|en|jp)/);
    languageFromPath = languageFromPath && languageFromPath[1];

    const languageFromNavigator = navigator.language.match('fr|en|ja') ? navigator.language : null;
    const language = languageFromPath || languageFromNavigator || 'en';

    this.props.onLanguageUpdate(language);
    this.props.onMount(this.DOM);
  }

  setDOM = (ref) => { this.DOM = ref; };

  render () {
    const location = this.props.location.pathname.slice(1) || 'home';

    return (
      <nav role="navigation" className={styles.Nav} ref={this.setDOM}>
        <Title>
          <div className={styles.linkWrapper}>
            <NavLink to="/home" className={classnames(styles.link, { [styles['is--active']] : location === 'about' })}>Home</NavLink>
            <NavLink to="/about" className={classnames(styles.link, { [styles['is--active']] : location === 'home' })}>About</NavLink>
          </div>
        </Title>
        <ul className={styles.langNav}>
          <li className={styles.langItem}>
            <NavLink to="/fr" className={classnames(styles.link, { [styles['is--active']] : location === 'about' })}>FR</NavLink>
          </li> |
          <li className={styles.langItem}>
            <NavLink to="/en" className={classnames(styles.link, { [styles['is--active']] : location === 'about' })}>EN</NavLink>
          </li> |
          <li className={styles.langItem}>
            <NavLink to="/jp" className={classnames(styles.link, { [styles['is--active']] : location === 'about' })}>JP</NavLink>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Nav;
