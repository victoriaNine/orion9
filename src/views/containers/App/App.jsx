import { h, Component } from 'preact';
import { withRouter } from 'react-router';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { TimelineMax } from 'gsap';

import About from 'Containers/About';
import Canvas from 'Containers/Canvas';
import Headline from 'Containers/Headline';
import Home from 'Containers/Home';
import Nav from 'Containers/Nav';
import Work from 'Containers/Work';
import withAppState from 'Containers/AppState';
import * as _$ from 'utils';

import data from './App.data';
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

    this.state = {
      language: 'en',
      deviceType: 'ontouchstart' in window ? 'mobile' : 'desktop',
      aboutLanding: _$.getPageName(window.location.pathname) === 'about',
      headlineMode: 'default',
      works: worksData.sections.filter(item => item.name.match('projects|experiments')).map(section => section.items).reduce((acc, item) => [...acc, ...item], []),
      currentWork: null,
      midiStatus: false,
      midiLastNote: null,
      dom: {}
    };

    this.workIdsRegex = this.state.works.map(work => work.id).join('|');

    ConnectedAbout = withAppState(About, this.state, this.setAppState);
    ConnectedCanvas = withAppState(Canvas, this.state, this.setAppState);
    ConnectedHeadline = withAppState(Headline, this.state, this.setAppState);
    ConnectedHome = withAppState(Home, this.state, this.setAppState);
    ConnectedNav = withAppState(withRouter(Nav), this.state, this.setAppState);
    ConnectedWork = withAppState(withRouter(Work), this.state, this.setAppState);
  }

  setAppState = (updater) => { this.setState(updater); };
  rAF = null;
  prevScrollTop = null;

  componentDidMount () {
    this.rAF = requestAnimationFrame(this.paintGradient);

    const tl = new TimelineMax({ delay: 0.5 });
    tl.from(this.state.dom.headline.children[0], 0.4, { opacity: 0, y: -12, clearProps: "opacity,transform" });
    tl.from(this.state.dom.headline.children[1], 0.4, { opacity: 0, y: -12, clearProps: "all" }, "-=0.2");
    tl.from(this.state.dom.app.querySelector(`.${styles.contents}`), 0.4, { opacity: 0, y: 12, clearProps: "all" }, 0.4);
    tl.from(this.state.dom.nav, 0.4, { opacity: 0, x: 12, clearProps: "all" }, "-=0.2");
    tl.from(this.state.dom.note, 0.4, { opacity: 0, clearProps: "all" }, "-=0.2");
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

  setDOM = (ref) => { this.setState({ dom: {...this.state.dom, app: ref } }); };
  setWrapperDOM = (ref) => { this.setState({ dom: {...this.state.dom, appWrapper: ref } });  };

  render () {
    const pageTitle = data.translations.pageTitle[this.state.language] && ` — ${data.translations.pageTitle[this.state.language]}`;

    return (
      <Router>
        <main id="app" role="main" className={styles.App} ref={this.setDOM}>
          <Helmet
            htmlAttributes={{ lang : _$.getLanguageCode(this.state.language) }}
            title={`orion9 // victoria nine${pageTitle}`}
          />
          <ConnectedCanvas />
          <ConnectedNav />
          <div className={styles.wrapper} ref={this.setWrapperDOM}>
            <ConnectedHeadline mode={this.state.headlineMode} />
            <div className={styles.contents}>
              <Switch>
                <Route path="/:lang?/home" component={ConnectedHome} />
                <Route path="/:lang?/about" component={ConnectedAbout} />
                <Route path={`/:lang?/work/(${this.workIdsRegex})`} component={ConnectedWork} />
                <Redirect to="/home" />
              </Switch>
            </div>
          </div>
        </main>
      </Router>
    );
  }
}

export default App;
