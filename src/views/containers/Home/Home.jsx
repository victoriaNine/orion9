import { h, Component } from 'preact';
import { TweenMax, TimelineMax, Power2 } from 'gsap';

import Section from 'Components/Section';
import data from './Home.data';

import styles from './Home.css';

class Home extends Component {
  componentDidMount () {
    TweenMax.to(document.body, 0.4, { scrollTop: 0, ease: Power2.easeInOut });
  }

  componentWillUnmount () {
    this.props.appState.homeLanding && this.props.setAppState({ homeLanding: false });
  }

  componentWillEnter (callback) {
    const tl = new TimelineMax({ delay: 0.4, onComplete: () => { console.log("home -- enter"); callback && callback(); } });
    tl.set(this.DOM.parentNode, { height: "100vh" });
    tl.set(this.DOM, { position: "absolute" });
    tl.from(this.DOM, 0.4, { opacity: 0, y: 12, clearProps: "all" });
    tl.set(this.DOM.parentNode, { clearProps: "height" });
  }

  componentWillLeave (callback) {
    const tl = new TimelineMax({ onComplete: () => { console.log("home -- leave"); callback && callback(); } });
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
              <Section language={language} {...section} />
            </div>
          );
        })}
      </div>
    );
  }
}

export default Home;
