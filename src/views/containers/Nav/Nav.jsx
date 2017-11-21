import classnames from 'classnames';
import { h, Component } from 'preact';
import { NavLink } from 'react-router-dom';

import Title from 'Components/Title';
import data from './Nav.data';
import * as _$ from 'utils';

import styles from './Nav.css';

class Nav extends Component {
  languageList = _$.getAppLanguageList();

  setDOM = (ref) => {
    this.props.setAppState({ dom: { ...this.props.appState.dom, nav: ref } });
  };

  clickOnActiveLink = (event) => {
    event.preventDefault();

    let clickedElement = event.target;
    while (clickedElement && !clickedElement.classList.contains(styles.linkWrapper)) {
      clickedElement = clickedElement.parentNode;
    }

    const activeLink = Array.from(clickedElement.querySelectorAll(`.${styles.link}`)).find((link) => !link.classList.contains(styles['is--inactive']));
    activeLink.click();
  };

  render () {
    const locationWithoutLang = _$.getLocationWithoutLang(this.props.location.pathname);
    const page = _$.getPageName(this.props.location.pathname) || 'home';
    const { language, aboutLanding } = this.props.appState;

    return (
      <div className={styles.Nav} ref={this.setDOM}>
        <nav role="navigation" className={styles.container}>
          <div className={classnames(styles.linkWrapper, { [styles['is--inactive']]: page !== 'work' })} onClick={this.clickOnActiveLink}>
            <Title>
              <div className={styles.linkContainer}>
                <NavLink to="/home" className={styles.link}>{data.translations.home[language]}</NavLink>
              </div>
            </Title>
          </div>
          <div className={styles.linkWrapper} onClick={this.clickOnActiveLink}>
            <Title>
              <div className={styles.linkContainer}>
                {
                  !aboutLanding && <div
                    onClick={this.props.history.goBack}
                    className={classnames(styles.link, { [styles['is--inactive']]: page !== 'about' })}
                  >
                    {data.translations.back[language]}
                  </div>
                }
                {
                  aboutLanding && <NavLink to="/home" className={classnames(styles.link, { [styles['is--inactive']]: page !== 'about' })}>
                    {data.translations.home[language]}
                  </NavLink>
                }
                <NavLink to="/about" className={classnames(styles.link, { [styles['is--inactive']]: page === 'about' })}>
                  {data.translations.about[language]}
                </NavLink>
              </div>
            </Title>
          </div>
          <ul className={styles.langNav}>
            {
              this.languageList.map((languageCode) => (
                <li className={styles.langItem}>
                  <a href={`/${languageCode}${locationWithoutLang}`} className={classnames(styles.langLink, { [styles['is--active']] : language === languageCode })}>{languageCode.toUpperCase()}</a>
                </li>
              ))
            }
          </ul>
        </nav>
      </div>
    );
  }
}

export default Nav;
