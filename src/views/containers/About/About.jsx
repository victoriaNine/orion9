import { h, Component } from 'preact';
import { TweenMax, TimelineMax, Power2 } from 'gsap';

import Section from 'Containers/Section';
import data from './About.data';
import * as _$ from 'utils';

import styles from './About.css';

class About extends Component {
  constructor (...args) {
    super(...args);

    this.props.setAppState({ headlineMode: 'about' });
  }

  componentDidMount () {
    TweenMax.to(this.props.appState.getScrollingElement(), 0.4, { scrollTop: 0, ease: Power2.easeInOut });
  }

  componentWillUnmount () {
    this.props.appState.aboutLanding && this.props.setAppState({ aboutLanding: false });
  }

  componentWillEnter (callback) {
    const tl = new TimelineMax({ delay: 0.4, onComplete: () => { callback && callback(); } });
    tl.set(this.DOM.parentNode, { height: "100vh" });
    tl.set(this.DOM, { position: "absolute" });
    tl.from(this.DOM, 0.4, { opacity: 0, y: _$.transitionYDelta, clearProps: "all" });
    tl.set(this.DOM.parentNode, { clearProps: "height" });
  }

  componentWillLeave (callback) {
    const tl = new TimelineMax({ onComplete: () => { callback && callback(); } });
    tl.set(this.DOM.parentNode, { height: "100vh" });
    tl.set(this.DOM, { position: "absolute" });
    tl.to(this.DOM, 0.4, { opacity: 0, y: _$.transitionYDelta, clearProps: "all" });
  }

  setDOM = (ref) => { this.DOM = ref; };

  render () {
    const { language } = this.props.appState;

    return (
      <div className={styles.About} ref={this.setDOM}>
        {data.sections.map((section) => {
          return (
            <div className={styles.section}>
              <Section language={language} appState={this.props.appState} setAppState={this.props.setAppState} {...section} />
            </div>
          );
        })}
      </div>
    );
  }
}

export default About;
