import { h, Component } from 'preact';
import { TweenMax, TimelineMax, Power2 } from 'gsap';

import Section from 'Containers/Section';
import data from './Work.data';
import * as _$ from 'utils';

import styles from './Work.css';

class Work extends Component {
  constructor (...args) {
    super(...args);

    const currentWork = this.getCurrentWorkFromPath(this.props.location.pathname);

    this.props.setAppState({
      headlineMode: 'work',
      currentWork,
      ...!this.props.appState.workLanding && { visuals: currentWork.visuals }
    });
  }

  componentDidMount () {
    TweenMax.to(this.props.appState.getScrollingElement(), 0.4, { scrollTop: 0, ease: Power2.easeInOut });

    this.historyRemoveListener = this.props.history.listen((location) => {
      if (_$.getPageName(location.pathname) === 'work') {
        const currentWork = this.getCurrentWorkFromPath(location.pathname);

        this.props.appState.instances.workHeadline.doLeave(() => {
          this.props.appState.instances.workHeadline.doEnter(() => {
            // Update the headline's height for the new content
            this.props.appState.instances.headline.onResize();
          });
        });

        this.doLeave(() => {
          this.props.setAppState({
            currentWork,
            visuals: currentWork.visuals
          });

          TweenMax.to(this.props.appState.getScrollingElement(), 0.4, { scrollTop: 0, ease: Power2.easeInOut });
          this.doEnter();
        });
      }
    });
  }

  componentWillUnmount () {
    this.props.setAppState({
      currentWork: null,
      visuals: null,
      ...this.props.appState.workLanding && { workLanding: false }
    });
    this.historyRemoveListener();
  }

  componentWillEnter (callback) {
    this.doEnter(callback);
  }

  componentWillLeave (callback) {
    this.doLeave(callback);
  }

  componentWillReceiveProps (newProps) {
    if (!newProps.appState.visuals && newProps.appState.workLanding && newProps.appState.loadingAnimComplete) {
      this.props.setAppState({
        visuals: newProps.appState.currentWork.visuals
      });
    }
  }

  doEnter = (callback) => {
    const tl = new TimelineMax({ delay: 0.4, onComplete: () => { callback && callback(); } });
    tl.set(this.DOM.parentNode, { height: "100vh" });
    tl.set(this.DOM, { position: "absolute" });
    tl.from(this.DOM, 0.4, { opacity: 0, y: _$.transitionYDelta, clearProps: "all" });
    tl.set(this.DOM.parentNode, { clearProps: "height" });
  };

  doLeave = (callback) => {
    const tl = new TimelineMax({ onComplete: () => { callback && callback(); } });
    tl.set(this.DOM.parentNode, { height: "100vh" });
    tl.set(this.DOM, { position: "absolute" });
    tl.to(this.DOM, 0.4, { opacity: 0, y: _$.transitionYDelta, clearProps: "all" });
  };

  getCurrentWorkFromPath = (path) => {
    return this.props.appState.works.find(item => item.id === _$.getWorkIdFromPath(path));
  };

  setDOM = (ref) => { this.DOM = ref; };

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
        visuals: nextWork.visuals,
        internalLink: true
      },
      {
        title: `${data.translations.previous[language]}: ${prevWork.title}`,
        url: `/work/${prevWork.id}`,
        color: prevWork.color,
        visuals: prevWork.visuals,
        internalLink: true
      },
    ];

    return (
      <div className={styles.Work} ref={this.setDOM}>
        {
          currentWork.details.about[language] && <div className={styles.section}>
            <Section language={language} title={data.translations.about} text={currentWork.details.about} noLowercase />
          </div>
        }
        <div className={styles.section}>
          <Section language={language} title={data.translations.links} items={linkItems} />
        </div>
        {
          currentWork.details.client && <div className={styles.section}>
            <Section language={language} title={data.translations.client} text={currentWork.details.client} />
          </div>
        }
        {
          currentWork.details.agency && <div className={styles.section}>
            <Section language={language} title={data.translations.agency} text={currentWork.details.agency} />
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
          <Section
            language={language}
            title={data.translations.more}
            items={navItems}
            appState={this.props.appState}
            setAppState={this.props.setAppState}
          />
        </div>
      </div>
    );
  }
}

export default Work;
