import { h, Component } from 'preact';
import { TweenMax, TimelineMax, Power2 } from 'gsap';

import Section from 'Components/Section';
import data from './About.data';

import styles from './About.css';

class About extends Component {
  componentDidMount () {
    TweenMax.to(document.body, 0.4, { scrollTop: 0, ease: Power2.easeInOut });
  }

  componentWillUnmount () {
    this.props.appState.aboutLanding && this.props.setAppState({ aboutLanding: false });
  }

  componentWillEnter (callback) {
    const tl = new TimelineMax({ delay: 0.4, onComplete: () => { console.log("about -- enter"); callback && callback(); } });
    tl.set(this.DOM.parentNode, { height: "100vh" });
    tl.set(this.DOM, { position: "absolute" });
    tl.from(this.DOM, 0.4, { opacity: 0, y: 12, clearProps: "all" });
    tl.set(this.DOM.parentNode, { clearProps: "height" });
  }

  componentWillLeave (callback) {
    const tl = new TimelineMax({ onComplete: () => { console.log("about -- leave"); callback && callback(); } });
    tl.set(this.DOM.parentNode, { height: "100vh" });
    tl.set(this.DOM, { position: "absolute" });
    tl.to(this.DOM, 0.4, { opacity: 0, y: 12, clearProps: "all" });
  }

  setDOM = (ref) => { this.DOM = ref; };

  render () {
    const { language } = this.props.appState;

    return (
      <div className={styles.About} ref={this.setDOM}>
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
