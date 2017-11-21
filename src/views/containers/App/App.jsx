import { h, Component } from 'preact';
import { withRouter } from 'react-router';
import {
  BrowserRouter as Router,
  Redirect,
  Route
} from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { TimelineMax, TweenMax } from 'gsap';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import UAParser from 'ua-parser-js';

import About from 'Containers/About';
import Canvas from 'Containers/Canvas';
import Headline from 'Containers/Headline';
import Home from 'Containers/Home';
import Loading from 'Containers/Loading';
import Nav from 'Containers/Nav';
import Work from 'Containers/Work';
import withHocWrapper from 'Containers/HocWrapper';
import worksData from 'Containers/Home/Home.data';
import * as _$ from 'utils';

import './reset.global.css';
import './font-awesome.global.css';
import styles from './App.css';

let ConnectedAbout;
let ConnectedCanvas;
let ConnectedHeadline;
let ConnectedHome;
let ConnectedLoading;
let ConnectedNav;
let ConnectedWork;

class App extends Component {
  constructor (...args) {
    super(...args);

    const pageName = _$.getPageName(window.location.pathname);
    const hash = window.location.hash.slice(1);
    const languageFromPath = _$.getLanguageFromPath(window.location.pathname) && _$.getLanguageFromPath(window.location.pathname)[1];
    const languageFromNavigator = navigator.language.slice(0, 2).match(/^(fr|en|ja)$/)
      ? _$.getAppLanguageCode(navigator.language.slice(0, 2))
      : null;

    const audioCtx = this.getContext();

    this.state = {
      language: languageFromPath || languageFromNavigator || _$.getDefaultLanguageCode(),
      env: new UAParser().getResult(),
      aboutLanding: pageName === 'about',
      workLanding: pageName === 'work',
      headlineMode: pageName === 'work' ? 'work' : pageName === 'about' ? 'about' : hash === 'play' ? 'piano' : 'home',
      works: worksData.sections.filter(item => item.name.match('projects|experiments')).map(section => section.items).reduce((acc, item) => [...acc, ...item], []),
      currentWork: null,
      visuals: null,
      midiStatus: false,
      midiLastNote: null,
      initialized: false,
      introAnimComplete: false,
      loadingAnimComplete: false,
      dom: {},
      instances: {},
      audioCtx,
      audio: audioCtx && require('Internal/synth').default,
      getScrollingElement: this.getScrollingElement
    };

    this.state.pointerType = this.state.env.device.type ? 'touch' : 'desktop';
    this.workIdsRegex = this.state.works.map(work => work.id).join('|');
    this.languageCodesRegex = _$.getAppLanguageList().join('|');
    this.rAF = null;
    this.prevScrollTop = null;
    this.currentScrollRatio = 0;

    // iPhone X hack
    if (this.state.env.browser.name.match(/safari/i) && parseInt(this.state.env.browser.major, 10) >= 11) {
      document.querySelector("meta[name=viewport]").content += ',viewport-fit=cover';
    }

    const withAppState = (component) => withHocWrapper(component, { appState: this.state, setAppState: this.setAppState });

    ConnectedAbout = withAppState(About);
    ConnectedCanvas = withAppState(Canvas);
    ConnectedHeadline = withAppState(withRouter(Headline));
    ConnectedHome = withAppState(Home);
    ConnectedLoading = withAppState(Loading);
    ConnectedNav = withAppState(withRouter(Nav));
    ConnectedWork = withAppState(Work);
  }

  componentDidMount () {
    if (!this.state.env.device.type || !this.state.env.device.type.match("mobile|tablet")) {
      this.rAF = requestAnimationFrame(this.paintGradient);
    }
  }

  componentDidUpdate () {
    if (!this.state.initialized && this.state.headlineMode) {
      const dom = this.state.dom;

      const tl = new TimelineMax({ delay: 0.5, onComplete: () => {
        this.setState({ introAnimComplete: true });
      }});

      tl.set(document.querySelector('body'), { overflow: 'hidden' });
      tl.from(dom.canvas, 0.8, { opacity: 0, clearProps: "opacity" });
      tl.add(this.state.instances.loading.play(), 0);
      tl.addLabel("loadingAnimDone");
      dom.headline.querySelector('h1') && tl.from(dom.headline.querySelector('h1'), 0.4, { opacity: 0, y: -12, clearProps: "opacity,transform" });
      dom.headline.querySelector('h2') && tl.from(dom.headline.querySelector('h2'), 0.4, { opacity: 0, y: -12, clearProps: "all" }, "-=0.2");
      dom.piano && tl.from(dom.piano, 0.4, { opacity: 0, y: -12, clearProps: "all" });
      tl.addLabel("headlineDone");
      dom.piano && tl.add(this.state.instances.piano.fadeInKeys(), "headlineDone-=0.4");
      tl.from(dom.appContents, 0.4, { opacity: 0, y: 12, clearProps: "all" }, "headlineDone-=0.2");
      tl.from(dom.nav, 0.4, { opacity: 0, x: 12, clearProps: "all" }, "-=0.2");
      dom.note && tl.from(dom.note, 0.4, { opacity: 0, clearProps: "all" }, "-=0.2");
      tl.set(document.querySelector('body'), { clearProps: 'overflow' });

      this.setState({ initialized: true });
    }
  }

