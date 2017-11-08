import { h, Component } from 'preact';
import { TweenMax, TimelineMax, Power2 } from 'gsap';

import Section from 'Containers/Section';
import data from './Home.data';

import styles from './Home.css';

class Home extends Component {
  constructor (...args) {
    super(...args);

    const hash = window.location.hash.slice(1);
    this.props.setAppState({ headlineMode: hash === 'play' ? 'piano' : 'home' });
  }

  componentDidMount () {
    TweenMax.to(document.body, 0.4, { scrollTop: 0, ease: Power2.easeInOut });
  }

  componentWillEnter (callback) {
    const tl = new TimelineMax({ delay: 0.4, onComplete: () => { callback && callback(); } });
    tl.set(this.DOM.parentNode, { height: "100vh" });
    tl.set(this.DOM, { position: "absolute" });
    tl.from(this.DOM, 0.4, { opacity: 0, y: 12, clearProps: "all" });
    tl.set(this.DOM.parentNode, { clearProps: "height" });
  }

  componentWillLeave (callback) {
    const tl = new TimelineMax({ onComplete: () => { callback && callback(); } });
    tl.set(this.DOM.parentNode, { height: "100vh" });
    tl.set(this.DOM, { position: "absolute" });
    tl.to(this.DOM, 0.4, { opacity: 0, y: 12, clearProps: "all" });
  }

  setDOM = (ref) => { this.DOM = ref; };

  render () {
    const { language } = this.props.appState;

    return (
      <div className={styles.Home} ref={this.setDOM}>
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

export default Home;
