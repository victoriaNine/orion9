import { h, Component } from 'preact';
import { withRouter } from 'react-router';
import {
  BrowserRouter as Router,
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
import withAppState from 'Containers/AppState';

import './reset.global.css';
import './font-awesome.global.css';
import styles from './App.css';

let ConnectedAbout;
let ConnectedCanvas;
let ConnectedHeadline;
let ConnectedHome;
let ConnectedNav;

class App extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      language: 'en',
    };

    ConnectedAbout = withAppState(About, this.state, this.setAppState);
    ConnectedCanvas = withAppState(Canvas, this.state, this.setAppState);
    ConnectedHeadline = withAppState(Headline, this.state, this.setAppState);
    ConnectedHome = withAppState(Home, this.state, this.setAppState);
    ConnectedNav = withAppState(withRouter(Nav), this.state, this.setAppState);
  }

  setAppState = (updater, callback) => {
    this.setState(updater, () => {
      if (this.props.debug) {
        console.log('setAppState', JSON.stringify(this.state));
      }
      if (callback) {
        callback();
      }
    });
  };

  componentDidMount() {
    this.updateGradient(this.getGradientOffset());

    document.body.addEventListener("scroll", () => {
      this.updateGradient(this.getGradientOffset());
    });

    window.addEventListener("resize", () => {
      this.updateGradient(this.getGradientOffset());
    });

    const tl = new TimelineMax({ delay: 0.5 });
    tl.from(this.DOM.querySelector(`.${styles.contents}`), 0.4, { opacity: 0, y: 12, clearProps: "all" }, 0.4);
    tl.from(this.navDOM, 0.4, { opacity: 0, x: 12, clearProps: "all" }, "-=0.2");
  }

  getGradientOffset () {
    return document.body.scrollTop - (this.wrapperDOM.offsetTop + this.DOM.offsetTop);
  }

  updateGradient (offset) {
    const string = `top, rgba(0,0,0,1) ${offset}px, rgba(0,0,0,1) calc(60vh + ${offset}px), rgba(0,0,0,${this.getScrollRatio()}) calc(95vh + ${offset}px)`;

    this.wrapperDOM.style.webkitMaskImage = `-webkit-linear-gradient(${string})`;
    this.wrapperDOM.style.maskImage = `linear-gradient(${string})`;
  }

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

  setDOM = (ref) => { this.DOM = ref; };
  setWrapperDOM = (ref) => { this.wrapperDOM = ref; };
  setNavDOM = (ref) => { this.navDOM = ref; };

  getLanguageCode (code) {
    return code === 'jp' ? 'ja' : code;
  }

  render () {
    return (
      <Router>
        <main id="app" role="main" className={styles.App} ref={this.setDOM}>
          <Helmet htmlAttributes={{ lang : this.getLanguageCode(this.state.language) }}/>
          <ConnectedCanvas />
          <ConnectedNav onMount={this.setNavDOM} />
          <div className={styles.wrapper} ref={this.setWrapperDOM}>
            <ConnectedHeadline />
            <div className={styles.contents}>
              <Switch>
                <Route path="/:lang?/home" component={ConnectedHome} />
                <Route path="/:lang?/about" component={ConnectedAbout} />
                <Route component={ConnectedHome} />
              </Switch>
            </div>
          </div>
        </main>
      </Router>
    );
  }
}

export default App;