  updateGradient = () => {
    const scrollRatio = this.getScrollRatio();
    const gradientOffset = this.getScrollingElement().scrollTop - (this.state.dom.appWrapper.offsetTop + this.state.dom.app.offsetTop);

    TweenMax.to(this, 0.4, { currentScrollRatio: scrollRatio, onUpdate: () => {
      const string = `to bottom, rgba(0,0,0,1) ${gradientOffset}px, rgba(0,0,0,1) calc(60vh + ${gradientOffset}px), rgba(0,0,0,${this.currentScrollRatio}) calc(95vh + ${gradientOffset}px)`;

      this.state.dom.appWrapper.style.webkitMaskImage = `linear-gradient(${string})`;
      this.state.dom.appWrapper.style.maskImage = `linear-gradient(${string})`;
    }});
  };

  paintGradient = () => {
    this.rAF = requestAnimationFrame(this.paintGradient);

    if (this.prevScrollTop !== this.getScrollingElement().scrollTop) {
      this.updateGradient();
      this.prevScrollTop = this.getScrollingElement().scrollTop;
    }
  };

  getScrollRatio = () => {
    // https://stackoverflow.com/questions/2387136/cross-browser-method-to-determine-vertical-scroll-percentage-in-javascript
    const h = this.getScrollingElement();
    //const b = document.body;
    const st = 'scrollTop';
    const sh = 'scrollHeight';

    if (h[sh] - h.clientHeight <= 0) {
      return 1;
    }

    return (h[st] / (h[sh] - h.clientHeight));
  };

  getScrollingElement = () => document.scrollingElement || document.documentElement;

  getContext = () => {
    if (typeof AudioContext !== "undefined") {
      return new window.AudioContext();
    } else if (typeof webkitAudioContext !== "undefined") {
      return new window.webkitAudioContext();
    } else if (typeof mozAudioContext !== "undefined") {
      return new window.mozAudioContext();
    }

    __IS_DEV__ && console.error("No AudioContext available");
  };

  setDOM = (ref) => { this.setState({ dom: { ...this.state.dom, app: ref } }); };
  setWrapperDOM = (ref) => { this.setState({ dom: { ...this.state.dom, appWrapper: ref } }); };
  setContentsDOM = (ref) => { this.setState({ dom: { ...this.state.dom, appContents: ref } }); };

  setAppState = (updater) => this.setState(updater);

  render () {
    let hasMatch = false;

    return (
      <Router>
        <main id="app" role="main" className={styles.App} ref={this.setDOM}>
          <Helmet
            htmlAttributes={{ lang: _$.getAppLanguageCode(this.state.language) }}
          />
          { !this.state.introAnimComplete && <ConnectedLoading /> }
          <ConnectedCanvas visuals={this.state.visuals} />
          <ConnectedNav />
          <div className={styles.wrapper} ref={this.setWrapperDOM}>
            <ConnectedHeadline mode={this.state.headlineMode} />
            <div className={styles.contents} ref={this.setContentsDOM}>
              <Route exact path={`/:lang(${this.languageCodesRegex})?/(home|)`} children={({ match, history, location }) => {
                if (!hasMatch) hasMatch = !!match;

                return (
                  <TransitionGroup component={_$.getFirstChild}>
                    {match && <ConnectedHome history={history} location={location} />}
                  </TransitionGroup>
                );
              }} />
              <Route exact path={`/:lang(${this.languageCodesRegex})?/about`} children={({ match }) => {
                if (!hasMatch) hasMatch = !!match;

                return (
                  <TransitionGroup component={_$.getFirstChild}>
                    {match && <ConnectedAbout />}
                  </TransitionGroup>
                );
              }} />
              <Route exact path={`/:lang(${this.languageCodesRegex})?/work/(${this.workIdsRegex})`} children={({ match, history, location }) => {
                if (!hasMatch) hasMatch = !!match;

                return (
                  <TransitionGroup component={_$.getFirstChild}>
                    {match && <ConnectedWork history={history} location={location} />}
                  </TransitionGroup>
                );
              }} />
              <Route path={`/:lang(${this.languageCodesRegex})?/*`} render={({ match }) => !hasMatch
                ? <Redirect to={`${match.params.lang ? `/${match.params.lang}` : ''}/home`} />
                : null
              } />
            </div>
          </div>
        </main>
      </Router>
    );
  }
}

export default App;
