import { h, Component } from 'preact';
import { TweenMax, Power2 } from 'gsap';

import Section from 'Components/Section';
import data from './About.data';

import styles from './About.css';

class About extends Component {
  componentDidMount() {
    TweenMax.to(document.body, 0.4, { scrollTop: 0, ease: Power2.easeInOut });
  }

  componentWillUnmount() {
    this.props.appState.aboutLanding && this.props.setAppState({ aboutLanding: false });
  }

  render () {
    const { language } = this.props.appState;

    return (
      <div className={styles.About}>
        {data.sections.map((section) => {
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

export default About;
