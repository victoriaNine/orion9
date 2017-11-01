import { h, Component } from 'preact';
import { TweenMax, Power2 } from 'gsap';

import Section from 'Components/Section';
import * as _$ from 'utils';

import styles from './Work.css';

class Work extends Component {
  componentDidMount () {
    TweenMax.to(document.body, 0.4, { scrollTop: 0, ease: Power2.easeInOut });

    this.props.setAppState({
      headlineMode: 'work',
      currentWork: this.props.appState.works.find(item => item.id === _$.getWorkIdFromPath(this.props.location.pathname))
    });

    this.historyRemoveListener = this.props.history.listen((location) => {
      if (_$.getPageName(location.pathname) !== 'work') {
        this.props.setAppState({ headlineMode: 'default', currentWork: null });
      }
    });
  }

  componentWillUnmount () {
    this.historyRemoveListener();
  }

  render () {
    const { language } = this.props.appState;

    return (
      <div className={styles.Work}>

      </div>
    );
  }
}

export default Work;
