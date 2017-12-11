import { h, Component } from 'preact';

import * as _$ from 'utils';

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
    _$.transitionIn(this.DOM, callback);
  };

  doLeave = (callback) => {
    _$.transitionOut(this.DOM, callback);
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
