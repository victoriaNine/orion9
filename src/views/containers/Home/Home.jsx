import { h, Component } from 'preact';
import { TweenMax, Power2 } from 'gsap';

import Section from 'Components/Section';
import data from './Home.data';

import styles from './Home.css';

class Home extends Component {
  constructor (...args) {
    super(...args);

    if (!this.props.appState.worksLoaded) {
      this.props.setAppState({
        works: data.filter(item => item.name.match('projects|experiments')).map(section => section.items).reduce((acc, item) => [...acc, ...item], []),
        worksLoaded: true
      });
    }
  }

  componentDidMount() {
    TweenMax.to(document.body, 0.4, { scrollTop: 0, ease: Power2.easeInOut });
  }

  render () {
    const { language } = this.props.appState;

    return (
      <div className={styles.Home}>
        {data.map((section) => {
          return (
            <div className={styles.section}>
              <Section language={language} {...section} />
            </div>
          );
        })}
      </div>
    );
  }
}

export default Home;
