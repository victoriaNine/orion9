import { h, Component } from 'preact';
import { TweenMax, Power2 } from 'gsap';

import Section from 'Components/Section';
import data from './Work.data';
import * as _$ from 'utils';

import styles from './Work.css';

class Work extends Component {
  constructor (...args) {
    super(...args);

    this.props.setAppState({
      headlineMode: 'work',
      currentWork: this.getCurrentWorkFromPath(this.props.location.pathname)
    });
  }

  componentDidMount () {
    TweenMax.to(document.body, 0.4, { scrollTop: 0, ease: Power2.easeInOut });

    this.historyRemoveListener = this.props.history.listen((location) => {
      if (_$.getPageName(location.pathname) !== 'work') {
        this.props.setAppState({ headlineMode: 'default', currentWork: null });
      } else {
        this.props.setAppState({
          currentWork: this.getCurrentWorkFromPath(location.pathname)
        });
      }
    });
  }

  componentWillUnmount () {
    this.historyRemoveListener();
  }

  getCurrentWorkFromPath = (path) => {
    return this.props.appState.works.find(item => item.id === _$.getWorkIdFromPath(path));
  };

  render () {
    const { language, currentWork, works } = this.props.appState;

    const linkItems = [
      {
        title: data.translations.visit[language],
        url: currentWork.url
      }
    ].concat(currentWork.details.github ? [
      {
        title: data.translations.github[language],
        url: currentWork.details.github
      }
    ] : []);

    const currentWorkId = works.findIndex((item) => item.id === currentWork.id);
    const prevWork = currentWorkId - 1 < 0 ? works[works.length - 1] : works[currentWorkId - 1];
    const nextWork = currentWorkId + 1 >= works.length ? works[0] : works[currentWorkId + 1];

    const navItems = [
      {
        title: `${data.translations.next[language]}: ${nextWork.title}`,
        url: `/work/${nextWork.id}`,
        color: nextWork.color,
        internalLink: true
      },
      {
        title: `${data.translations.previous[language]}: ${prevWork.title}`,
        url: `/work/${prevWork.id}`,
        color: prevWork.color,
        internalLink: true
      },
    ];

    return (
      <div className={styles.Work}>
        <div className={styles.section}>
          <Section language={language} title={data.translations.links} items={linkItems} />
        </div>
        {
          currentWork.details.about[language] && <div className={styles.section}>
            <Section language={language} title={data.translations.about} text={currentWork.details.about} />
          </div>
        }
        {
          currentWork.details.client && <div className={styles.section}>
            <Section language={language} title={data.translations.client} text={currentWork.details.client} />
          </div>
        }
        <div className={styles.section}>
          <Section language={language} title={data.translations.stack} text={currentWork.details.stack.join(', ')} />
        </div>
        {
          currentWork.details.awards && <div className={styles.section}>
            <Section language={language} title={data.translations.awards} items={currentWork.details.awards} />
          </div>
        }
        <div className={styles.section}>
          <Section language={language} title={data.translations.more} items={navItems} />
        </div>
      </div>
    );
  }
}

export default Work;
