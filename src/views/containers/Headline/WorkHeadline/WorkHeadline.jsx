import { h, Component } from 'preact';
import { TimelineMax } from 'gsap';

import styles from './WorkHeadline.css';

class WorkHeadline extends Component {
  componentDidMount () {
    this.props.onMount(this.DOM, this);
  }

  componentWillEnter (callback) {
    this.doEnter(callback);
  }

  componentWillLeave (callback) {
    this.doLeave(callback);
  }

  doEnter = (callback) => {
    const tl = new TimelineMax({ delay: 0.2, onComplete: () => { callback && callback(); } });
    tl.from(this.DOM, 0.2, { opacity: 0, y: -12, clearProps: "all" });
  };

  doLeave = (callback) => {
    const tl = new TimelineMax({ onComplete: () => { callback && callback(); } });
    tl.to(this.DOM, 0.2, { opacity: 0, y: -12, clearProps: "all"  });
  };

  setDOM = (ref) => { this.DOM = ref; };

  render () {
    const { currentWork, translations, language } = this.props;

    return (
      <div className={styles.WorkHeadline} ref={this.setDOM}>
        <h1 className={styles.title} style={{ color: currentWork.color }}>{currentWork.title}</h1>
        <h2 className={styles.role}>
          <div className={styles.dash} />
          <span>
            {
              currentWork.details.role.map(role => translations[role][language]).join(translations.separator[language])
            }
          </span>
        </h2>
      </div>
    );
  }
}

export default WorkHeadline;
