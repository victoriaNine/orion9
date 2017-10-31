import { h, Component } from 'preact';
import { TweenMax, Power2 } from 'gsap';

import Section from 'Components/Section';
import data from './Home.data';

import styles from './Home.css';

class Home extends Component {
  componentDidMount() {
    TweenMax.to(document.body, 0.4, { scrollTop: 0, ease: Power2.easeInOut });
  }

  render () {
    return (
      <div className={styles.Home}>
        {data.map((section) => {
          return (
            <div className={styles.section}>
              <Section {...section} />
            </div>
          );
        })}
      </div>
    );
  }
}

export default Home;
