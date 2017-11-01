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
    this.props.setAppState({ language: languageFromPath || languageFromNavigator || 'en' });

    this.props.onMount(this.DOM);
  }

  setDOM = (ref) => { this.DOM = ref; };

  render () {
    const locationParam = this.props.location.pathname.split('/');
    const page = locationParam[locationParam.length - 1] || 'home';
    const appState = this.props.appState;

    return (
      <div className={styles.Nav} ref={this.setDOM}>
        <nav role="navigation" className={styles.container}>
          <Title>
            <div className={styles.linkWrapper}>
              <NavLink to="/home" className={classnames(styles.link, { [styles['is--active']] : page === 'about' })}>Home</NavLink>
              <NavLink to="/about" className={classnames(styles.link, { [styles['is--active']] : page === 'home' })}>About</NavLink>
            </div>
          </Title>
          <ul className={styles.langNav}>
            <li className={styles.langItem}>
              <a href={`/fr/${page}`} className={classnames(styles.langLink, { [styles['is--active']] : appState.language === 'fr' })}>FR</a>
            </li>
            <li className={styles.langItem}>
              <a href={`/en/${page}`} className={classnames(styles.langLink, { [styles['is--active']] : appState.language === 'en' })}>EN</a>
            </li>
            <li className={styles.langItem}>
              <a href={`/jp/${page}`} className={classnames(styles.langLink, { [styles['is--active']] : appState.language === 'jp' })}>JP</a>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default Nav;
