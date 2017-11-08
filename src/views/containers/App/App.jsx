import { h, Component } from 'preact';
import { withRouter } from 'react-router';
import {
  BrowserRouter as Router,
  Redirect,
  Route
} from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { TimelineMax } from 'gsap';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import UAParser from 'ua-parser-js';

import About from 'Containers/About';
import Canvas from 'Containers/Canvas';
import Headline from 'Containers/Headline';
import Home from 'Containers/Home';
import Nav from 'Containers/Nav';
import Work from 'Containers/Work';
import withHocWrapper from 'Containers/HocWrapper';
import * as _$ from 'utils';
import synth from 'Internal/synth';

import worksData from 'Containers/Home/Home.data';

import './reset.global.css';
import './font-awesome.global.css';
import styles from './App.css';

let ConnectedAbout;
let ConnectedCanvas;
let ConnectedHeadline;
let ConnectedHome;
let ConnectedNav;
let ConnectedWork;

class App extends Component {
  constructor (...args) {
    super(...args);

    const pageName = _$.getPageName(window.location.pathname);
    const hash = window.location.hash.slice(1);

    this.state = {
      language: 'en',
      env: new UAParser().getResult(),
      aboutLanding: pageName === 'about',
      headlineMode: pageName === 'work' ? 'work' : pageName === 'about' ? 'about' : hash === 'play' ? 'piano' : 'home',
      works: worksData.sections.filter(item => item.name.match('projects|experiments')).map(section => section.items).reduce((acc, item) => [...acc, ...item], []),
      currentWork: null,
      visuals: null,
      midiStatus: false,
      midiLastNote: null,
      initialized: false,
      dom: {},
      instances: {},
      audioCtx: this.getContext(),
      synth: this.getContext() && synth
    };

    this.state.pointerType = this.state.env.device.type ? 'touch' : 'desktop';
    this.workIdsRegex = this.state.works.map(work => work.id).join('|');

    // iPhone X hack
    if (this.state.env.browser.name.match(/safari/i) && parseInt(this.state.env.browser.major, 10) >= 11) {
      document.querySelector("meta[name=viewport]").content += ',viewport-fit=cover';
    }

    const withAppState = (component) => withHocWrapper(component, { appState: this.state, setAppState: this.setAppState });

    ConnectedAbout = withAppState(About);
    ConnectedCanvas = withAppState(Canvas);
    ConnectedHeadline = withAppState(Headline);
    ConnectedHome = withAppState(Home);
    ConnectedNav = withAppState(withRouter(Nav));
    ConnectedWork = withAppState(Work);
  }

  rAF = null;
  prevScrollTop = null;

  setAppState = (updater) => { this.setState(updater); };

  componentDidMount() {
    this.rAF = requestAnimationFrame(this.paintGradient);
  }

  componentDidUpdate () {
    if (!this.state.initialized && this.state.headlineMode) {
      const dom = this.state.dom;

      const tl = new TimelineMax({ delay: 0.5 });
      dom.headline.querySelector('h1') && tl.from(dom.headline.querySelector('h1'), 0.4, { opacity: 0, y: -12, clearProps: "opacity,transform" });
      dom.headline.querySelector('h2') && tl.from(dom.headline.querySelector('h2'), 0.4, { opacity: 0, y: -12, clearProps: "all" }, "-=0.2");
      dom.piano && tl.from(dom.piano, 0.4, { opacity: 0, y: -12, clearProps: "all" });
      tl.from(dom.appContents, 0.4, { opacity: 0, y: 12, clearProps: "all" }, "-=0.2");
      tl.from(dom.nav, 0.4, { opacity: 0, x: 12, clearProps: "all" }, "-=0.2");
      dom.note && tl.from(dom.note, 0.4, { opacity: 0, clearProps: "all" }, "-=0.2");

      this.setState({ initialized: true });
    }
  }

  getGradientOffset () {
    return document.body.scrollTop - (this.state.dom.appWrapper.offsetTop + this.state.dom.app.offsetTop);
  }

  updateGradient (offset) {
    const scrollRatio = this.getScrollRatio();
    const string = `to bottom, rgba(0,0,0,1) ${offset}px, rgba(0,0,0,1) calc(60vh + ${offset}px), rgba(0,0,0,${scrollRatio}) calc(95vh + ${offset}px)`;

    this.state.dom.appWrapper.style.webkitMaskImage = `linear-gradient(${string})`;
    this.state.dom.appWrapper.style.maskImage = `linear-gradient(${string})`;
  }

  paintGradient = () => {
    this.rAF = requestAnimationFrame(this.paintGradient);

    if (this.prevScrollTop !== document.body.scrollTop) {
      this.updateGradient(this.getGradientOffset());
      this.prevScrollTop = document.body.scrollTop;
    }
  };

  getScrollRatio () {
    // https://stackoverflow.com/questions/2387136/cross-browser-method-to-determine-vertical-scroll-percentage-in-javascript
    const h = document.documentElement;
    const b = document.body;
    const st = 'scrollTop';
    const sh = 'scrollHeight';

    if (b[sh] - h.clientHeight <= 0) {
      return 1;
    }

    return (b[st] / (b[sh] - h.clientHeight));
  }

  getContext () {
    if (typeof AudioContext !== "undefined") {
      return new window.AudioContext();
    } else if (typeof webkitAudioContext !== "undefined") {
      return new window.webkitAudioContext();
    } else if (typeof mozAudioContext !== "undefined") {
      return new window.mozAudioContext();
    }

    __IS_DEV__ && console.error("No AudioContext available");
  }

  setDOM = (ref) => { this.setState({ dom: { ...this.state.dom, app: ref } }); };
  setWrapperDOM = (ref) => { this.setState({ dom: { ...this.state.dom, appWrapper: ref } }); };
  setContentsDOM = (ref) => { this.setState({ dom: { ...this.state.dom, appContents: ref } }); };

  render () {
    let hasMatch = false;

    return (
      <Router>
        <main id="app" role="main" className={styles.App} ref={this.setDOM}>
          <Helmet
            htmlAttributes={{ lang : _$.getLanguageCode(this.state.language) }}
          />
          <ConnectedCanvas visuals={this.state.visuals} />
          <ConnectedNav />
          <div className={styles.wrapper} ref={this.setWrapperDOM}>
            <ConnectedHeadline mode={this.state.headlineMode} />
            <div className={styles.contents} ref={this.setContentsDOM}>
              <Route exact path="/:lang?/(home|)" children={({ match }) => {
                if (match) { hasMatch = true; }
                return (
                  <TransitionGroup component={_$.getFirstChild}>
                    {match && <ConnectedHome />}
                  </TransitionGroup>
                );
              }} />
              <Route exact path="/:lang?/about" children={({ match }) => {
                if (match) { hasMatch = true; }
                return (
                  <TransitionGroup component={_$.getFirstChild}>
                    {match && <ConnectedAbout />}
                  </TransitionGroup>
                );
              }} />
              <Route exact path={`/:lang?/work/(${this.workIdsRegex})`} children={({ match, history, location }) => {
                if (match) { hasMatch = true; }
                return (
                  <TransitionGroup component={_$.getFirstChild}>
                    {match && <ConnectedWork history={history} location={location} />}
                  </TransitionGroup>
                );
              }} />
              <Route path="/:lang?/*" render={({ match }) => !hasMatch
                ? <Redirect to={`${match.params.lang && _$.getLanguageFromPath(`/${match.params.lang}/`) ? `/${match.params.lang}` : ''}/home`} />
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
